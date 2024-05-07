/** @format */
"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { onSave, FormData } from "@/components/edit/actions";
import React, { useEffect, useState } from "react";
// import { memoriesCol } from "@/lib/memories";
import { memoriesCol } from "@/app/api/db/route";

export default function Form({ editData }: { editData?: memoriesCol }) {
  // フォームの管理
  const [data, setData] = useState<memoriesCol>({
    _id: "",
    title: "",
    author: "",
    lyric: "",
    remarks: "",
    update: "",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {...data}
    // {
    //   _id: data?._id,
    //   title: data?.title,
    //   author: data?.author,
    //   lyric: data?.lyric,
    //   remarks: data?.remarks,
    //   update: data?.update,
    // },
    // shouldUnregister: true,
  });
  useEffect(() => {
    if (editData) reset(editData), setData(editData);
  }, [editData]);
  function handleAction(globalFormData: globalThis.FormData) {
    // `formData` を適切に変換または操作します
    // 非同期操作を行います
    onSave({...data}).then(() => {
      console.log('Operation completed');
    });
  }

  if (data)
  return (
    // <form action={handleSubmit(onSave)}>
    <form action={handleAction}>
      <div className="relative mr-4 w-full text-left">
        <label htmlFor="title" className="leading-7 text-sm text-gray-400">
          title
        </label>
        <input type="hidden" value={data?._id} {...register("_id")}></input>
        <input
          type="text"
          className="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-green-900 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          placeholder="Enter song name"
          {...register("title", { required: true })}
          onChange={e => setData({ ...data, title: e.target.value })}
        ></input>
        {errors.title && <p className=" text-red-300 font-light">title is required</p>}
      </div>
      <div className="relative mr-4 w-full text-left">
        <label htmlFor="author" className="leading-7 text-sm text-gray-400">
          author
        </label>
        <input
          type="text"
          id="author"
          className="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-green-900 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          placeholder="Enter author name"
          {...register("author", { required: true })}
          onChange={e => setData({ ...data, author: e.target.value })}
        ></input>
        {errors.author && <p className=" text-red-300 font-light">author is required</p>}
      </div>
      <div className="relative mr-4 w-full text-left">
        <label htmlFor="lyric" className="leading-7 text-sm text-gray-400">
          lyric
        </label>
        <textarea
          id="lyric"
          rows={10}
          className="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-green-900 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          {...register("lyric", { required: true })}
          onChange={e => setData({ ...data, lyric: e.target.value })}
        ></textarea>
        {errors.lyric && <p className=" text-red-300 font-light">lyric is required</p>}
      </div>
      <div className="relative mr-4 w-full text-left">
        <label htmlFor="remarks" className="leading-7 text-sm text-gray-400">
          remarks
        </label>
        <textarea
          id="remarks"
          rows={3}
          className="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-green-900 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          {...register("remarks")}
          onChange={e => setData({ ...data, remarks: e.target.value })}
        ></textarea>
        {errors.remarks && <p>remarks is required</p>}
      </div>
      <div className="flex mt-4 w-full mx-auto">
        <button
          className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded footer z-10"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  );
  else return (<>Loading・・・</>);
}
