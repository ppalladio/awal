import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";
import getCurrentUser from "@/app/actions/get/getCurrentUser";

export async function AppBar () {
	const user = await getCurrentUser();
	console.log(user)
  return (
    <header className="flex gap-4 p-4 bg-gradient-to-b from-white to-gray-200 shadow">
      <Link className="transition-colors hover:text-blue-500" href={"/"}>
        Home Page
      </Link>

      <SignInButton />
    </header>
  );
};

export default AppBar;