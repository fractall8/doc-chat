"use client";

import { useState } from "react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { errorMessages } from "@/lib/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-center justify-center h-screen">
        {error && (
          <div className="flex items-center bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl shadow-md max-w-md w-full gap-4 mb-6">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <X />
            </div>

            <div className="flex flex-col">
              <p className="font-semibold text-lg mb-1">Authentication Error</p>
              <p className="text-sm">
                {errorMessages[error] ||
                  "Something went wrong. Please try again."}
              </p>
            </div>
          </div>
        )}
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Welcome Back 👋
          </h1>
          <p className="text-center text-gray-500 mt-2 mb-6">
            Sign in to continue to your dashboard
          </p>

          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full"
          >
            Sign in with Google
          </Button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div>
            <p className="text-center text-gray-500 mb-2">
              Continue with email
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:violet-blue-400 transition"
            />

            <Button
              onClick={() =>
                signIn("email", { email, callbackUrl: "/dashboard" })
              }
              className="w-full"
            >
              Send Magic Link
            </Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Login;
