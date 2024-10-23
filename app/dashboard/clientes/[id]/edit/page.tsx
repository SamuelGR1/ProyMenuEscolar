import Form from '@/app/ui/clientes/edit-form';
import Breadcrumbs from '@/app/ui/clientes/breadcrumbs';
import { fetchClienteById} from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    
    const [cliente] = await Promise.all([
        fetchClienteById(id),
        
      ]);


      

      if (!cliente) {
        notFound();
        
      }
      
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/clientes' },
          {
            label: 'Edit Clientes',
            href: `/dashboard/clientes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form cliente={cliente} />
    </main>
  );
}