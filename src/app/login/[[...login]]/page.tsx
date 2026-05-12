"use client";
import { SignUp } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function LoginPage() {
  console.log(styles);
  return (
    <body>
      <div className={styles.container}>
        <SignUp routing="hash" fallbackRedirectUrl="/library" />
      </div>
    </body>
  );
}
