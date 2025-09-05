import Navigation from '@/components/Navigation';
import CurrencyConverter from '@/components/calculators/CurrencyConverter';

const CurrencyConverterPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <CurrencyConverter />
      </main>
    </div>
  );
};

export default CurrencyConverterPage;