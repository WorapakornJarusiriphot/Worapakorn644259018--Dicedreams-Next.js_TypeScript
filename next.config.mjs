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
        path: false, // ตัวอย่างเพิ่ม path เป็น false หากไม่ใช้งาน
        crypto: false, // ปิดการใช้งาน crypto หากไม่จำเป็น
        // เพิ่มโมดูลอื่นๆที่ไม่ต้องการใช้งาน
      };
    }
    return config;
  },
};

export default nextConfig;
