import Form from '@/app/ui/clientes/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'clientes', href: '/dashboard/clientes' },
          {
            label: 'Crear clientes',
            href: '/dashboard/clientes/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}