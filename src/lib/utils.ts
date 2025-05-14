
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Time utilities for cartão ponto
export function convertMinutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function convertTimeStringToMinutes(timeString: string): number {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  return (hours * 60) + minutes;
}

export function calculateTimeDifference(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  
  const startMinutes = convertTimeStringToMinutes(startTime);
  const endMinutes = convertTimeStringToMinutes(endTime);
  
  return endMinutes - startMinutes;
}

export function addTimes(time1: string, time2: string): string {
  const totalMinutes = convertTimeStringToMinutes(time1) + convertTimeStringToMinutes(time2);
  return convertMinutesToTimeString(totalMinutes);
}

export function formatDecimalHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}:${minutes.toString().padStart(2, '0')}`;
}
