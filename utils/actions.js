"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, lt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { generateJson } from "@/utils/ai";

const MIN_ANSWER_LENGTH = 10;

const getUserEmail = async () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) {
    throw new Error("User email not found");
  }
  return email;
};

const getOwnedInterview = async (mockId, email) => {
  const [interview] = await db
    .select()
    .from(MockInterview)
    .where(and(eq(MockInterview.mockId, mockId), eq(MockInterview.createdBy, email)));
  return interview ?? null;
};

const toClientInterview = (interview) => ({
  mockId: interview.mockId,
  jobPosition: interview.jobPosition,
  jobDescription: interview.jobDescription,
  jobExperience: interview.jobExperience,
  createdAt: interview.createdAt,
  questions: JSON.parse(interview.jsonMockResp).map((q) => ({ question: q.question })),
});

export const createInterview = async ({ role, desc: description, exp }) => {
  const email = await getUserEmail();
  const experience = Number(exp);
  if (!role?.trim() || !description?.trim() || !Number.isFinite(experience) || experience < 0) {
    throw new Error("Invalid interview details");
  }

  const prompt =
    "Job Position: " + role.trim() + "\n" +
    "Job Description: " + description.trim() + "\n" +
    "Years of Experience: " + experience + "\n" +
    "Based on this information give 5 interview questions with answers. " +
    'Respond with JSON only, as an array of objects: [{"question": "...", "answer": "..."}]';
  const parsed = await generateJson(prompt);
  const questions = Array.isArray(parsed) ? parsed : Object.values(parsed ?? {}).find(Array.isArray);
  if (!questions?.length || !questions.every((q) => q?.question)) {
    throw new Error("Unexpected AI response shape");
  }

  const [created] = await db
    .insert(MockInterview)
    .values({
      mockId: uuidv4(),
      jsonMockResp: JSON.stringify(questions.map((q) => ({ question: q.question, answer: q.answer ?? "" }))),
      jobPosition: role.trim(),
      jobDescription: description.trim(),
      jobExperience: String(experience),
      createdBy: email,
      createdAt: moment().format("DD-MM-YYYY"),
    })
    .returning({ mockId: MockInterview.mockId });
  return created.mockId;
};

export const listInterviews = async () => {
  const email = await getUserEmail();
  const rows = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(desc(MockInterview.id));
  return rows.map((row) => ({
    id: row.id,
    mockId: row.mockId,
    jobPosition: row.jobPosition,
    jobExperience: row.jobExperience,
    createdAt: row.createdAt,
  }));
};

export const getInterview = async (mockId) => {
  const email = await getUserEmail();
  const interview = await getOwnedInterview(mockId, email);
  return interview ? toClientInterview(interview) : null;
};

export const saveAnswer = async ({ mockId, questionIndex, userAns }) => {
  const email = await getUserEmail();
  const interview = await getOwnedInterview(mockId, email);
  if (!interview) {
    throw new Error("Interview not found");
  }
  const question = JSON.parse(interview.jsonMockResp)[questionIndex];
  const answer = userAns?.trim() ?? "";
  if (!question?.question || answer.length < MIN_ANSWER_LENGTH) {
    throw new Error("Invalid answer");
  }

  const prompt =
    "You are grading a single mock interview answer. Use only the question and answer below.\n" +
    "Question: " + question.question + "\n" +
    "User answer: " + answer + "\n" +
    'Respond with JSON only: {"rating": <integer 1-10>, "feedback": "<3 to 5 lines on areas of improvement>"}';
  const aiResp = await generateJson(prompt);
  const rating = Number.parseFloat(aiResp?.rating);

  const [inserted] = await db
    .insert(UserAnswer)
    .values({
      mockIdRef: mockId,
      question: question.question,
      correctAns: question.answer,
      userAns: answer,
      feedback: aiResp?.feedback ?? "",
      rating: Number.isFinite(rating) ? String(rating) : null,
      userEmail: email,
      createdAt: moment().format("DD-MM-YYYY"),
    })
    .returning({ id: UserAnswer.id });

  await db
    .delete(UserAnswer)
    .where(
      and(
        eq(UserAnswer.mockIdRef, mockId),
        eq(UserAnswer.question, question.question),
        eq(UserAnswer.userEmail, email),
        lt(UserAnswer.id, inserted.id)
      )
    );
};

export const hasAnswers = async (mockId) => {
  const email = await getUserEmail();
  const rows = await db
    .select({ id: UserAnswer.id })
    .from(UserAnswer)
    .where(and(eq(UserAnswer.mockIdRef, mockId), eq(UserAnswer.userEmail, email)))
    .limit(1);
  return rows.length > 0;
};

export const getFeedback = async (mockId) => {
  const email = await getUserEmail();
  const rows = await db
    .select()
    .from(UserAnswer)
    .where(and(eq(UserAnswer.mockIdRef, mockId), eq(UserAnswer.userEmail, email)))
    .orderBy(UserAnswer.id);
  const latestByQuestion = new Map();
  rows.forEach((row) => latestByQuestion.set(row.question, row));
  return [...latestByQuestion.values()].map((row) => ({
    id: row.id,
    question: row.question,
    correctAns: row.correctAns,
    userAns: row.userAns,
    feedback: row.feedback,
    rating: row.rating,
  }));
};
