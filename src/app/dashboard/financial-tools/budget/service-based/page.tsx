import ServiceBasedBudgetForm from "../ServiceBasedBudgetForm";

export default function ServiceBasedBudgetCreationPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Create Service-Based Budget</h1>
      <ServiceBasedBudgetForm />
    </div>
  );
}