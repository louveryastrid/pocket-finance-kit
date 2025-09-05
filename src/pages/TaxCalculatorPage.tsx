import Navigation from '@/components/Navigation';
import TaxCalculator from '@/components/calculators/TaxCalculator';

const TaxCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <TaxCalculator />
      </main>
    </div>
  );
};

export default TaxCalculatorPage;