import styles from "./layout.module.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Layout({ children, home, edit }: { children: React.ReactNode; home?: boolean; edit?: boolean }) {
  return (
    <div className={styles.container}>
      {!home && <Header />}
      <main>{children}</main>
      {(edit || !home) && <Footer />}
    </div>
  );
}
