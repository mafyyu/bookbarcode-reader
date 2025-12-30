"use client";
import { BrowserMultiFormatOneDReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import {
  BarcodeFormat,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";
import CloseHeader from "@/components/CloseHeader";
import BookDetail from "@/components/BookDetail";
import Divider from "@/components/Divider";
import OwnedStatusBadge from "@/components/OwnedStatusBadge";
import LibraryActionButton from "@/components/LibraryActionButton";
import styles from "./page.module.css";
import z from "zod";
import { BookResponseSchema } from "../api/books/route";

type Book = z.infer<typeof BookResponseSchema>;

export default function Scan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatOneDReader | null>(null);

  const [isbn, setIsbn] = useState<string>("");
  const [isScanning, setIsScanning] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [result, setResult] = useState<Book | null>(null);

  // カメラ操作
  useEffect(() => {
    if (!videoRef.current) return;

    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 360 },
        aspectRatio: { ideal: 2 / 1 },
      },
    };

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
            controls.stop();
            setIsScanning(false);
          } else return;
        }
        if (error && !(error instanceof NotFoundException)) {
          console.log("error", error);
        }
      },
    );
  }, [isScanning]);

  // 情報のfetch
  useEffect(() => {
    if (isbn.length === 13) {
      const fetchBook = async () => {
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isbn }),
        });
        const data = await res.json();
        setResult(data);
      };
      fetchBook();
    }
  }, [isbn]);

  return (
    <>
      <header className={styles.header}>
        <CloseHeader></CloseHeader>
      </header>
      <main>
        {isScanning && (
          <div>
            <div className={styles.scanner}>
              <video
                ref={videoRef}
                className={styles.video}
                playsInline
                muted
                autoPlay
                onLoadedMetadata={() => {
                  setCameraReady(true);
                }}
              />
              {cameraReady && <div className={styles.scanLine}></div>}
            </div>

            <h3 className={styles.faildScan}>読み取れない場合</h3>
            <div className={styles.container}>
              <input
                className={styles.input}
                type="tel"
                inputMode="numeric"
                name="isbn"
                id="isbn"
                maxLength={13}
                required
                placeholder="9784123456789"
                pattern="^[\x00-\x7F]+$"
                title="本の裏表紙にある「9から始まる13桁の数字（ISBN）」を入力してください"
                onChange={(e) => {
                  setIsbn(e.target.value.replace(/[^0-9]/g, ""));
                }}
              />
              <button
                className={styles.searchButton}
                type="button"
                disabled={isbn.length != 13 || !isScanning}
              >
                検索
              </button>
            </div>
          </div>
        )}
        {!isScanning && result && (
          <div>
            <div className={styles.divider}>
              <Divider text="スキャン結果"></Divider>
            </div>
            <BookDetail book={result}></BookDetail>
            <OwnedStatusBadge isOwned={true}></OwnedStatusBadge>
            <LibraryActionButton status={"owned"}></LibraryActionButton>
            <button
              className={styles.rescan}
              onClick={() => {
                setIsScanning(true);
              }}
            >
              もう一度スキャン
            </button>
          </div>
        )}
      </main>
    </>
  );
}
