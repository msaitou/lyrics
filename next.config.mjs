/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";
// mjsでやりたい。ソース管理外のファイルはこれじゃなくてもenv/でもよい。
const wP = withPWA({
  register: true,
  dest: "public",
  skipWaiting: true,
});
const nextConfig = wP({ reactStrinctMode: true, swcMinify: false });
export default nextConfig;
