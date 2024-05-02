// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "promotions.co.th",
      "scontent.fkdt3-1.fna.fbcdn.net",
      "live.staticflickr.com",
      "whatsericplaying.files.wordpress.com",
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        // ปิดการใช้งานโมดูลอื่นๆที่เกี่ยวข้อง (หากมี)
      };
    }
    return config;
  },
};

export default nextConfig;
