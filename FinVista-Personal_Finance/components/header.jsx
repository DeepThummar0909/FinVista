import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, LineChart } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-lg z-50 shadow-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        {/* <Link href="/">
          <Image
            src="/logo.png"
            alt="Welth Logo"
            width={600}
            height={407}
            className="h-12 w-auto object-contain"
          />
        </Link> */}

        {/* Navigation (Signed Out) */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <SignedOut>
            <a href="#features" className="hover:text-primary transition">
              Features
            </a>
            <a href="#testimonials" className="hover:text-primary transition">
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href="/transaction/create">
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>

            <Link href="/Investement">
              <Button
                className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 transition-shadow shadow-md"
              >
                <LineChart size={18} />
                <span className="hidden md:inline">Manage Investment</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="ghost" className="hover:bg-gray-100">
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
