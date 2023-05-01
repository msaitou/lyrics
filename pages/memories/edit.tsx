


import Layout from "../../components/layout";
import { getAllPostIds, getPostData, memoriesCol } from "../../lib/memories";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths } from "next";
export default function Edit({ postData }: { postData?: { title: string; contentHtml: string; remarks: string } }) {
  console.log("postData", postData);
  return (
    <Layout>
      <Head>
        <title>{postData?.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData?.title}<button></button></h1>
        
        <div>{postData?.remarks}</div>
      </article>
    </Layout>
  );
}