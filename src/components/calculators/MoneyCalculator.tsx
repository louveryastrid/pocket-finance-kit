import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign } from 'lucide-react';

const MoneyCalculator = () => {
  const [denominations, setDenominations] = useState({
    hundreds: 0,
    fifties: 0,
    twenties: 0,
    tens: 0,
    fives: 0,
    ones: 0,
    quarters: 0,
    dimes: 0,
    nickels: 0,
    pennies: 0,
  });

  const denominationValues = {
    hundreds: 100,
    fifties: 50,
    twenties: 20,
    tens: 10,
    fives: 5,
    ones: 1,
    quarters: 0.25,
    dimes: 0.10,
    nickels: 0.05,
    pennies: 0.01,
  };

  const denominationLabels = {
    hundreds: '$100 Bills',
    fifties: '$50 Bills',
    twenties: '$20 Bills',
    tens: '$10 Bills',
    fives: '$5 Bills',
    ones: '$1 Bills',
    quarters: 'Quarters ($0.25)',
    dimes: 'Dimes ($0.10)',
    nickels: 'Nickels ($0.05)',
    pennies: 'Pennies ($0.01)',
  };

  const calculateTotal = () => {
    return Object.entries(denominations).reduce(
      (total, [key, count]) => total + count * denominationValues[key as keyof typeof denominationValues],
      0
    );
  };

  const handleInputChange = (denomination: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setDenominations(prev => ({
      ...prev,
      [denomination]: numValue,
    }));
  };

  const clearAll = () => {
    setDenominations({
      hundreds: 0,
      fifties: 0,
      twenties: 0,
      tens: 0,
      fives: 0,
      ones: 0,
      quarters: 0,
      dimes: 0,
      nickels: 0,
      pennies: 0,
    });
  };

  const total = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Money Calculator</h1>
        <p className="text-muted-foreground">Count your cash denominations and get the total value</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Bills Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Bills
            </CardTitle>
            <CardDescription>Enter the quantity of each bill</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(denominationLabels)
              .filter(([key]) => !['quarters', 'dimes', 'nickels', 'pennies'].includes(key))
              .map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    type="number"
                    value={denominations[key as keyof typeof denominations]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder="0"
                    min="0"
                    className="text-center"
                  />
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Coins Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-secondary" />
              Coins
            </CardTitle>
            <CardDescription>Enter the quantity of each coin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(denominationLabels)
              .filter(([key]) => ['quarters', 'dimes', 'nickels', 'pennies'].includes(key))
              .map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    type="number"
                    value={denominations[key as keyof typeof denominations]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder="0"
                    min="0"
                    className="text-center"
                  />
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Total Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-center">Total Value</CardTitle>
            <CardDescription className="text-center">Your calculated total</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                ${total.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                Total cash value
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Breakdown:</h4>
              <div className="text-sm space-y-1">
                {Object.entries(denominations)
                  .filter(([, count]) => count > 0)
                  .map(([key, count]) => {
                    const value = count * denominationValues[key as keyof typeof denominationValues];
                    return (
                      <div key={key} className="flex justify-between">
                        <span>{count} × {denominationLabels[key as keyof typeof denominationLabels]}</span>
                        <span>${value.toFixed(2)}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={clearAll}
              className="w-full"
            >
              Clear All
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoneyCalculator;