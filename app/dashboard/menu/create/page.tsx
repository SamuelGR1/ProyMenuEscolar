import Form from '@/app/ui/menu/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Menu', href: '/dashboard/menu' },
          {
            label: 'Crear menu',
            href: '/dashboard/menu/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}