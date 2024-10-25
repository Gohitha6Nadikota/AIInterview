"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
//import { useAuth } from "@clerk/nextjs";
export default function Home() {
  const router = useRouter();
  //const { signOut } = useAuth();

  const handleSignIn = () => {
    router.push("/sign-in");
  };
  const handleSignUp = () => {
    router.push("/sign-up");
  };
  const handleSignOut = () => {
    signOut()
      .then(() => {
        router.push("/sign-in");
      })
      .catch((error) => {
        console.error("Sign out failed", error);
      });
  };

  return (
    <div className="w-[100vw] flex md:flex-row h-[100vh]  md:bg-[#008C9E] text-black">
      <div className="w-1 md:w-1/2 h-[50vh] md:h-[60vh] mt-[40vh] items-center flex flex-col justify-start gap-10">
        <h1 className="text-2xl font-bold text-[#FF8225]">
          Prove Your Potential
        </h1>
        <h2 className="text-xl text-[#FF8225]">
          Elevate your interview skills with actionable insights.
        </h2>
        <div className="flex gap-10">
          <Button
            className="bg-[#FF8225] text-black hover:bg-[#b5aa46] hover:text-white transition duration-200"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          <Button
            className="bg-[#FF8225] text-black hover:bg-[#c7d24f] hover:text-white transition duration-200"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          {/*<Button onClick={handleSignOut}>Sign Out</Button>*/}
        </div>
      </div>
      <div
        className="w-100 md:w-1/2 bg-cover bg-center h-[50vh] md:h-[100vh]"
        style={{
          backgroundImage: `url('/home.jpeg')`,
        }}
      ></div>
    </div>
  );
}
