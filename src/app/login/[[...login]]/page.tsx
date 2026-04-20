"use client";

import { SignUp } from "@clerk/nextjs";

export default function LoginPage() {
  return <SignUp routing="hash" fallbackRedirectUrl="/library" />;
}
