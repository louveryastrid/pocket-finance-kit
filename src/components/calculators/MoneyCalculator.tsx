import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, DollarSign } from 'lucide-react';

const currencyData: Record<string, any> = {
  USD: {
    name: 'US Dollar',
    symbol: '$',
    bills: [100, 50, 20, 10, 5, 2, 1],
    coins: [0.25, 0.10, 0.05, 0.01],
    coinLabels: ['Quarter', 'Dime', 'Nickel', 'Penny']
  },
  EUR: {
    name: 'Euro',
    symbol: '€',
    bills: [500, 200, 100, 50, 20, 10, 5],
    coins: [2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01],
    coinLabels: ['2€', '1€', '50¢', '20¢', '10¢', '5¢', '2¢', '1¢']
  },
  GBP: {
    name: 'British Pound',
    symbol: '£',
    bills: [50, 20, 10, 5],
    coins: [2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01],
    coinLabels: ['£2', '£1', '50p', '20p', '10p', '5p', '2p', '1p']
  },
  INR: {
    name: 'Indian Rupee',
    symbol: '₹',
    bills: [2000, 500, 200, 100, 50, 20, 10, 5],
    coins: [10, 5, 2, 1],
    coinLabels: ['₹10', '₹5', '₹2', '₹1']
  },
  JPY: {
    name: 'Japanese Yen',
    symbol: '¥',
    bills: [10000, 5000, 2000, 1000],
    coins: [500, 100, 50, 10, 5, 1],
    coinLabels: ['¥500', '¥100', '¥50', '¥10', '¥5', '¥1']
  },
  CAD: {
    name: 'Canadian Dollar',
    symbol: 'C$',
    bills: [100, 50, 20, 10, 5],
    coins: [2, 1, 0.25, 0.10, 0.05],
    coinLabels: ['$2', '$1', '25¢', '10¢', '5¢']
  },
  AUD: {
    name: 'Australian Dollar',
    symbol: 'A$',
    bills: [100, 50, 20, 10, 5],
    coins: [2, 1, 0.50, 0.20, 0.10, 0.05],
    coinLabels: ['$2', '$1', '50¢', '20¢', '10¢', '5¢']
  },
  CNY: {
    name: 'Chinese Yuan',
    symbol: '¥',
    bills: [100, 50, 20, 10, 5, 1],
    coins: [1, 0.50, 0.10],
    coinLabels: ['¥1', '5角', '1角']
  }
};

const MoneyCalculator = () => {
  const [currency, setCurrency] = useState('USD');
  const [denominations, setDenominations] = useState<Record<string, string>>({});

  const currentCurrency = currencyData[currency];

  const calculateTotal = () => {
    let total = 0;
    currentCurrency.bills.forEach((value: number) => {
      const count = parseFloat(denominations[`bill_${value}`] || '0');
      total += count * value;
    });
    currentCurrency.coins.forEach((value: number) => {
      const count = parseFloat(denominations[`coin_${value}`] || '0');
      total += count * value;
    });
    return total;
  };

  const handleInputChange = (key: string, value: string) => {
    setDenominations(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setDenominations({});
  };

  const clearAll = () => {
    setDenominations({});
  };

  const total = calculateTotal();

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Money Calculator</h1>
        <p className="text-muted-foreground">Count your cash denominations and get the total value</p>
        
        {/* Currency Selector */}
        <div className="flex justify-center">
          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(currencyData).map(([code, data]) => (
                <SelectItem key={code} value={code}>
                  {data.symbol} {data.name} ({code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Bills Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-4 w-4 text-primary" />
              Bills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentCurrency.bills.map((value: number) => (
              <div key={value} className="flex items-center gap-2">
                <Label htmlFor={`bill_${value}`} className="min-w-[80px] text-sm">
                  {currentCurrency.symbol}{value}
                </Label>
                <Input
                  id={`bill_${value}`}
                  type="number"
                  value={denominations[`bill_${value}`] || ''}
                  onChange={(e) => handleInputChange(`bill_${value}`, e.target.value)}
                  placeholder=""
                  min="0"
                  className="h-9 text-center"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Coins Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-4 w-4 text-secondary" />
              Coins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentCurrency.coins.map((value: number, index: number) => (
              <div key={value} className="flex items-center gap-2">
                <Label htmlFor={`coin_${value}`} className="min-w-[80px] text-sm">
                  {currentCurrency.coinLabels[index]}
                </Label>
                <Input
                  id={`coin_${value}`}
                  type="number"
                  value={denominations[`coin_${value}`] || ''}
                  onChange={(e) => handleInputChange(`coin_${value}`, e.target.value)}
                  placeholder=""
                  min="0"
                  className="h-9 text-center"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Total Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-lg">Total Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">
                {currentCurrency.symbol}{total.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total cash value
              </p>
            </div>

            {Object.keys(denominations).length > 0 && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                <h4 className="font-semibold text-sm">Breakdown:</h4>
                <div className="text-xs space-y-1">
                  {currentCurrency.bills.map((value: number) => {
                    const count = parseFloat(denominations[`bill_${value}`] || '0');
                    if (count === 0) return null;
                    return (
                      <div key={value} className="flex justify-between">
                        <span>{count} × {currentCurrency.symbol}{value}</span>
                        <span>{currentCurrency.symbol}{(count * value).toFixed(2)}</span>
                      </div>
                    );
                  })}
                  {currentCurrency.coins.map((value: number, index: number) => {
                    const count = parseFloat(denominations[`coin_${value}`] || '0');
                    if (count === 0) return null;
                    return (
                      <div key={value} className="flex justify-between">
                        <span>{count} × {currentCurrency.coinLabels[index]}</span>
                        <span>{currentCurrency.symbol}{(count * value).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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