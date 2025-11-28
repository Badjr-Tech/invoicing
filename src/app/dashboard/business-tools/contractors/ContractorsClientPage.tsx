"use client";

import { useState, useEffect } from 'react';
// import { useAuth } from '@clerk/nextjs'; // Removed

interface Business {
  id: number;
  businessName: string;
}

interface Contractor {
  id: number;
  name: string;
  role: string | null;
  monthlyPayment: number;
  businessId: number;
  taxId: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

export default function ContractorsClientPage() {
  // TODO: Implement proper authentication and get the actual userId
  const userId = 1; // Placeholder userId for now
  // const { userId } = useAuth(); // Removed
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for adding/editing a contractor
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);

  useEffect(() => {
    // if (userId) { // Removed check
      fetchData();
    // }
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch businesses
      const businessesRes = await fetch('/api/businesses');
      if (!businessesRes.ok) {
        throw new Error(`Failed to fetch businesses: ${businessesRes.statusText}`);
      }
      const businessesData: Business[] = await businessesRes.json();
      setBusinesses(businessesData);

      // Fetch contractors
      const contractorsRes = await fetch('/api/contractors');
      if (!contractorsRes.ok) {
        throw new Error(`Failed to fetch contractors: ${contractorsRes.statusText}`);
      }
      const contractorsData: Contractor[] = await contractorsRes.json();
      setContractors(contractorsData);

    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !monthlyPayment || !selectedBusinessId) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      name,
      role: role || null,
      monthlyPayment: parseFloat(monthlyPayment),
      businessId: parseInt(selectedBusinessId),
      taxId: taxId || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zipCode: zipCode || null,
    };

    try {
      let res: Response;
      if (editingContractor) {
        // Update existing contractor
        res = await fetch(`/api/contractors/${editingContractor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Add new contractor
        res = await fetch('/api/contractors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save contractor.');
      }

      // Clear form and refetch data
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleEdit = (contractor: Contractor) => {
    setEditingContractor(contractor);
    setName(contractor.name);
    setRole(contractor.role || '');
    setMonthlyPayment(contractor.monthlyPayment.toString());
    setSelectedBusinessId(contractor.businessId.toString());
    setTaxId(contractor.taxId || '');
    setAddress(contractor.address || '');
    setCity(contractor.city || '');
    setState(contractor.state || '');
    setZipCode(contractor.zipCode || '');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contractor?')) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/contractors/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete contractor.');
      }
      fetchData(); // Refetch data after deletion
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setMonthlyPayment('');
    setSelectedBusinessId('');
    setTaxId('');
    setAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setEditingContractor(null);
  };

  if (loading) return <div className="p-6">Loading contractors...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  // if (!userId) return <div className="p-6">Please log in to manage contractors.</div>; // Removed check

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Contractors</h1>

      {/* Add/Edit Contractor Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{editingContractor ? 'Edit Contractor' : 'Add New Contractor'}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role (Optional)</label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="monthlyPayment" className="block text-sm font-medium text-gray-700">Monthly Payment ($)</label>
            <input
              type="number"
              id="monthlyPayment"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="business" className="block text-sm font-medium text-gray-700">Assign to Business</label>
            <select
              id="business"
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a Business</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.businessName}
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-2">1099 Information (Optional)</h3>
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID (SSN/EIN)</label>
            <input
              type="text"
              id="taxId"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {editingContractor ? 'Update Contractor' : 'Add Contractor'}
            </button>
            {editingContractor && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Contractors List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Contractors</h2>
        {contractors.length === 0 ? (
          <p>No contractors added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {contractors.map((contractor) => (
              <li key={contractor.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium text-gray-900">{contractor.name} ({contractor.role || 'N/A'})</p>
                  <p className="text-sm text-gray-600">
                    Monthly Payment: ${contractor.monthlyPayment.toFixed(2)} - Assigned to: {businesses.find(b => b.id === contractor.businessId)?.businessName || 'N/A'}
                  </p>
                  {contractor.taxId && (
                    <p className="text-xs text-gray-500">Tax ID: {contractor.taxId}</p>
                  )}
                  {contractor.address && (
                    <p className="text-xs text-gray-500">Address: {contractor.address}, {contractor.city}, {contractor.state} {contractor.zipCode}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(contractor)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contractor.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
                  {/* Future Payment Button */}
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    disabled // Disable until payment integration is ready
                  >
                    Record Payment
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
