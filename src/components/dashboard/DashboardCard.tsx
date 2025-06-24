
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  value?: string | number;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  footer?: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  to,
  value,
  color = 'primary',
  footer,
  className
}) => {
  const colorClass = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-slate-600 text-white',
    accent: 'bg-orange-500 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-black',
    danger: 'bg-red-600 text-white',
    info: 'bg-cyan-600 text-white',
  };

  return (
    <Link to={to}>
      <Card className={cn("transition-all hover:shadow-md hover:-translate-y-1", className)}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
            <div className={cn("p-2 rounded-lg", colorClass[color])}>
              {icon}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {value && (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </CardContent>
        {footer && (
          <CardFooter className="pt-0 text-sm text-muted-foreground">
            {footer}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default DashboardCard;
