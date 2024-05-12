"use server";
// @/components/edit/actions.ts
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
// import { save, remove } from "@/app/api/db/route";
import { comApiData, reqApi } from "@/app/api/db/route";
import { castPrimaryKey, DBCONF } from "@/lib/memories";
import { PrismaClient, Prisma, Memory } from "@prisma/client";
const prisma = new PrismaClient();

export type FormData = {
  _id: string;
  title: string;
  author: string;
  lyric: string;
  remarks: string;
  update: string;
};

// 登録
export async function onSave(data: FormData) {
  const path = headers().get("x-pathname") || "";
  let res: any = {};
  try {
    console.log("data", data);
    res = await save(data);
    // console.log("res",res);
  } catch (error) {
    console.error(error);
  }
  if (data.update != res.update) {
    // router.push("/");  // 一覧へ戻る だと
    // await router.replace("/?ref=true");  // URLが変わった1回だけ再レンダリングされるが、基本キャッシュがクリアされない
    // alert("Saved successfully");
    revalidatePath(path.replace("/memories/edit", "/memories"));
    revalidatePath("/");
    redirect("/");
  } else {
    // alert("Something went wrong");
    console.error("Something went wrong");
  }
}
// 削除
export async function onRemove(data: FormData) {
  const path = headers().get("x-pathname") || "";
  let res: any = {};
  try {
    // console.log("data", data);
    res = await remove(data);
    // console.log("res", res);
  } catch (error) {
    console.error(error);
  }
  // if (data.update != res.update) {
  if (res?.rec?.deletedCount > 0) {
    // router.push("/");  // 一覧へ戻る だと
    // await router.replace("/?ref=true");  // だと、キャッシュがクリアされない
    // alert("Saved successfully");
    revalidatePath(path.replace("/memories/edit", "/memories"));
    revalidatePath("/");
    redirect("/");
  } else {
    // alert("Something went wrong");
    console.error("Something went wrong");
  }
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
