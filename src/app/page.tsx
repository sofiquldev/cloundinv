import InvoiceList from '@/components/invoice/InvoiceList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <InvoiceList />
      </div>
    </div>
  );
}
