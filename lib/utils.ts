import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const moneyMask = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(value);
}

export const generateDashboardPalette = (count: number) => {
  const colors = [
    "#635BFF", // Stripe's primary blue
    "#00D4FF", // Bright cyan
    "#FF6B6B", // Coral red
    "#FFD166", // Muted yellow
    "#06D6A0", // Mint green
    "#118AB2", // Deep blue
    "#7B61FF", // Purple
    "#FFA15C", // Light orange
    "#4CAF50", // Green
  ];
  return colors.slice(0, count);
}