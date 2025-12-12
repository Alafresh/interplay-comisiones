import { fetchCommissionsByLevel } from '@/app/lib/data';

export default async function CommissionsChart() {
  const data = await fetchCommissionsByLevel();

  if (!data || data.length === 0) {
    return (
      <div className='w-full md:col-span-4'>
        <h2 className='mb-4 text-xl md:text-2xl font-bold'>
          Comisiones por Nivel
        </h2>
        <div className='rounded-xl bg-gray-50 p-4'>
          <p className='mt-4 text-gray-400 text-center'>
            No hay datos disponibles.
          </p>
        </div>
      </div>
    );
  }

  const levelColors = {
    1: 'bg-green-500',
    2: 'bg-blue-500',
    3: 'bg-purple-500',
  };

  const levelNames = {
    1: 'Nivel 1 (Vendedores)',
    2: 'Nivel 2 (Managers)',
    3: 'Nivel 3 (Directores)',
  };

  const maxTotal = Math.max(...data.map((level) => Number(level.total)));

  return (
    <div className='w-full md:col-span-4'>
      <h2 className='mb-4 text-xl md:text-2xl font-bold'>
        Comisiones por Nivel
      </h2>
      <div className='rounded-xl bg-gray-50 p-4'>
        <div className='mt-0 grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {data.map((level) => {
            const total = Number(level.total);
            const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
            const levelNum = Number(level.level);

            return (
              <div key={level.level} className='flex flex-col'>
                <div className='mb-2'>
                  <p className='text-sm font-medium text-gray-600'>
                    {levelNames[levelNum as keyof typeof levelNames]}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {level.count} comisión{level.count !== '1' ? 'es' : ''}
                  </p>
                </div>

                {/* Barra de progreso */}
                <div className='relative h-32 w-full rounded-md bg-gray-200'>
                  <div
                    className={`absolute bottom-0 w-full rounded-md ${
                      levelColors[levelNum as keyof typeof levelColors]
                    } transition-all`}
                    style={{ height: `${percentage}%` }}
                  />
                </div>

                <div className='mt-2 text-center'>
                  <p className='text-2xl font-bold text-gray-900'>
                    ${total.toFixed(2)}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {levelNum === 1 && '10% por venta'}
                    {levelNum === 2 && '5% por venta'}
                    {levelNum === 3 && '2.5% por venta'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
