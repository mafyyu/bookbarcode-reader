"use client";
import { SignUp } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <SignUp routing="hash" fallbackRedirectUrl="/library" />
    </div>
  );
}
