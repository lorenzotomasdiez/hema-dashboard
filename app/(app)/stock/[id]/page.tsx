import {ProductStockSection} from "@/components/sections";
import { notFound } from "next/navigation";

export default function StockDetailsPage({ params }: { params: { id: string } }) {
  const id = params.id;

  if(!id) return notFound();

  return (
    <div>
      <ProductStockSection productId={Number(id)} />
    </div>
  );
}