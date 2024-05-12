/** @format */

// @/app/api/db/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma, Memory } from "@prisma/client";
import { URL } from "url";
import { castPrimaryKey, DBCONF } from "@/lib/memories";
const prisma = new PrismaClient();
const { DB_TYPE = "sqlite3", DB_URL = "a", DB_HOST = "a", DB_NAME = "a" } = process.env;
export const comApiData = { host: DB_HOST, dbName: DB_NAME };
// 動的に型を変更することはtypescriptで無理
type AnyType = any;
// type DB_TYPE = "sqlite3" | "other";
// export type memoriesCol = DB_TYPE extends "sqlite3" ? Memory : AnyType;
export type memoriesCol = AnyType; // mongodb用
export async function GET(req: any, context: any) {
  // console.log(context, req);
  let res = {};
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query"); // => "hello"
  // console.log(query, searchParams);
  if (req && "memories" == searchParams.get("kind")) {
    res = await getMemories({ title: searchParams.get("title"), author: searchParams.get("author") });
    console.log(res, "ppp");
  }
  return NextResponse.json(res);
}
// export async function POST(req: { json: () => any; url: string; headers: { host: any } }, context: any) {
//   console.log(`rrrrr[[${context}]]`);
//   let post = await req.json();
//   // let kind = req.url.searchParams.get('kind');
//   const url = new URL(req.url, `http://${req.headers.host}`);

//   // Get the 'kind' parameter from the URL
//   let kind = url.searchParams.get("kind");
//   // console.log("req", post, req);
//   let result: any = "";
//   switch (kind) {
//     case "save":
//       result = await save(post);
//       break;
//     case "remove":
//       result = await remove(post);
//       break;
//   }
//   return NextResponse.json({ name: result });
// }


export async function getMemories(cond: any) {
  let recs: memoriesCol[] = [];
  console.log("sa-ba?");
  if (DBCONF.isSqlite3()) {
    recs = await prisma.memory.findMany({
      where: cond,
    });
    recs = recs.map((o) => ({
      ...o,
      update: DBCONF.isSqlite3() ? o.update.toISOString() : o.update,
    }));
  } else if (DBCONF.isMongdb()) {
    let findData = {
      ...comApiData,
      coll: "memories",
      method: "find",
      cond,
    };
    let recs2 = await reqApi({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(findData),
    });
    // console.log("recs2", recs2);
    recs = recs2.rec;
  }
  return recs;
}
export const reqApi = (params: any, query = "") => {
  return fetch(`${DB_URL}${query}`, params)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      console.log("err");
    });
};
"@ts-ignore"
export async function handler(req: any, res: any) {
  console.log(req?.query, 2);
  // secretを使用して何かを行う
  res.status(200).json(await getMemories(req?.cond));
}
