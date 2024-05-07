"use server";
// @/components/edit/actions.ts
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { save, remove } from "@/app/api/db/route";

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
