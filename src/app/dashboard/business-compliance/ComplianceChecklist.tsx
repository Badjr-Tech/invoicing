"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function ComplianceChecklist({ checklistItems }) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const progress = useMemo(() => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return (checkedCount / checklistItems.length) * 100;
  }, [checkedItems, checklistItems]);

  return (
    <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Compliance Checklist</h2>
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800">Progress</h3>
        <div className="mt-2 bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{Math.round(progress)}% Complete</p>
      </div>
      <div className="space-y-4">
        {checklistItems.map((item) => (
          <div key={item.id}>
            <div className="flex items-center">
              <input
                type="checkbox"
                id={item.itemId}
                checked={checkedItems[item.itemId] || false}
                onChange={() => handleCheckboxChange(item.itemId)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <button onClick={() => toggleExpand(item.itemId)} className="ml-3 text-lg text-gray-700 text-left flex-grow">
                {item.title}
              </button>
            </div>
            {expandedItems[item.itemId] && (
              <div className="mt-2 ml-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">{item.description}</p>
                {item.link && (
                  <Link href={item.link} target={item.link.startsWith('/') ? '_self' : '_blank'} rel={item.link.startsWith('/') ? '' : 'noopener noreferrer'} className="text-blue-600 hover:underline mt-2 inline-block">
                    Go to resource
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
