"use client";

import { useState, useEffect } from "react";
import { Business, DBA } from "@/db/schema"; // Import DBA type
import { useFormState } from "react-dom";
import { updateBusinessProfile, createDBA, updateDBA, deleteDBA } from "../../actions"; // Assuming these actions exist
import AddEditDbaForm from "./AddEditDbaForm"; // Import AddEditDbaForm

interface BusinessInfoFormProps {
  initialBusiness: Business;
}

export default function BusinessInfoForm({ initialBusiness }: BusinessInfoFormProps) {
  const [business, setBusiness] = useState(initialBusiness);
  const [dbas, setDbas] = useState<DBA[]>(initialBusiness.dbas || []); // Initialize DBAs state
  const [state, formAction] = useFormState(updateBusinessProfile, undefined);
  const [showAddDbaForm, setShowAddDbaForm] = useState(false);
  const [editingDba, setEditingDba] = useState<DBA | null>(null);

  const handleDeleteDba = async (dbaId: number) => {
    if (confirm("Are you sure you want to delete this DBA?")) {
      const result = await deleteDBA(dbaId, business.id);
      if (result?.error) {
        alert(result.error);
      } else {
        setDbas(dbas.filter(d => d.id !== dbaId));
      }
    }
  };

  useEffect(() => {
    if (state?.success && state.updatedBusiness) {
      setBusiness(state.updatedBusiness);
    }
  }, [state]);

  const isSoleProprietorship = business.businessType === 'Sole Proprietorship';

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="businessId" value={business.id} />

      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
          Business Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={business.businessName}
            onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
          Business Type
        </label>
        <div className="mt-1">
          <select
            id="businessType"
            name="businessType"
            value={business.businessType}
            onChange={(e) => setBusiness({ ...business, businessType: e.target.value as Business['businessType'] })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="Partnership">Partnership</option>
            <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
            <option value="Corporation">Corporation</option>
          </select>
        </div>
      </div>

      {/* Conditional: Your full name for tax reasons (for Sole Proprietorship) */}
      {isSoleProprietorship && (
        <div>
          <label htmlFor="taxFullName" className="block text-sm font-medium text-gray-700">
            Your full name for tax reasons
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="taxFullName"
              name="taxFullName"
              value={business.taxFullName || ''}
              onChange={(e) => setBusiness({ ...business, taxFullName: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      {/* Conditional: DBAs section (for non-Sole Proprietorship) */}
      {!isSoleProprietorship && (
        <div>
          <h3 className="text-lg font-medium text-gray-900">DBAs (Doing Business As) / Trade Names</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add any other names your business operates under. This is often required for legal and banking purposes.
          </p>
          <div className="mt-4 space-y-4">
            {dbas.length === 0 ? (
              <p className="text-sm text-gray-500">No DBAs added yet.</p>
            ) : (
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                {dbas.map((dba) => (
                  <li key={dba.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div className="w-0 flex-1 flex items-center">
                      <span className="ml-2 flex-1 w-0 truncate">{dba.dbaName}</span>
                      {dba.legalBusinessName && <span className="ml-2 text-gray-500">({dba.legalBusinessName})</span>}
                      {dba.isPrimary && <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Primary</span>}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingDba(dba)}
                        className="font-medium text-indigo-600 hover:text-indigo-500 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDba(dba.id)}
                        className="font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => { setShowAddDbaForm(true); setEditingDba(null); }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              + Add DBA (or Trade Name)
            </button>
          </div>

          {(showAddDbaForm || editingDba) && (
            <AddEditDbaForm
              businessId={business.id}
              dbaToEdit={editingDba}
              onSave={(newDba) => {
                if (editingDba) {
                  setDbas(dbas.map(d => d.id === newDba.id ? newDba : d));
                } else {
                  setDbas([...dbas, newDba]);
                }
                setShowAddDbaForm(false);
                setEditingDba(null);
              }}
              onCancel={() => { setShowAddDbaForm(false); setEditingDba(null); }}
            />
          )}
        </div>
      )}

      {state?.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm text-green-600">{state.message}</p>}

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
