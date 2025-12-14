'use client';

import Link from 'next/link';
import {
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createSale, SaleState } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function Form({ sellers }: { sellers: any[] }) {
  const initialState: SaleState = { message: null, errors: {} };
  const [state, formAction] = useFormState(createSale, initialState);

  return (
    <form action={formAction}>
      {/* resto del código igual */}
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        <div className='mb-4'>
          <label htmlFor='seller' className='mb-2 block text-sm font-medium'>
            Seleccionar Vendedor (Nivel 1)
          </label>
          <div className='relative'>
            <select
              id='seller'
              name='sellerId'
              className='peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
              defaultValue=''
              aria-describedby='seller-error'
            >
              <option value='' disabled>
                Selecciona un vendedor
              </option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.name} - {seller.email}
                </option>
              ))}
            </select>
            <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>
          <div id='seller-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.sellerId &&
              state.errors.sellerId.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className='mb-4'>
          <label htmlFor='amount' className='mb-2 block text-sm font-medium'>
            Monto de la venta
          </label>
          <div className='relative mt-2 rounded-md'>
            <div className='relative'>
              <input
                id='amount'
                name='amount'
                type='number'
                step='0.01'
                placeholder='Ingresa el monto en USD'
                className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
                aria-describedby='amount-error'
              />
              <CurrencyDollarIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
            </div>
          </div>
          <div id='amount-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className='mb-4 rounded-md bg-blue-50 p-4'>
          <p className='text-sm text-blue-800 font-medium mb-2'>
            💡 Las comisiones se calcularán automáticamente:
          </p>
          <ul className='text-sm text-blue-700 space-y-1'>
            <li>• Nivel 1 (Vendedor): 10% del monto</li>
            <li>• Nivel 2 (Referidor): 5% del monto</li>
            <li>• Nivel 3 (Referidor del referidor): 2.5% del monto</li>
          </ul>
        </div>

        {state.message && (
          <div className='mb-4 rounded-md bg-red-50 p-4'>
            <p className='text-sm text-red-800'>{state.message}</p>
          </div>
        )}
      </div>

      <div className='mt-6 flex justify-end gap-4'>
        <Link
          href='/dashboard/sales'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <Button type='submit'>Crear Venta</Button>
      </div>
    </form>
  );
}
