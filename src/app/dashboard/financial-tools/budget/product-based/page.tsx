import ProductBasedBudgetForm from "../ProductBasedBudgetForm";

export default function ProductBasedBudgetCreationPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Create Product-Based Budget</h1>
      <ProductBasedBudgetForm />
    </div>
  );
}