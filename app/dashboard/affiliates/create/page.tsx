import Form from '@/app/ui/affiliates/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Afiliados', href: '/dashboard/affiliates' },
          {
            label: 'Crear Afiliado',
            href: '/dashboard/affiliates/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
