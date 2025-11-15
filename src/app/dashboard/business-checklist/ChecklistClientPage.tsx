"use client";

import { useState, useEffect } from 'react';
import { getChecklistItems, updateChecklistItem } from './actions';

interface ChecklistItem {
  id: number;
  category: string;
  text: string;
  isChecked: boolean;
}

export default function ChecklistClientPage({ initialItems }: { initialItems: ChecklistItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories(prevState => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  const handleCheckboxChange = async (itemId: number, isChecked: boolean) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, isChecked } : item
    );
    setItems(updatedItems);
    await updateChecklistItem(itemId, isChecked);
  };

  const progress = items.length > 0 ? (items.filter(item => item.isChecked).length / items.length) * 100 : 0;

  const itemsByCategory: Record<string, ChecklistItem[]> = {
    "Business Plan": [],
    "Financials": [],
    "Marketing": [],
    "Legal": [],
  };

  items.forEach(item => {
    if (itemsByCategory[item.category]) {
      itemsByCategory[item.category].push(item);
    }
  });

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Business Checklist</h1>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="space-y-6">
        {Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => (
          <div key={categoryName} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 cursor-pointer" onClick={() => toggleCategory(categoryName)}>
              {categoryName}
            </h2>
            {!collapsedCategories[categoryName] && (
              <ul className="space-y-4">
                {categoryItems.map(item => (
                  <li key={item.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
