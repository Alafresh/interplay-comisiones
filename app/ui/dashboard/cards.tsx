import {
  BanknotesIcon,
  UserGroupIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  sales: ShoppingCartIcon,
  affiliates: UserGroupIcon,
  commissions: BanknotesIcon,
};

export default async function CardWrapper() {
  const { numberOfSales, numberOfAffiliates, totalCommissionsAmount } =
    await fetchCardData();

  return (
    <>
      <Card title='Total Ventas' value={numberOfSales} type='sales' />
      <Card
        title='Total Afiliados'
        value={numberOfAffiliates}
        type='affiliates'
      />
      <Card
        title='Total Comisiones'
        value={totalCommissionsAmount}
        type='commissions'
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'sales' | 'affiliates' | 'commissions';
}) {
  const Icon = iconMap[type];

  return (
    <div className='rounded-xl bg-gray-50 p-2 shadow-sm'>
      <div className='flex p-4'>
        {Icon ? <Icon className='h-5 w-5 text-gray-700' /> : null}
        <h3 className='ml-2 text-sm font-medium'>{title}</h3>
      </div>
      <p className='truncate rounded-xl bg-white px-4 py-8 text-center text-2xl font-semibold'>
        {type === 'commissions' ? `$${Number(value).toFixed(2)}` : value}
      </p>
    </div>
  );
}
