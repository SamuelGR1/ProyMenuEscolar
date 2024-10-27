import Pagination from '@/app/ui/facturas/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/facturas/table';
import { CreateFactura } from '@/app/ui/facturas/buttons';
import { lusitana } from '@/app/ui/fonts'; 
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data'; // Asegúrate de que esta función esté adecuada para tus tablas
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facturas',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  // Asegúrate de que fetchInvoicesPages esté implementada para calcular el total de páginas en base a tu tabla
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateFactura />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {<Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
}
