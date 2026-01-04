"use client";
import { BrowserMultiFormatOneDReader } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarcodeFormat,
  DecodeHintType,
  NotFoundException,
} from "@zxing/library";
import CloseHeader from "@/components/CloseHeader";
import BookPreview from "@/components/BookPreview";
import Divider from "@/components/Divider";
import OwnedStatusBadge from "@/components/OwnedStatusBadge";
import LibraryActionButton from "@/components/LibraryActionButton";
import styles from "./page.module.css";
import z from "zod";
import { BookSchema } from "@/lib/schema/book";
import { addBook } from "@/lib/addBook";
import { addUserBook } from "@/lib/addUserBook";
import { updateOwnStatus } from "@/lib/updateOwnStatus";

type Book = z.infer<typeof BookSchema>;
type LibraryStatus = "not_in_library" | "in_library" | "owned";

export default function Scan() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatOneDReader | null>(null);

  const [isbn, setIsbn] = useState<string>("");
  const [isScanning, setIsScanning] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [result, setResult] = useState<Book[] | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<LibraryStatus>("not_in_library");
  const [loading, setLoading] = useState<boolean>(false);

  // 情報の取得
  const fetchBook = useCallback(async (isbn: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn }),
      });
      const data = await res.json();
      setResult(data);

      if (data && data.length > 0) {
        const userBooksRes = await fetch(
          `/api/user-books/status?isbn=${data[0].isbn}`,
        );
        const resData = await userBooksRes.json();
        setStatus(resData.status);
      }
    } catch (error) {
      console.log("fetchbook error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // カメラ操作
  useEffect(() => {
    if (!videoRef.current) return;
    let stream: MediaStream | null = null;

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
        if (!stream && videoRef.current?.srcObject instanceof MediaStream) {
          stream = videoRef.current.srcObject;
        }
        if (result) {
          const text = result.getText();
          if (text.startsWith("978") || text.startsWith("979")) {
            setIsbn(text);
            fetchBook(text);
            controls.stop();
            setIsScanning(false);
          } else return;
        }
        if (error && !(error instanceof NotFoundException)) {
          console.log("error", error);
        }
      },
    );
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isScanning, fetchBook]);

  // dbに追加する処理
  const handleAdd = async (isOwned: boolean) => {
    setIsSaving(true);
    if (!result) {
      setIsSaving(false);
      return;
    }
    try {
      await addBook(result[0]);
      await addUserBook(result[0], isOwned);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  // 購入済みに変更する
  const handleUpdate = async () => {
    if (!result) {
      return;
    }
    try {
      await updateOwnStatus(result[0], true);
      router.push("/");
    } catch (error) {
      console.error("Failed to update book status:", error);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <CloseHeader
          onClose={() => {
            router.push("/");
          }}
        />
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
                onClick={() => {
                  setIsScanning(false);
                  fetchBook(isbn);
                }}
              >
                検索
              </button>
            </div>
          </div>
        )}
        {!isScanning && result && !loading && (
          <div className={styles.mainContainer}>
            <Divider text="スキャン結果"></Divider>
            <BookPreview book={result}></BookPreview>
            <OwnedStatusBadge status={status}></OwnedStatusBadge>
            <LibraryActionButton
              status={status}
              onAddOwned={
                status == "not_in_library" ? () => handleAdd(true) : undefined
              }
              onAddNotOwned={
                status == "not_in_library" ? () => handleAdd(false) : undefined
              }
              onChangeOwned={status == "in_library" ? handleUpdate : undefined}
              disabled={isSaving}
            ></LibraryActionButton>
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
