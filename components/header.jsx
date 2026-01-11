"use client";
import { User } from 'lucide-react'
import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from 'next/link'
import Image from 'next/image';
const Header = () => {
  return (
    <header>
        <nav>
            <Link href="/">
            <Image src={"/logo.png"} alt="AI Career Logo" width={120} height={40} className="h-12 py-1 w-auto object-contain"/>
            </Link>
        </nav>
    
        <SignedOut>
              <SignInButton />
              
            </SignedOut>
        <SignedIn>
            <UserButton/>
        </SignedIn>
    </header>
  )
}

export default Header