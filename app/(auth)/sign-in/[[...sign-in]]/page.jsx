"use client";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();

  return (
    <section className="bg-white">
      <div className="lg:grid lg:grid-cols-12 lg:min-h-screen">
        <aside className="relative lg:col-span-5 xl:col-span-6 h-full">
          <div
            className="w-100 bg-cover bg-center h-[50vh] md:h-[100vh]"
            style={{
              backgroundImage: `url('/login.webp')`,
            }}
          ></div>
        </aside>
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 xl:col-span-6 lg:px-16 lg:py-12 bg-[#FFCF9D]">
          <div className="w-full max-w-2xl mx-auto flex items-center justify-center flex-col">
            <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
              Welcome!
            </h1>
            <div className="mt-8 w-full flex items-center justify-center">
              <SignIn />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
