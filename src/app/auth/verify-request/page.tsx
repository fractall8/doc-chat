"use client";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

const VerifyRequest = () => {
  return (
    <MaxWidthWrapper>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-violet-100 p-4 rounded-full">
              <Mail className="w-10 h-10 text-violet-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Check your email 📩
          </h1>

          <p className="text-gray-500 mb-6">
            We have sent you a magic link to log in. Please check your inbox and
            click the link to continue.
          </p>

          <Link href="/">
            <Button className=" text-white w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default VerifyRequest;
