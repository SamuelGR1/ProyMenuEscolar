import Form from '@/app/ui/facturas/edit-form';
import Breadcrumbs from '@/app/ui/facturas/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
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
          { label: 'Facturas', href: '/dashboard/factura' },
          {
            label: 'Edit Factura',
            href: `/dashboard/facturas/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form factura={invoice} customers={customers} />
    </main>
  );
}