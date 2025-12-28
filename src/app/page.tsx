"use client";

import { BrowserMultiFormatOneDReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import {
  BarcodeFormat,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";
import styles from "./page.module.css";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatOneDReader | null>(null);

  const [isbn, setIsbn] = useState<string | null>(null);

  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 360 },
      aspectRatio: { ideal: 2 / 1 },
    },
  };

  useEffect(() => {
    if (!videoRef.current) return;

    // 特定のバーコードのみ読み取り
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13]);

    const codeReader = new BrowserMultiFormatOneDReader(hints);
    readerRef.current = codeReader;

    codeReader.decodeFromConstraints(
      constraints,
      videoRef.current,
      (result, error, controls) => {
        if (result) {
          const text = result.getText();
          if (text.startsWith("978") || text.startsWith("979")) {
            setIsbn(text);
            console.log("isbn", text);
          } else return;
          // controls.stop();
        }
        if (error && !(error instanceof NotFoundException)) {
          console.log("error", error);
        }
      },
    );
  }, []);

  return (
    <div>
      <div className={styles.scanner}>
        <video
          ref={videoRef}
          className={styles.video}
          playsInline
          muted
          autoPlay
        />
        <div className={styles.scanLine}></div>
      </div>

      <p>{isbn}</p>
    </div>
  );
}
