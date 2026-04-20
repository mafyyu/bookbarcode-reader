import Image from "next/image";
import styles from "./ScanButton.module.css";
import Link from "next/link";

export default function ScanButton({
  variant = "fab",
}: {
  variant?: "fab" | "text";
}) {
  if (variant === "text") {
    return (
      <Link href="/scan" className={styles.textButton}>
        ＋ 追加
      </Link>
    );
  }

  return (
    <Link href="/scan" className={styles.fabButton}>
      <Image
        className={styles.scanIcon}
        src="/barcode_scan.svg"
        alt="バーコードをスキャン"
        width={60}
        height={60}
      />
    </Link>
  );
}
