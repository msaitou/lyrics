/** @format */
// @/lib/memories.ts
import { unstable_noStore as noStore } from "next/cache";
import { PrismaClient, Memory } from "@prisma/client";
import { getMemories, memoriesCol } from "@/app/api/db/route";
export const { DB_TYPE } = process.env;

const prisma = new PrismaClient();

export const DBCONF = clientDBCONF(DB_TYPE);
function clientDBCONF(dbType?: string) {
  return { isSqlite3: () => dbType == "sqlite3", isMongdb: () => dbType == "mongodb" };
}
export function castPrimaryKey(data: { _id: any }) {
  if (DBCONF.isSqlite3())
    return { id: Number(data._id) }; // idで、Int型
  else if (DBCONF.isMongdb()) return { _id: data._id };
  else return {};
}

export async function getSortedPostsData() {
  noStore();
  const allPostsData = await getMemories({});
  return allPostsData.sort((a, b) => {
    if (a.author !== b.author) {
      if (a.author < b.author) return -1;
      if (a.author > b.author) return 1;
    }
    if (a.title !== b.title) {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
    }
    return 0;
  });
}

export async function getAllPostIds() {
  noStore();
  let recs: memoriesCol[] = await getMemories({});
  return recs.map((rec) => {
    return {
      params: {
        author_title: `${rec.author}-${rec.title}`,
      },
    };
  });
}

export async function getPostData(author_title: string) {
  noStore();
  if (author_title && author_title != "<no source>") {
    console.log("author_title", author_title);
    let para = author_title.split("-");
    let recs: any;
    if (typeof window !== "undefined") {
      const baseUrl = window.location.protocol + "//" + window.location.host;
      const url = new URL("/api/db?kind=memories", baseUrl);
      url.searchParams.append("title", para[1]);
      url.searchParams.append("author", para[0]);
      recs = await (await fetch(url)).json();
      // console.log(recs.json(), 9999);
    } else {
      // let recs: memoriesCol[] = await getMemories({
      recs = await getMemories({
        title: para[1],
        author: para[0],
      });
    }
    // console.log("recs[0]", recs[0]);
    const processedContent = recs[0].lyric;
    recs[0].lyric = JSON.parse(processedContent) as string;
    recs[0]._id = recs[0].id ? recs[0].id : recs[0]._id; // sqlite3だと_がフィールドに使えないのでここでキャスト
    var contentHtml = recs[0].lyric.replaceAll("\n", "<br>");
    return {
      author_title,
      contentHtml,
      ...recs[0],
    };
  } else return null;
}
