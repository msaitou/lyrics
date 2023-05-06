import Layout from "../../components/layout";
import { getAllPostIds, getPostData, memoriesCol } from "../../lib/memories";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import styles from "../../components/layout.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
type FormData = {
  _id: string;
  title: string;
  author: string;
  lyric: string;
  remarks: string;
  update: string;
};
export const getServerSideProps: GetServerSideProps = async (params) => {
  // クエリパラメータの取得
  var editData: any = {};
  if (params?.query && params?.query?.id) {
    // console.log("keyword =", params.query);
    editData = await getPostData(params.query.id as string);
    delete editData.contentHtml;
  }
  return {
    props: {
      editData,
    },
  };
};
function Form({ onSubmit, editData }: { onSubmit: (data: FormData) => void; editData?: memoriesCol }) {
  // フォームの管理
  const [data, setData] = useState<memoriesCol>({ _id: "", title: "", author: "", lyric: "", remarks: "", update: "" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      _id: data?._id,
      title: data?.title,
      author: data?.author,
      lyric: data?.lyric,
      remarks: data?.remarks,
      update: data?.update,
    },
    // shouldUnregister: true,
  });
  useEffect(() => {
    if (editData) reset(editData), setData(editData);
  }, [editData]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          onChange={(e) => setData({ ...data, title: e.target.value })}
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
          onChange={(e) => setData({ ...data, author: e.target.value })}
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
          onChange={(e) => setData({ ...data, lyric: e.target.value })}
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
          onChange={(e) => setData({ ...data, remarks: e.target.value })}
        ></textarea>
        {errors.remarks && <p>remarks is required</p>}
      </div>
      <div className="flex mt-4 w-full mx-auto">
        <div>
          <Link href="/">← Back to home</Link>
        </div>
        <button
          className="flex ml-auto text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  );
}
export default function Edit({ editData }: { editData?: memoriesCol }) {
  const router = useRouter();
  console.log("editid:::", router.query);

  console.log("postData", editData);
  // 入力値を受け取って保存する関数
  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/db?kind=save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/");  // 一覧へ戻る
        // alert("Saved successfully");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Layout edit>
      <Head>
        <title>{editData?.title ? `${editData?.title} editting` : "new Adding"}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{editData?.title ? `editting (${editData?.title})` : "adding"}</h1>
        <p className="mx-auto leading-relaxed">
          <Link className="text-green-400" href="edit">
            Add→
          </Link>
        </p>
        <span className="text-green-500"></span>
        <Form onSubmit={onSubmit} editData={editData}></Form>
      </article>
    </Layout>
  );
}
