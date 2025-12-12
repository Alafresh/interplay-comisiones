import { Suspense } from 'react';
import {
  CardsSkeleton,
  LatestSalesSkeleton,
  CommissionsChartSkeleton,
} from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
import LatestSales from '@/app/ui/dashboard/latest-sales';
import CommissionsChart from '@/app/ui/dashboard/commissions-chart';

export default async function Page() {
  return (
    <main>
      <h1 className='mb-4 text-xl md:text-2xl font-bold'>
        Dashboard de Comisiones
      </h1>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8'>
        <Suspense fallback={<CommissionsChartSkeleton />}>
          <CommissionsChart />
        </Suspense>
        <Suspense fallback={<LatestSalesSkeleton />}>
          <LatestSales />
        </Suspense>
      </div>
    </main>
  );
}
