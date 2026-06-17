//     src/app/admin/products/new/page.tsx 

import ProductForm from "@/components/admin/ProductForm"

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Neues Produkt erstellen
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <ProductForm isEditing={false} />
      </div>
    </div>
  )
}