import Image from "next/image";
import styles from "./ScanButton.module.css";

export default function ScanButton() {
  return (
    <>
      <a href="/scan" className={styles.button}>
        <Image
          className={styles.scanIcon}
          src="/barcode_scan.svg"
          alt="scanButton"
          width={60}
          height={60}
        />
      </a>
    </>
  );
}
