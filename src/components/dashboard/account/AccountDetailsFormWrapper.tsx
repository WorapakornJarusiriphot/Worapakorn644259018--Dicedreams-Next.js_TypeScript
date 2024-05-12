import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// โหลด AccountDetailsForm ด้วย dynamic import และปิดการใช้งาน SSR
const AccountDetailsForm = dynamic(() => import('@/components/dashboard/account/account-details-form'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

export default function AccountDetailsFormWrapper() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่า router พร้อมใช้งานหรือไม่
    if (router.isReady) {
      setIsReady(true);
    }
  }, [router.isReady]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <AccountDetailsForm />;
}
