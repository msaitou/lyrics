import Layout from "../../components/layout";
import { getAllPostIds, getPostData, memoriesCol } from "../../lib/memories";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths } from "next";
import styles from "../../components/layout.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
type FormData = {
  title: string;
  author: string;
  lyric: string;
  remarks: string;
  update: string;
};
function Form({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  // フォームの管理
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative mr-4 lg:w-full xl:w-1/2 w-2/4 md:w-full text-left">
        <label htmlFor="title" className="leading-7 text-sm text-gray-400">
          title
        </label>
        <input type="hidden" id="_id"></input>
        <input
          type="text"
          id="title"
          className="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-green-900 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          placeholder="Enter song name"
          {...register("title", { required: true })}
        ></input>
        {errors.title && <p className=" text-red-300 font-light">title is required</p>}
      </div>
      <div className="relative mr-4 lg:w-full xl:w-1/2 w-2/4 md:w-full text-left">
        <label htmlFor="author" className="leading-7 text-sm text-gray-400">
          author
        </label>
        <input
          type="text"
          id="author"
          className="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-green-900 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          placeholder="Enter author name"
          {...register("author", { required: true })}
        ></input>
        {errors.author && <p className=" text-red-300 font-light">author is required</p>}
      </div>
      <div className="relative mr-4 lg:w-full xl:w-1/2 w-2/4 md:w-full text-left">
        <label htmlFor="lyric" className="leading-7 text-sm text-gray-400">
          lyric
        </label>
        <textarea
          id="lyric"
          rows={10}
          className="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-green-900 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          {...register("lyric", { required: true })}
        ></textarea>
        {errors.lyric && <p className=" text-red-300 font-light">lyric is required</p>}
      </div>
      <div className="relative mr-4 lg:w-full xl:w-1/2 w-2/4 md:w-full text-left">
        <label htmlFor="remarks" className="leading-7 text-sm text-gray-400">
          remarks
        </label>
        <textarea
          id="remarks"
          rows={3}
          className="w-full bg-gray-800 rounded border bg-opacity-40 border-gray-700 focus:ring-2 focus:ring-green-900 focus:bg-transparent focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          {...register("remarks")}
        ></textarea>
        {errors.remarks && <p>remarks is required</p>}
      </div>
      <div className="flex mt-4 lg:w-2/3 w-full mx-auto">
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
export default function Edit({
  editData: editData,
}: {
  editData?: { title: string; contentHtml: string; remarks: string };
}) {
  console.log("postData", editData);
  // 入力値を受け取って保存する関数
  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("Saved successfully");
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
        <h1 className={utilStyles.headingXl}>
          {editData?.title ? `${editData?.title} editting` : "new Adding"}
          <button></button>
        </h1>
        <Form onSubmit={onSubmit}></Form>
      </article>
    </Layout>
  );
}
