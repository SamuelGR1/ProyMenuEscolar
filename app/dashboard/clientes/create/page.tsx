import Form from '@/app/ui/clientes/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

 
export default async function Page() {
 
 //retun
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
      <Form />
    </main>
  );
}