"use client";

import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>PDF chat</span>
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            {/* {todo: create links for dashboard and auth} */}
            {session?.user ? (
              <Button onClick={() => signOut({ callbackUrl: "/" })}>
                Log out <LogOut />
              </Button>
            ) : (
              <Button onClick={() => router.push("/auth/signin")}>
                Sing in
              </Button>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
