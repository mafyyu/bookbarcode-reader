"use client";
import Image from "next/image";
import Link from "next/link";

const styles = {
  linkContainer: {
    display: "flex",
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "none",
    border: "none",
    zIndex: 9999,
  },
  closeIcon: {
    width: "40px",
    height: "40px",
  },
} as const;

type CloseHeaderProps = {
  href: string;
};

export default function CloseHeader({ href }: CloseHeaderProps) {
  return (
    <Link href={href} style={styles.linkContainer}>
      <Image
        style={styles.closeIcon}
        src="/close.svg"
        alt="close"
        width={40}
        height={40}
      />
    </Link>
  );
}
