import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, DollarSign, Percent, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Money Calculator', icon: DollarSign },
    { path: '/currency', label: 'Currency Converter', icon: Calculator },
    { path: '/tax', label: 'Tax Calculator', icon: Percent },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-card border-b border-card-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Calculator className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                FinanceCalc
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    className={cn(
                      'flex items-center gap-2',
                      isActive(item.path) && 'bg-primary text-primary-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-card-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <Button
                      variant={isActive(item.path) ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-2',
                        isActive(item.path) && 'bg-primary text-primary-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;