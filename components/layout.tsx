import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

const name = "saito masato";
export const siteTitle = "Next.js Sample Website";

export default function Layout({
  children,
  home,
  edit,
}: {
  children: React.ReactNode;
  home?: boolean;
  edit?: boolean;
}) {
  return (
    <div className={styles.container}>
      {/* <Head>
        <meta name="description" content="Learn how to build a personal website using Next.js" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head> */}
      <main>{children}</main>
      {!home && !edit && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
}
