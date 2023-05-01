import Image from "next/image";
import { Inter } from "next/font/google";
import { GetStaticProps } from "next";
import { getSortedPostsData, getAllPostIds, memoriesCol } from "../lib/memories";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });
// mongodbからデータを取得したい
// onload
// 再読込ボタン

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  const paths = getAllPostIds();
  return {
    props: {
      allPostsData,
    },
  };
};

export default function Home({ allPostsData }: { allPostsData: memoriesCol[] }) {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between py-4 ${inter.className}`}>
      {/* https://tailblocks.cc/ */}
      <section className="text-gray-300 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-100">Our Team</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              僕の歌えるやつ<Link className="text-gray-400" href="memories/edit">追加</Link>
            </p>
          </div>
          {/* ここループ */}
          <div className="flex flex-wrap -m-2">
            {allPostsData.map((rec) => (
              <div className="p-2 w-full">
                <Link href={`memories/${rec.author}-${rec.title}`}>
                  <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                    <div className="flex-grow">
                      <h2 className="text-gray-100 title-font font-medium">{rec.author}</h2>
                      <p className="text-gray-400">{rec.title}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
