import Form from '@/app/ui/menu/edit-form';
import Breadcrumbs from '@/app/ui/menu/breadcrumbs';
import { fetchMenuById, fetchCustomers } from '@/app/lib/datamenu';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
      ]);

      if (!invoice) {
        notFound();
      }
      
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Menu', href: '/dashboard/menu' },
          {
            label: 'Edit Menu',
            href: `/dashboard/menu/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form menu={invoice} customers={customers} />
    </main>
  );
}