import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { fetchAffiliates } from '@/app/lib/data';
import AffiliatesTable from '@/app/ui/affiliates/table';

export default async function Page() {
  const affiliates = await fetchAffiliates();

  return (
    <div className='w-full'>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-2xl font-bold'>Afiliados</h1>
      </div>
      <div className='mt-4 flex items-center justify-between gap-2 md:mt-8'>
        <div className='flex gap-2'>
          <Link
            href='/dashboard/levels/1'
            className='flex h-10 items-center rounded-lg bg-green-100 px-4 text-sm font-medium text-green-700 transition-colors hover:bg-green-200'
          >
            Nivel 1 (Vendedores)
          </Link>
          <Link
            href='/dashboard/levels/2'
            className='flex h-10 items-center rounded-lg bg-blue-100 px-4 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200'
          >
            Nivel 2 (Managers)
          </Link>
          <Link
            href='/dashboard/levels/3'
            className='flex h-10 items-center rounded-lg bg-purple-100 px-4 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-200'
          >
            Nivel 3 (Directores)
          </Link>
        </div>
        <Link
          href='/dashboard/affiliates/create'
          className='flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500'
        >
          <span className='hidden md:block'>Crear Afiliado</span>
          <PlusIcon className='h-5 md:ml-4' />
        </Link>
      </div>
      <div className='mt-6'>
        <AffiliatesTable affiliates={affiliates} />
      </div>
    </div>
  );
}
