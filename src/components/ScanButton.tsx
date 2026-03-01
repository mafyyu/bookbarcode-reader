import Image from "next/image";
import styles from "./ScanButton.module.css";

export default function ScanButton({
  variant = "fab",
}: {
  variant?: "fab" | "text";
}) {
  if (variant === "text") {
    return (
      <a href="/scan" className={styles.textButton}>
        ＋ 追加
      </a>
    );
  }

  return (
    <a href="/scan" className={styles.fabButton}>
      <Image
        className={styles.scanIcon}
        src="/barcode_scan.svg"
        alt="scanButton"
        width={60}
        height={60}
      />
    </a>
  );
}
