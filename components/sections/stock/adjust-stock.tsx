"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductWithStock } from "@/types/stock";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdjustStockMutation } from "@/lib/tanstack/useStock";
import { useQueryClient } from "@tanstack/react-query";

interface AdjustStockProps {
  product: ProductWithStock;
}

export default function AdjustStock({ product }: AdjustStockProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [stock, setStock] = useState(product.stock);
  const isEnabled = input == "AJUSTAR";

  const addStockMutation = AdjustStockMutation({queryClient})
  
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addStockMutation.mutate({productId: product.id, stock})
    setInput("");
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Ajustar Stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ajustar Stock de <span className="font-bold text-green-500">{product.name}</span>
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
            El ajuste se realizará en base al stock existente.
          </p>
        <div className="py-2 grid grid-cols-2 gap-5">
          <Input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ingresar 'AJUSTAR' para ajustar el stock"
          />
          <Input 
            type="number" 
            value={stock} 
            onChange={(e) => setStock(Number(e.target.value))} 
            placeholder="Stock actual"
          />
          <Button disabled={!isEnabled} onClick={handleConfirm} className="col-span-2">
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}