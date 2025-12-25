"use client";

import {
  BrowserMultiFormatOneDReader,
  BrowserCodeReader,
} from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import {
  BarcodeFormat,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatOneDReader | null>(null);

  const [isbn, setIsbn] = useState<string | null>(null);

  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 },
      aspectRatio: { ideal: 4 / 3 },
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
          console.log("isbn", result.getText());
          setIsbn(result.getText());
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
      <video ref={videoRef} style={{ width: "100%", maxWidth: 360 }} />
      <p>{isbn}</p>
    </div>
  );
}
