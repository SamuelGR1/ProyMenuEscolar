import Form from '@/app/ui/facturas/create-form';
import Breadcrumbs from '@/app/ui/facturas/breadcrumbs';
import { fetchCustomers } from '@/app/lib/datafacturas';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Facturas', href: '/dashboard/facturas' },
          {
            label: 'Crear Facturas',
            href: '/dashboard/facturas/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} menus={[]} />
    </main>
  );
}