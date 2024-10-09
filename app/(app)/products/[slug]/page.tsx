import AddUpdateProduct from "@/components/sections/products/add-update-product";

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <AddUpdateProduct slug={params.slug} />
}