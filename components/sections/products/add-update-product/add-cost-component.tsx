"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCostComponent } from "@prisma/client";
import Decimal from "decimal.js";
import { useState } from "react";

const costComponentInitialState = (productId: number): ProductCostComponent & { isNew: boolean } => ({
  id: new Date().getTime(),
  name: "",
  cost: new Decimal(0),
  productId: productId,
  createdAt: new Date(),
  updatedAt: new Date(),
  isNew: true,
})

interface AddCostComponentProps {
  handleAddCostComponent: (costComponent: ProductCostComponent & { isNew: boolean }) => void;
  productId: number;
}
export default function AddCostComponent({
  handleAddCostComponent,
  productId
}: AddCostComponentProps) {
  const [costComponentName, setCostComponentName] = useState<ProductCostComponent & { isNew: boolean }>(costComponentInitialState(productId));

  const updateCostComponentName = (name: string) => {
    setCostComponentName({ ...costComponentName, name });
  }

  const updateCostComponentCost = (cost: string) => {
    setCostComponentName({ ...costComponentName, cost: new Decimal(Number(cost)) });
  }

  const handleAdd = () => {
    handleAddCostComponent(costComponentName);
    setCostComponentName(costComponentInitialState(productId));
  }

  return (
    <div className="w-full grid grid-cols-2 gap-4 border border-neutral-300 p-3 rounded-lg">
      <div className="col-span-1 grid grid-cols-4 items-center">
        <Label htmlFor="costComponentName" className="col-span-1">Nombre</Label>
        <Input
          type="text"
          placeholder="Nombre del costo"
          id="costComponentName"
          onChange={(e) => updateCostComponentName(e.target.value)}
          value={costComponentName.name}
          className="col-span-3"
        />
      </div>
      <div className="col-span-1 grid grid-cols-4 items-center">
        <Label htmlFor="costComponentValue" className="col-span-1">Precio</Label>
        <Input
          type="number"
          placeholder="Precio del costo"
          id="costComponentValue"
          onChange={(e) => updateCostComponentCost(e.target.value)}
          value={costComponentName.cost.toString()}
          className="col-span-3"
        />
      </div>
      <Button
        onClick={handleAdd}
        className="col-span-2 w-full md:max-w-[350px] mx-auto"
        type="button"
        disabled={!costComponentName.name || !costComponentName.cost}
      >
        Agregar
      </Button>
    </div>
  )
}