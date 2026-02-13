import styles from "./page.module.css";
import Divider from "@/components/Divider";
import { SignUp } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignUp fallbackRedirectUrl={"/library"}></SignUp>
    </div>
  );
}
