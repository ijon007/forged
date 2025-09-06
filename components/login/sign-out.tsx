"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/actions/auth-actions";
import { Button } from "../ui/button";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <Button
      className="flex h-8 w-full cursor-pointer flex-row items-center justify-start bg-transparent py-0 text-red-500 hover:bg-red-500/20"
      onClick={handleSignOut}
      variant="default"
    >
      <LogOut />
      <span>Sign Out</span>
    </Button>
  );
};

export default SignOut;
