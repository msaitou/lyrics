import styles from "@/components/layout.module.css";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="">
      <div className={styles.backToHome}>
        <Link href="/">← Back to home</Link>
      </div>
    </footer>
  );
}
