import Form from '@/app/ui/sales/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchSellers } from '@/app/lib/data';

export default async function Page() {
  const sellers = await fetchSellers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Ventas', href: '/dashboard/sales' },
          {
            label: 'Crear Venta',
            href: '/dashboard/sales/create',
            active: true,
          },
        ]}
      />
      <Form sellers={sellers} />
    </main>
  );
}
