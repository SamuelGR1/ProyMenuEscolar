import Form from '@/app/ui/vistaProductos/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchProductoById, fetchCategorias,fetchSubcategorias } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    
    const [producto, categorias,subcategorias] = await Promise.all([
      fetchProductoById(id),
      fetchCategorias(),
      fetchSubcategorias(),
      ]);

      if (!producto) {
        notFound();
      }
      
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/vistaProductos' },
          {
            label: 'Editar producto',
            href: `/dashboard/vistaProductos/${id}/edit`,
            active: true,
          },
        ]}
      />
     <Form  producto={producto}  categorias={categorias} subcategorias={subcategorias}/>
    </main>
  );
}