export default function AffiliatesTable({ affiliates }: { affiliates: any[] }) {
  const levelColors = {
    1: 'bg-green-100 text-green-700',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-purple-100 text-purple-700',
  };

  const levelNames = {
    1: 'Nivel 1',
    2: 'Nivel 2',
    3: 'Nivel 3',
  };

  return (
    <div className='flow-root'>
      <div className='inline-block min-w-full align-middle'>
        <div className='rounded-lg bg-gray-50 p-2 md:pt-0'>
          <div className='md:hidden'>
            {affiliates?.map((affiliate) => (
              <div
                key={affiliate.id}
                className='mb-2 w-full rounded-md bg-white p-4'
              >
                <div className='flex items-center justify-between border-b pb-4'>
                  <div>
                    <div className='mb-2 flex items-center'>
                      <p className='text-sm font-medium'>{affiliate.name}</p>
                    </div>
                    <p className='text-sm text-gray-500'>{affiliate.email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                      levelColors[affiliate.level as keyof typeof levelColors]
                    }`}
                  >
                    {levelNames[affiliate.level as keyof typeof levelNames]}
                  </span>
                </div>
                <div className='flex w-full items-center justify-between pt-4'>
                  <p className='text-sm text-gray-500'>
                    Referidor: {affiliate.referrer_name || 'Ninguno'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <table className='hidden min-w-full text-gray-900 md:table'>
            <thead className='rounded-lg text-left text-sm font-normal'>
              <tr>
                <th scope='col' className='px-4 py-5 font-medium sm:pl-6'>
                  Nombre
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Email
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Nivel
                </th>
                <th scope='col' className='px-3 py-5 font-medium'>
                  Referidor
                </th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {affiliates?.map((affiliate) => (
                <tr
                  key={affiliate.id}
                  className='w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
                >
                  <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                        <span className='text-sm font-semibold text-gray-700'>
                          {affiliate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className='font-medium'>{affiliate.name}</p>
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {affiliate.email}
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        levelColors[affiliate.level as keyof typeof levelColors]
                      }`}
                    >
                      {levelNames[affiliate.level as keyof typeof levelNames]}
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-3 py-3'>
                    {affiliate.referrer_name || (
                      <span className='text-gray-400 italic'>
                        Sin referidor
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
