import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import Image from 'next/image';
export default function LoginPage() {
  return (
    <main className='flex items-center justify-center md:h-screen'>
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>
        <div className='flex h-20 w-full items-end rounded-lg bg-white p-3 md:h-36'>
          <div className='w-32 text-white md:w-36'>
            <Image
              width={270}
              height={60}
              src='https://www.interplay.tech/images/logo_interplay_recortado.png'
              alt='Logo interplay'
            />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
