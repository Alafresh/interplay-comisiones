'use client';

import Link from 'next/link';
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createAffiliate, AffiliateState } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { fetchPotentialReferrers } from '@/app/lib/data';

export default function Form() {
  const initialState: AffiliateState = { message: null, errors: {} };
  const [state, formAction] = useFormState(createAffiliate, initialState);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [referrers, setReferrers] = useState<any[]>([]);

  const handleLevelChange = async (level: number) => {
    setSelectedLevel(level);
    if (level < 3) {
      const potentialReferrers = await fetchPotentialReferrers(level);
      setReferrers(potentialReferrers);
    } else {
      setReferrers([]);
    }
  };

  return (
    <form action={formAction}>
      <div className='rounded-md bg-gray-50 p-4 md:p-6'>
        {/* Nombre */}
        <div className='mb-4'>
          <label htmlFor='name' className='mb-2 block text-sm font-medium'>
            Nombre completo
          </label>
          <div className='relative'>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='Ingresa el nombre'
              className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
              aria-describedby='name-error'
            />
            <UserCircleIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>
          <div id='name-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Email */}
        <div className='mb-4'>
          <label htmlFor='email' className='mb-2 block text-sm font-medium'>
            Email
          </label>
          <div className='relative'>
            <input
              id='email'
              name='email'
              type='email'
              placeholder='ejemplo@correo.com'
              className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
              aria-describedby='email-error'
            />
            <EnvelopeIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>
          <div id='email-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Password */}
        <div className='mb-4'>
          <label htmlFor='password' className='mb-2 block text-sm font-medium'>
            Contraseña
          </label>
          <div className='relative'>
            <input
              id='password'
              name='password'
              type='password'
              placeholder='Mínimo 6 caracteres'
              className='peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500'
              aria-describedby='password-error'
            />
            <KeyIcon className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
          </div>
          <div id='password-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.password &&
              state.errors.password.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Nivel */}
        <div className='mb-4'>
          <label htmlFor='level' className='mb-2 block text-sm font-medium'>
            Nivel del afiliado
          </label>
          <select
            id='level'
            name='level'
            className='peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2'
            defaultValue='1'
            onChange={(e) => handleLevelChange(Number(e.target.value))}
            aria-describedby='level-error'
          >
            <option value='1'>Nivel 1 - Vendedor (10% comisión)</option>
            <option value='2'>Nivel 2 - Manager (5% comisión)</option>
            <option value='3'>Nivel 3 - Director (2.5% comisión)</option>
          </select>
          <div id='level-error' aria-live='polite' aria-atomic='true'>
            {state.errors?.level &&
              state.errors.level.map((error: string) => (
                <p className='mt-2 text-sm text-red-500' key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Referidor */}
        {selectedLevel < 3 && (
          <div className='mb-4'>
            <label
              htmlFor='referrer'
              className='mb-2 block text-sm font-medium'
            >
              Referidor (Nivel {selectedLevel + 1})
            </label>
            <select
              id='referrer'
              name='referrerId'
              className='peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2'
              defaultValue=''
            >
              <option value=''>Sin referidor</option>
              {referrers.map((referrer) => (
                <option key={referrer.id} value={referrer.id}>
                  {referrer.name} - {referrer.email}
                </option>
              ))}
            </select>
            <p className='mt-1 text-xs text-gray-500'>
              Selecciona un afiliado de nivel {selectedLevel + 1} como referidor
            </p>
          </div>
        )}

        {/* Info */}
        <div className='mb-4 rounded-md bg-blue-50 p-4'>
          <p className='text-sm text-blue-800 font-medium mb-2'>
            💡 Estructura de comisiones:
          </p>
          <ul className='text-sm text-blue-700 space-y-1'>
            <li>• Nivel 1 gana comisiones cuando vende directamente</li>
            <li>
              • Nivel 2 gana comisiones de las ventas de sus referidos de Nivel
              1
            </li>
            <li>• Nivel 3 gana comisiones de la red completa</li>
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
          href='/dashboard/affiliates'
          className='flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200'
        >
          Cancelar
        </Link>
        <Button type='submit'>Crear Afiliado</Button>
      </div>
    </form>
  );
}
