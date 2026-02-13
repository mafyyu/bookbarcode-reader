"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Divider from "@/components/Divider";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: "その場で重複チェック",
      description:
        "本屋でもフリマでも、ISBNを読み取って自分の本棚とすぐ照合できます。",
    },
    {
      title: "持ってる/積んでるを整理",
      description:
        "状態を分けて記録できるから、買い忘れもダブり買いも減らせます。",
    },
    {
      title: "画像つきで見返しやすい",
      description:
        "書影とタイトルが並ぶので、紙のメモより探しやすく管理が続きます。",
    },
  ];

  const steps = [
    "ログインして本棚を作る",
    "バーコードを読み取る",
    "購入前に同じ本がないか確認する",
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.brand}>BOOK CHECKER</p>
        <button
          className={styles.ghostButton}
          onClick={() => {
            router.push("/login");
          }}
        >
          ログイン
        </button>
      </header>
      <main className={styles.mainContainer}>
        <section className={styles.heroContainer}>
          <p className={`${styles.fadeIn} ${styles.kicker}`}>
            買う前に、3秒で確認
          </p>
          <h1 className={`${styles.fadeIn} ${styles.heroTitle} `}>
            この本、
            <br />
            家にあったっけ？
          </h1>

          <p className={`${styles.fadeIn} ${styles.delay1} ${styles.subText}`}>
            買う前に、カメラをかざして確認。
            <br />
            本屋でも、ネットでも、ダブり買いを防ぐための本棚管理。
          </p>

          <div
            className={`${styles.fadeIn} ${styles.delay2} ${styles.heroButtons}`}
          >
            <button
              className={styles.primaryButton}
              onClick={() => {
                router.push("/login");
              }}
            >
              無料で始める
            </button>
            <a href="#how" className={styles.linkButton}>
              使い方を見る
            </a>
          </div>

          <div
            className={`${styles.fadeIn} ${styles.delay3} ${styles.statsPanel}`}
          >
            <p>重複購入の「不安」を、購入前の「確信」に。</p>
          </div>
        </section>

        <section className={styles.featureSection}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          ))}
        </section>

        <section id="how" className={styles.howSection}>
          <h2>使い方</h2>
          <div className={styles.stepGrid}>
            {steps.map((step, index) => (
              <article key={step} className={styles.stepCard}>
                <p className={styles.stepNumber}>STEP {index + 1}</p>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>今ある本棚から、はじめよう。</h2>
          <button
            className={styles.primaryButton}
            onClick={() => {
              router.push("/login");
            }}
          >
            今すぐ無料ではじめる
          </button>
        </section>
      </main>
      <footer className={styles.footer}>
        <Divider />
        <a href="https://developers.rakuten.com/" target="_blank">
          Supported by Rakuten Developers
        </a>
      </footer>
    </div>
  );
}
