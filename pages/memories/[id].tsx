import Layout from "../../components/layout";
import { getAllPostIds, getPostData, memoriesCol } from "../../lib/memories";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths } from "next";

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('id:::',params?.id);
  const postData = await getPostData(params?.id as string);
  return {
    props: {
      postData,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};
export default function Post({ postData }: { postData: { title: string; contentHtml: string; remarks: string } }) {
  console.log("postData", postData);
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}<button></button></h1>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
      <div className="p-4 bg-gray-900">{postData.remarks}</div>
    </Layout>
  );
}
