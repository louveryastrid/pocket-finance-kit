import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Common currencies with their full names
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  ];

  const convertCurrency = async () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Using a free API for exchange rates
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      const rate = data.rates[toCurrency];
      
      if (!rate) {
        throw new Error('Currency not supported');
      }
      
      const convertedAmount = Number(amount) * rate;
      setResult(convertedAmount);
      setExchangeRate(rate);
      
    } catch (error) {
      // Fallback to mock data if API fails
      const mockRates: { [key: string]: { [key: string]: number } } = {
        USD: { EUR: 0.85, GBP: 0.73, JPY: 110, AUD: 1.35, CAD: 1.25 },
        EUR: { USD: 1.18, GBP: 0.86, JPY: 129, AUD: 1.59, CAD: 1.47 },
        GBP: { USD: 1.37, EUR: 1.16, JPY: 150, AUD: 1.85, CAD: 1.71 },
      };
      
      const rate = mockRates[fromCurrency]?.[toCurrency] || 1;
      const convertedAmount = Number(amount) * rate;
      setResult(convertedAmount);
      setExchangeRate(rate);
      
      toast({
        title: "Using Demo Rates",
        description: "Live rates unavailable, showing demo conversion",
      });
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setExchangeRate(null);
  };

  // Auto-convert when amount or currencies change
  useEffect(() => {
    if (amount && fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      const timer = setTimeout(() => {
        convertCurrency();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [amount, fromCurrency, toCurrency]);

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Currency Converter</h1>
        <p className="text-muted-foreground">Convert between global currencies with live exchange rates</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Converter Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Convert Currency
            </CardTitle>
            <CardDescription>Enter amount and select currencies to convert</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-lg text-center"
                step="0.01"
                min="0"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>From</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapCurrencies}
                  className="rounded-full"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>To</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={convertCurrency} 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Converting...' : 'Convert Now'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
            <CardDescription>Your converted amount and exchange rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result !== null ? (
              <>
                <div className="text-center space-y-2">
                  <div className="text-lg text-muted-foreground">
                    {getCurrencySymbol(fromCurrency)} {Number(amount).toFixed(2)} {fromCurrency}
                  </div>
                  <div className="text-4xl font-bold text-primary">
                    {getCurrencySymbol(toCurrency)} {result.toFixed(2)}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {toCurrency}
                  </div>
                </div>

                {exchangeRate && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Exchange Rate</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>1 {fromCurrency} =</span>
                        <span>{exchangeRate.toFixed(4)} {toCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1 {toCurrency} =</span>
                        <span>{(1 / exchangeRate).toFixed(4)} {fromCurrency}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter an amount and select currencies to see the conversion result
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyConverter;