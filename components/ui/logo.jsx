// components/ui/Logo.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "../../public/Icons/Logo 3.png";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={className}>
      <Image
        src={logoImg}
        alt="Logo"
        className="h-14 w-auto object-contain"
        priority
      />
    </Link>
  );
}