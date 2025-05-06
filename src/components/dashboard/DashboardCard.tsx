
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
    primary: 'bg-conserv-primary text-white',
    secondary: 'bg-conserv-secondary text-white',
    accent: 'bg-conserv-accent text-black',
    success: 'bg-conserv-success text-white',
    warning: 'bg-conserv-warning text-black',
    danger: 'bg-conserv-danger text-white',
    info: 'bg-conserv-info text-white',
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
