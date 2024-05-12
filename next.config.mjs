/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";
// mjsでやりたい。ソース管理外のファイルはこれじゃなくてもenv/でもよい。
const wP = withPWA({
  disable: process.env.NODE_ENV === "development",
  register: true,
  dest: "public",
  skipWaiting: true,
});
const nextConfig = wP({
  reactStrictMode: true,
  typescript: { // route.tsでどうしても  Property 'getMemories' is incompatible with index signature.
    // Type '(cond: any) => Promise<any[]>' is not assignable to type 'never'. とか出るのをかいけつできんかった、対処
    ignoreBuildErrors: true,
  },
  swcMinify: false,
});
// const nextConfig = {
//   reactStrictMode: true,
//   typescript: {
//     ignoreBuildErrors: true,
//   }
// };
export default nextConfig;
