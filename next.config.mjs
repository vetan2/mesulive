/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["app", ".storybook"],
  },
  transpilePackages: ["jotai-devtools"],
};

export default nextConfig;
