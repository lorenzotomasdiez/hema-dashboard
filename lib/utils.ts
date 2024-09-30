import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OrderStatus, Product, UserRole } from "@prisma/client"
import { CompleteOrderProduct } from "@/prisma/zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const moneyMask = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(value);
}


export const calculatePrice = (products: CompleteOrderProduct[], productsData?: Product[]) => {
  if (!productsData) return " - ";
  const price = products.reduce((acc, product) => {
    const productData = productsData?.find(p => p.id === product.productId);
    if (!productData) return acc;
    return acc + (productData.price * product.quantity);
  }, 0);
  return moneyMask(price);
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

export const statusToSpanish = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "Pendiente";
    case OrderStatus.SHIPPED:
      return "En camino";
    case OrderStatus.DELIVERED:
      return "Entregado";
  }
}

export const UserRoleTranslator = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "Admin";
    case UserRole.COMPANY_ADMIN:
      return "Admin";
    case UserRole.COMPANY_OWNER:
      return "Propietario";
    case UserRole.COMPANY_WORKER:
      return "Empleado";
    default:
      throw new Error("Invalid user role");
  }
}

