"use client";

import { SignIn } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <SignIn routing="hash" fallbackRedirectUrl="/library" />
    </div>
  );
}
