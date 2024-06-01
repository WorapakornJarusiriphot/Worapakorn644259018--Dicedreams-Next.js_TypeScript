npm install --legacy-peer-deps

set NODE_OPTIONS=--openssl-legacy-provider

การใช้งาน npm audit และ npm outdated
เรียกใช้ npm audit เพื่อตรวจสอบปัญหาความปลอดภัยในโปรเจ็กต์ของคุณ
ใช้ npm outdated เพื่อดูแพ็กเกจใดที่ต้องการอัพเกรด

npm install @mui/material@latest @mui/x-date-pickers@latest


การแก้ไขปัญหาความปลอดภัย (Vulnerabilities):

คำสั่ง npm audit fix สามารถใช้เพื่ออัตโนมัติแก้ไขปัญหาความปลอดภัยที่ไม่ต้องการการเปลี่ยนแปลงที่เข้มงวดในโปรเจกต์ของคุณ.
คำสั่ง npm audit fix --force จะแก้ไขปัญหาทั้งหมดรวมถึงการเปลี่ยนแปลงที่อาจทำให้เกิดการแตกหัก (breaking changes). ควรใช้คำสั่งนี้เมื่อคุณพร้อมที่จะจัดการกับผลกระทบที่อาจตามมา.
ตรวจสอบรายละเอียดปัญหาความปลอดภัย:

คำสั่ง npm audit จะแสดงรายละเอียดของปัญหาความปลอดภัยในแพ็คเกจที่ใช้งานอยู่ในโปรเจกต์ของคุณ เพื่อให้คุณสามารถรับทราบถึงระดับความรุนแรงและการกระทบต่อโปรเจกต์.
ค้นหาเงินทุนสนับสนุนแพ็คเกจ:

คำสั่ง npm fund จะแสดงรายชื่อแพ็คเกจที่ต้องการการสนับสนุนทางการเงิน เพื่อช่วยให้นักพัฒนาสามารถดำเนินการพัฒนาและปรับปรุงไลบรารีได้ต่อไป.






คุณสามารถลบ Git branch ที่อยู่บน GitHub โดยทำตามขั้นตอนดังนี้:

1. **เช็คชื่อ branch ที่ต้องการลบ**:
   - คุณสามารถตรวจสอบชื่อ branch ที่ต้องการลบโดยใช้คำสั่ง:
     ```bash
     git branch -r
     ```

2. **ลบ branch บน GitHub**:
   - ใช้คำสั่งต่อไปนี้ในการลบ branch ที่อยู่บน remote repository (GitHub):
     ```bash
     git push origin --delete feature/feature/display-people-section
     ```

3. **ลบ branch ที่อยู่บนเครื่องของคุณ** (ถ้าจำเป็น):
   - ถ้าคุณต้องการลบ branch ที่อยู่ใน local repository ของคุณด้วย ใช้คำสั่ง:
     ```bash
     git branch -d feature/feature/display-people-section
     ```
   - ถ้า branch นั้นยังไม่ได้ merge เข้าสู่ branch หลักและคุณยังคงต้องการลบ ใช้คำสั่ง:
     ```bash
     git branch -D feature/feature/display-people-section
     ```

เพียงเท่านี้ branch `feature/feature/display-people-section` จะถูกลบทั้งใน GitHub และ local repository ของคุณ (ถ้าคุณเลือกที่จะลบใน local ด้วย)


จากข้อความที่แสดงขึ้นมา หมายความว่าคุณได้ลบ branch `feature/feature/display-people-section` บน remote repository (GitHub) สำเร็จแล้ว ข้อความที่บอกว่า `[deleted]` ยืนยันว่าการลบนั้นสำเร็จ

```plaintext
 - [deleted]         feature/feature/display-people-section
```

ถ้าคุณต้องการลบ branch นี้ใน local repository ของคุณด้วย คุณสามารถใช้คำสั่งต่อไปนี้:

```bash
git branch -d feature/feature/display-people-section
```

หรือถ้า branch นั้นยังไม่ได้ merge เข้าสู่ branch หลักและคุณยังคงต้องการลบ ใช้คำสั่ง:

```bash
git branch -D feature/feature/display-people-section
```

เพียงเท่านี้ branch `feature/feature/display-people-section` จะถูกลบใน local repository ของคุณด้วย







ติดตั้งแพ็คเกจที่เข้ากันได้กับ React เวอร์ชัน 18:
หาก react-chartist มีเวอร์ชันที่อัปเดตและรองรับ React 18 คุณสามารถติดตั้งเวอร์ชันนั้นแทน:

bash
Copy code
npm install react-chartist@compatible-version --save
คุณจะต้องตรวจสอบในเอกสารหรือบน npm เพื่อหาเวอร์ชันที่เข้ากันได้.






หากต้องการค้นหาเวอร์ชั่นของ react-chartist ที่อาจรองรับ React 18, คุณสามารถใช้คำสั่งนี้:

npm info react-chartist versions



เปลี่ยนไปใช้แพ็คเกจอื่น
หากมีแพ็คเกจอื่นที่มีความสามารถเหมือนกับ react-chartist แต่รองรับ React 18, คุณอาจต้องการพิจารณาเปลี่ยนไปใช้แพ็คเกจนั้นแทน เช่น react-vis หรือ recharts ที่เป็นที่นิยมและมักจะได้รับการอัพเดตอย่างต่อเนื่อง




This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
