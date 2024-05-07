/** @format */

// @/app/api/db/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma, Memory } from "@prisma/client";
import { URL } from "url";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { castPrimaryKey, DBCONF } from "@/lib/memories";
const prisma = new PrismaClient();
export const { DB_TYPE, DB_URL, DB_HOST, DB_NAME } = process.env;
export const comApiData = { host: DB_HOST, dbName: DB_NAME };
// 動的に型を変更
type AnyType = any;
type DB_TYPE = "sqlite3" | "other";
export type memoriesCol = DB_TYPE extends "sqlite3" ? Memory : AnyType;

type Data = {
  name: string;
};
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
export async function POST(req: { json: () => any; url: string; headers: { host: any } }, context: any) {
  console.log(`rrrrr[[${context}]]`);
  let post = await req.json();
  // let kind = req.url.searchParams.get('kind');
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Get the 'kind' parameter from the URL
  let kind = url.searchParams.get("kind");
  // console.log("req", post, req);
  let result: any = "";
  switch (kind) {
    case "save":
      result = await save(post);
      break;
    case "remove":
      result = await remove(post);
      break;
  }
  return NextResponse.json({ name: result });
}

export async function save(post: any) {
  console.log("save:", post);
  let doc = { ...post, lyric: JSON.stringify(post.lyric), update: new Date() };
  let result;
  let cond: any = {};
  if (post._id) cond = castPrimaryKey(post);
  delete doc._id; // ObjectId型でないので、update時に変更されたとみなされるのでどのみち削除
  delete doc.author_title;
  if (DBCONF.isSqlite3()) {
    if (cond.id) {
      result = await prisma.memory.update({
        where: cond as Prisma.MemoryWhereUniqueInput,
        data: doc,
      });
    } else {
      result = await prisma.memory.create({
        data: doc,
      });
    }
  } else if (DBCONF.isMongdb()) {
    let saveData = {
      ...comApiData,
      coll: "memories",
      method: "update",
      opt: { doc },
      cond,
    };
    result = await reqApi({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saveData),
    });
  }
  return result;
}
export async function remove(post: any) {
  console.log("remove:", post);
  let result: any = "";
  if (post._id) {
    let cond = castPrimaryKey(post);
    if (DBCONF.isSqlite3()) {
      result = await prisma.memory.delete({
        where: cond as Prisma.MemoryWhereUniqueInput,
      });
    } else if (DBCONF.isMongdb()) {
      let saveData = {
        ...comApiData,
        coll: "memories",
        method: "delete",
        cond,
      };
      result = await reqApi({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveData),
      });
    }
  }
  return result;
}

export async function getMemories(cond: any) {
  let recs: memoriesCol[] = [];
  console.log("sa-ba?");
  if (DBCONF.isSqlite3()) {
    recs = await prisma.memory.findMany({
      where: cond,
    });
    recs = recs.map(o => ({
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
    .then(res => res.json())
    .catch(err => {
      console.log(err);
      console.log("err");
    });
};
export default function handler(req: any, res: any) {
  console.log(req.query, 2);
  // secretを使用して何かを行う
  res.status(200).json(getMemories(req.cond));
}
