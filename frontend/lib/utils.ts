import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 6): string {
  if (isNaN(value) || value === null || value === undefined) return '0';
  
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(value);
}

export function getReadableStxAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function estimateRewards(
  stakedAmount: number,
  rewardRate: number,
  days: number
): number {
  // Simple compound interest calculation
  const dailyRate = rewardRate / 365 / 100;
  return stakedAmount * Math.pow(1 + dailyRate, days) - stakedAmount;
}