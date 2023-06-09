import Image from "next/image";
import { Inter } from "next/font/google";
import { GetStaticProps, GetServerSideProps } from "next";
import { getSortedPostsData, memoriesCol } from "../lib/memories";
import Link from "next/link";
import Layout from "@/components/layout";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });
// mongodbからデータを取得したい
// onload
// 再読込ボタン

// データの取得が遅くて、たまに取得できないまま返す事がある
export const getServerSideProps: GetServerSideProps = async (context) => {
  // const res = context.res;
  // res.setHeader("Cache-Control", "no-store, max-age=0");

  // これ使うと追加したデータが反映されない。ビルド時に静的ページとして作成しまうため
  // export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = await getSortedPostsData();
  console.log("server:", allPostsData.length);
  return {
    props: {
      allPostsData,
    },
  };
};

export default function Home({ allPostsData = [] }: { allPostsData: memoriesCol[] }) {
  // export default async function Home({}) {
  // const allPostsData = await getSortedPostsData();
  console.log(allPostsData.length);
  return (
    <Layout home>
      <Head>
        <title>I Can Sings</title>
      </Head>
      <main className={`flex min-h-screen flex-col items-center justify-between py-4 ${inter.className}`}>
        {/* https://tailblocks.cc/ */}
        <section className="text-gray-300 body-font w-full">
          <div className="container px-5 py-4 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-100">I can Sings</h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                <Link className="text-green-400" href="memories/edit">
                  Add→
                </Link>
              </p>
            </div>
            {/* ここループ */}
            <div className="flex flex-wrap -m-2">
              {allPostsData.map((rec) => (
                <div className="p-2 w-full lg:w-1/4 md:w-1/3 sm:w-1/2" key={`${rec.author}-${rec.title}`}>
                  <Link href={`memories/${rec.author}-${rec.title}`}>
                    <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                      <div className="flex-grow">
                        <h2 className="text-gray-100 title-font font-medium">{rec.title}</h2>
                        <p className="text-gray-400">{rec.author}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
