"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { errorMessages } from "@/lib/constants";
import { X } from "lucide-react";

const AuthError = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-200">
        <div className="mx-auto mb-4 bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
          <X color="red" size={"2rem"} />
        </div>

        <h1 className="text-2xl font-bold text-red-500 mb-2">
          Authentication Error
        </h1>

        <p className="text-gray-700 mb-6">
          {errorMessages[error as keyof typeof errorMessages] ||
            errorMessages.default}
        </p>

        <Link
          href="/auth/signin"
          className="inline-block bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-lg shadow transition"
        >
          Try again
        </Link>
      </div>
    </div>
  );
};

export default AuthError;
