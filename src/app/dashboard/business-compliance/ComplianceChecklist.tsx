"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

const checklistItems = [
  {
    id: 'llc',
    label: 'LLC or Business Formation',
    link: '#',
    description: 'Placeholder description for LLC or Business Formation.'
  },
  {
    id: 'ein',
    label: 'EIN',
    link: 'https://sa.www4.irs.gov/applyein/legalStructure',
    description: "An EIN is free and protects your identity. It's mandatory for LLCs but just good to have for sole proprietors."
  },
  {
    id: 'bank-account',
    label: 'Business Bank Account',
    link: 'https://www.americanexpress.com/en-us/business/checking/?eep=79266&utm_source=go&utm_campaign=bca-br&utm_medium=se&utm_term=american+express+business+account_3495823104_161616706515&utm_content=e&refid=amex_search_bca_go_br_pro|CjwKCAiAraXJBhBJEiwAjz7MZUK2ZMY8X5y-V-oqPQVb9k8TvVB7I3oprUE0cTfjEWkrxef36MOV6RoC1IsQAvD_BwE&gclsrc=aw.ds&gad_source=1&gad_campaignid=18543565565&gbraid=0AAAAADq2FFrtgsc-sNo5arWorXld15YAv&gclid=CjwKCAiAraXJBhBJEiwAjz7MZUK2ZMY8X5y-V-oqPQVb9k8TvVB7I3oprUE0cTfjEWkrxef36MOV6RoC1IsQAvD_BwE',
    description: 'Placeholder description for Business Bank Account.'
  },
  {
    id: 'pricing',
    label: 'Product & Service Pricing Completed',
    link: '/dashboard/financial-tools/budget/pricing-tools/product',
    description: 'Placeholder description for Product & Service Pricing.'
  },
  {
    id: 'cashflow',
    label: '6-Month Cashflow Budget Completed',
    link: '/dashboard/financial-tools/budget',
    description: 'Placeholder description for 6-Month Cashflow Budget.'
  },
  {
    id: 'bookkeeping',
    label: 'Bookkeeping System Set Up',
    link: '#',
    description: 'Placeholder description for Bookkeeping System.'
  },
  {
    id: 'website',
    label: 'Website Live',
    link: '#',
    description: 'Placeholder description for Website.'
  },
  {
    id: 'email',
    label: 'Professional Email Created',
    link: '#',
    description: 'Placeholder description for Professional Email.'
  },
];

export default function ComplianceChecklist() {
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
  }, [checkedItems]);

  return (
    <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Compliance Checklist</h2>
      <div className="space-y-4">
        {checklistItems.map((item) => (
          <div key={item.id}>
            <div className="flex items-center">
              <input
                type="checkbox"
                id={item.id}
                checked={checkedItems[item.id] || false}
                onChange={() => handleCheckboxChange(item.id)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <button onClick={() => toggleExpand(item.id)} className="ml-3 text-lg text-gray-700 text-left flex-grow">
                {item.label}
              </button>
            </div>
            {expandedItems[item.id] && (
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
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800">Progress</h3>
        <div className="mt-2 bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{Math.round(progress)}% Complete</p>
      </div>
    </div>
  );
}
