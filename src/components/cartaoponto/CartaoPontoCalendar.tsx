
import React from 'react';
import { format, parseISO, getDaysInMonth, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CartaoPonto } from '@/types/cartaoPonto';
import { Button } from '@/components/ui/button';
import { Check, Clock, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartaoPontoCalendarProps {
  registros: CartaoPonto[];
  date: Date;
  onDateSelect?: (date: string) => void;
}

interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  registro?: CartaoPonto;
  isToday: boolean;
  isWeekend: boolean;
}

const CartaoPontoCalendar: React.FC<CartaoPontoCalendarProps> = ({ 
  registros, 
  date,
  onDateSelect
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal':
        return 'border-blue-300 bg-blue-50';
      case 'pending':
        return 'border-amber-300 bg-amber-50';
      case 'approved':
        return 'border-green-300 bg-green-50';
      case 'rejected':
        return 'border-red-300 bg-red-50';
      default:
        return '';
    }
  };

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();
  const daysInMonth = getDaysInMonth(date);
  
  // Get first day of month and number of blank days
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = getDay(firstDayOfMonth); // 0 for Sunday
  
  // Adjust for weeks starting on Monday (0 = Monday, 6 = Sunday)
  const blankDays = (firstDayOfWeek + 6) % 7;
  
  const calendarDays: CalendarDay[] = [];
  
  // Add blank days for previous month
  for (let i = 0; i < blankDays; i++) {
    const prevMonthDay = new Date(year, month, -i);
    calendarDays.unshift({
      date: prevMonthDay.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      isWeekend: [0, 6].includes(getDay(prevMonthDay)),
    });
  }
  
  // Add days for current month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Find registros for this day
    const registro = registros.find(r => r.data === dateStr);
    
    calendarDays.push({
      date: dateStr,
      isCurrentMonth: true,
      registro,
      isToday: 
        currentDate.getDate() === today.getDate() && 
        currentDate.getMonth() === today.getMonth() && 
        currentDate.getFullYear() === today.getFullYear(),
      isWeekend: [0, 6].includes(getDay(currentDate)),
    });
  }
  
  // Fill remaining days of the last week if needed
  const remainingDays = 42 - calendarDays.length; // 6 rows of 7 days
  
  for (let day = 1; day <= remainingDays; day++) {
    const nextMonthDay = new Date(year, month + 1, day);
    calendarDays.push({
      date: nextMonthDay.toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      isWeekend: [0, 6].includes(getDay(nextMonthDay)),
    });
  }

  // Weekday names
  const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="bg-muted p-3 text-center text-lg font-medium border-b">
        {format(date, 'MMMM yyyy', { locale: ptBR })}
      </div>
      
      <div className="grid grid-cols-7 border-b bg-muted">
        {weekdays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <div 
            key={index}
            className={cn(
              "border p-1 min-h-[80px] relative",
              !day.isCurrentMonth && "bg-muted/20",
              day.isToday && "bg-primary/5",
              day.isWeekend && day.isCurrentMonth && "bg-muted/10"
            )}
          >
            <div className="text-right text-xs mb-1">
              {format(parseISO(day.date), 'd')}
            </div>
            
            {day.registro ? (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-xs p-1 h-auto",
                  getStatusClass(day.registro.status)
                )}
                onClick={() => onDateSelect?.(day.date)}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    {day.registro.horaEntrada || '??:??'} - {day.registro.horaSaida || '??:??'}
                  </div>
                  <div>
                    {getStatusIcon(day.registro.status)}
                  </div>
                </div>
              </Button>
            ) : (
              day.isCurrentMonth && !day.isWeekend && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-xs text-muted-foreground h-auto"
                  onClick={() => onDateSelect?.(day.date)}
                >
                  + Registrar
                </Button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartaoPontoCalendar;
