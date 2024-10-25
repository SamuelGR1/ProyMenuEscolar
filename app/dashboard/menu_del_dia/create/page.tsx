import Form from '@/app/ui/menu_del_dia/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

 
export default async function Page() {
 
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'menu_del_dia', href: '/dashboard/menu_del_dia' },
          {
            label: 'menu_del_dia',
            href: '/dashboard/menu_del_dia/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}