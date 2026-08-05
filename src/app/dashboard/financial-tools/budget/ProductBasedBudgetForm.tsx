"use client";

import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  cost: number;
  margin: number; // as a percentage, e.g., 20 for 20%
  sellingPrice: number;
}

export default function ProductBasedBudgetForm() {
  const [productName, setProductName] = useState("");
  const [productCost, setProductCost] = useState<number | ''>('');
  const [margin, setMargin] = useState<number | ''>(''); // Margin as a percentage
  const [sellingPrice, setSellingPrice] = useState<number | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [nextProductId, setNextProductId] = useState(1);

  useEffect(() => {
    if (productCost !== '' && margin !== '') {
      const cost = productCost;
      const marginDecimal = margin / 100;
      const calculatedPrice = cost / (1 - marginDecimal);
      setSellingPrice(Math.ceil(calculatedPrice)); // Round up to the nearest dollar
    } else {
      setSellingPrice(null);
    }
  }, [productCost, margin]);

  const handleAddProduct = () => {
    if (productName && productCost !== '' && margin !== '' && sellingPrice !== null) {
      const newProduct: Product = {
        id: nextProductId,
        name: productName,
        cost: productCost,
        margin: margin,
        sellingPrice: sellingPrice,
      };
      setProductsList([...productsList, newProduct]);
      setNextProductId(nextProductId + 1);
      // Clear form fields
      setProductName("");
      setProductCost('');
      setMargin('');
      setSellingPrice(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-card shadow-card">
        <h3 className="text-xl font-bold text-clay-900 mb-4">Product Pricing Tool</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-clay-700">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 sm:text-sm"
              placeholder="e.g., T-Shirt"
            />
          </div>

          {/* Product Cost */}
          <div>
            <label htmlFor="productCost" className="block text-sm font-medium text-clay-700">
              Cost of Product ($)
            </label>
            <input
              type="number"
              id="productCost"
              value={productCost}
              onChange={(e) => setProductCost(parseFloat(e.target.value) || '')}
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 sm:text-sm"
              placeholder="0.00"
            />
          </div>

          {/* Margin */}
          <div>
            <label htmlFor="margin" className="block text-sm font-medium text-clay-700">
              Desired Margin (%)
            </label>
            <input
              type="number"
              id="margin"
              value={margin}
              onChange={(e) => setMargin(parseFloat(e.target.value) || '')}
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 sm:text-sm"
              placeholder="e.g., 20"
            />
          </div>

          {/* Calculated Selling Price */}
          <div>
            <label className="block text-sm font-medium text-clay-700">
              Calculated Selling Price ($)
            </label>
            <p className="mt-1 text-lg font-bold text-clay-900">
              {sellingPrice !== null ? `$${sellingPrice.toFixed(2)}` : 'Enter cost and margin'}
            </p>
          </div>
        </div>

        <button
          onClick={handleAddProduct}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-control shadow-sm text-sm font-medium text-white bg-ember-600 hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300"
        >
          Add Product
        </button>
      </div>

      {productsList.length > 0 && (
        <div className="bg-white p-6 rounded-card shadow-card mt-6 max-h-96 overflow-y-auto">
          <h3 className="text-xl font-bold text-clay-900 mb-4">Added Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-clay-200">
              <thead className="bg-clay-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-clay-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-clay-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-clay-500 uppercase tracking-wider">
                    Margin (%)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-clay-500 uppercase tracking-wider">
                    Selling Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-clay-200">
                {productsList.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-clay-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-clay-500">${product.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-clay-500">{product.margin}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-700">
                      ${product.sellingPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
