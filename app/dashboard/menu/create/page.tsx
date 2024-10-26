import Form from '@/app/ui/clientes/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

 
export default async function Page() {
 
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Menu', href: '/dashboard/menu' },
          {
            label: 'Crear Menu',
            href: '/dashboard/menu/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}