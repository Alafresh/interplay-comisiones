import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { fetchLatestSales } from '@/app/lib/data';

export default async function LatestSales() {
  const latestSales = await fetchLatestSales();

  return (
    <div className='flex w-full flex-col md:col-span-4'>
      <h2 className='mb-4 text-xl md:text-2xl font-bold'>Últimas Ventas</h2>
      <div className='flex grow flex-col justify-between rounded-xl bg-gray-50 p-4'>
        <div className='bg-white px-6'>
          {latestSales.map((sale, i) => {
            return (
              <div
                key={sale.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  }
                )}
              >
                <div className='flex items-center'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                    <span className='text-sm font-semibold text-green-700'>
                      {sale.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className='ml-4 min-w-0'>
                    <p className='truncate text-sm font-semibold md:text-base'>
                      {sale.name}
                    </p>
                    <p className='hidden text-sm text-gray-500 sm:block'>
                      {sale.email}
                    </p>
                  </div>
                </div>
                <p className='truncate text-sm font-medium md:text-base text-green-600'>
                  ${Number(sale.amount).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
        <div className='flex items-center pb-2 pt-6'>
          <ArrowPathIcon className='h-5 w-5 text-gray-500' />
          <h3 className='ml-2 text-sm text-gray-500'>
            Actualizado recientemente
          </h3>
        </div>
      </div>
    </div>
  );
}
