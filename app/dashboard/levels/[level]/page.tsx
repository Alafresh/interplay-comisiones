import { fetchAffiliatesByLevel } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default async function Page({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level: levelParam } = await params;
  const level = Number(levelParam);

  if (level < 1 || level > 3) {
    notFound();
  }

  const affiliates = await fetchAffiliatesByLevel(level);

  const levelInfo = {
    1: { name: 'Nivel 1 - Vendedores', color: 'green', rate: '10%' },
    2: { name: 'Nivel 2 - Managers', color: 'blue', rate: '5%' },
    3: { name: 'Nivel 3 - Directores', color: 'purple', rate: '2.5%' },
  };

  const info = levelInfo[level as keyof typeof levelInfo];

  return (
    <div className='w-full'>
      <div className='flex items-center gap-4 mb-6'>
        <Link
          href='/dashboard/affiliates'
          className='flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100'
        >
          <ArrowLeftIcon className='h-5 w-5' />
        </Link>
        <div>
          <h1 className='text-2xl font-bold'>{info.name}</h1>
          <p className='text-sm text-gray-500'>Tasa de comisión: {info.rate}</p>
        </div>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {affiliates.map((affiliate) => (
          <div
            key={affiliate.id}
            className='rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow'
          >
            <div className='flex items-center gap-4 mb-4'>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  level === 1
                    ? 'bg-green-100'
                    : level === 2
                    ? 'bg-blue-100'
                    : 'bg-purple-100'
                }`}
              >
                <span
                  className={`text-lg font-bold ${
                    level === 1
                      ? 'text-green-700'
                      : level === 2
                      ? 'text-blue-700'
                      : 'text-purple-700'
                  }`}
                >
                  {affiliate.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className='font-semibold'>{affiliate.name}</h3>
                <p className='text-sm text-gray-500'>{affiliate.email}</p>
              </div>
            </div>

            <div className='space-y-2 border-t pt-4'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Referidor:</span>
                <span className='font-medium'>
                  {affiliate.referrer_name || (
                    <span className='text-gray-400 italic'>Sin referidor</span>
                  )}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Ventas totales:</span>
                <span className='font-medium'>
                  {affiliate.total_sales || 0}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Comisiones ganadas:</span>
                <span
                  className={`font-bold ${
                    level === 1
                      ? 'text-green-600'
                      : level === 2
                      ? 'text-blue-600'
                      : 'text-purple-600'
                  }`}
                >
                  ${Number(affiliate.total_commissions || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {affiliates.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500'>No hay afiliados en este nivel aún.</p>
          <Link
            href='/dashboard/affiliates/create'
            className='mt-4 inline-flex items-center text-blue-600 hover:text-blue-500'
          >
            Crear primer afiliado de este nivel →
          </Link>
        </div>
      )}
    </div>
  );
}
