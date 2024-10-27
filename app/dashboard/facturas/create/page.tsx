import Form from '@/app/ui/facturas/create-form';
import Breadcrumbs from '@/app/ui/facturas/breadcrumbs';
import { fetchCustomers} from '@/app/lib/data';

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Facturas', href: '/dashboard/facturas' },
          {
            label: 'Create Factura',
            href: '/dashboard/facturas/create',
            active: true,
          },
        ]}
      />
      <Form factura={customers} />
    </main>
  );
}
