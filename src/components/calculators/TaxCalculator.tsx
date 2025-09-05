import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, Calculator, Receipt } from 'lucide-react';

const TaxCalculator = () => {
  const [price, setPrice] = useState<string>('');
  const [taxRate, setTaxRate] = useState<string>('');
  const [calculationType, setCalculationType] = useState<'add' | 'included'>('add');
  const [results, setResults] = useState<{
    originalPrice: number;
    taxAmount: number;
    totalPrice: number;
  } | null>(null);

  // Common tax rates by location
  const commonTaxRates = [
    { value: '0', label: '0% - No Tax' },
    { value: '5', label: '5% - Low Tax' },
    { value: '6', label: '6% - Standard' },
    { value: '7', label: '7% - Standard' },
    { value: '8', label: '8% - Standard' },
    { value: '8.25', label: '8.25% - California' },
    { value: '10', label: '10% - Standard VAT' },
    { value: '13', label: '13% - Ontario HST' },
    { value: '15', label: '15% - Maritime HST' },
    { value: '20', label: '20% - UK VAT' },
    { value: '21', label: '21% - EU VAT' },
    { value: '25', label: '25% - High VAT' },
  ];

  const calculateTax = () => {
    const priceValue = parseFloat(price);
    const taxRateValue = parseFloat(taxRate);

    if (isNaN(priceValue) || isNaN(taxRateValue) || priceValue < 0 || taxRateValue < 0) {
      setResults(null);
      return;
    }

    let originalPrice: number;
    let taxAmount: number;
    let totalPrice: number;

    if (calculationType === 'add') {
      // Tax is added to the price
      originalPrice = priceValue;
      taxAmount = (priceValue * taxRateValue) / 100;
      totalPrice = priceValue + taxAmount;
    } else {
      // Tax is included in the price
      totalPrice = priceValue;
      originalPrice = priceValue / (1 + taxRateValue / 100);
      taxAmount = totalPrice - originalPrice;
    }

    setResults({
      originalPrice,
      taxAmount,
      totalPrice,
    });
  };

  const clearAll = () => {
    setPrice('');
    setTaxRate('');
    setResults(null);
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    if (price && taxRate) {
      const timer = setTimeout(() => {
        calculateTax();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults(null);
    }
  }, [price, taxRate, calculationType]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Tax Calculator</h1>
        <p className="text-muted-foreground">Calculate tax amounts and total prices with ease</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Tax Calculation
            </CardTitle>
            <CardDescription>Enter the price and tax rate to calculate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Calculation Type</Label>
              <Select 
                value={calculationType} 
                onValueChange={(value: 'add' | 'included') => setCalculationType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add tax to price</SelectItem>
                  <SelectItem value="included">Tax included in price</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {calculationType === 'add' 
                  ? 'Calculate total price with tax added'
                  : 'Calculate original price when tax is already included'
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                {calculationType === 'add' ? 'Original Price' : 'Total Price (with tax)'}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="pl-8 text-lg text-center"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate</Label>
              <div className="relative">
                <Input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="0.00"
                  className="pr-8 text-lg text-center"
                  step="0.01"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Common Tax Rates</Label>
              <Select value={taxRate} onValueChange={setTaxRate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a common rate" />
                </SelectTrigger>
                <SelectContent>
                  {commonTaxRates.map((rate) => (
                    <SelectItem key={rate.value} value={rate.value}>
                      {rate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateTax} className="flex-1">
                Calculate
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-secondary" />
              Calculation Results
            </CardTitle>
            <CardDescription>Breakdown of your tax calculation</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Original Price:</span>
                    <span className="text-lg font-semibold">${results.originalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-accent-light rounded-lg">
                    <span className="font-medium">Tax Amount ({taxRate}%):</span>
                    <span className="text-lg font-semibold text-accent">${results.taxAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-primary-light rounded-lg">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-xl font-bold text-primary">${results.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Tax Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tax Rate:</span>
                      <span>{taxRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax as decimal:</span>
                      <span>{(parseFloat(taxRate) / 100).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax on $1:</span>
                      <span>${(parseFloat(taxRate) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter a price and tax rate to see the calculation results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaxCalculator;