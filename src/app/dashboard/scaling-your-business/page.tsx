"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

const checklistItems = {
  "Getting Started": [
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
      description: "An EIN is free and protects your identity. It's mandatory for LLCs but just good to have for sole proprietors. But you can start making sales after you have an EIN."
    },
    {
      id: 'bank-account',
      label: 'Business Bank Account',
      link: 'https://www.americanexpress.com/en-us/business/checking/?eep=79266&utm_source=go&utm_campaign=bca-br&utm_medium=se&utm_term=american+express+business+account_3495823104_161616706515&utm_content=e&refid=amex_search_bca_go_br_pro|CjwKCAiAraXJBhBJEiwAjz7MZUK2ZMY8X5y-V-oqPQVb9k8TvVB7I3oprUE0cTfjEWkrxef36MOV6RoC1IsQAvD_BwE&gclsrc=aw.ds&gad_source=1&gad_campaignid=18543565565&gbraid=0AAAAADq2FFrtgsc-sNo5arWorXld15YAv&gclid=CjwKCAiAraXJBhBJEiwAjz7MZUK2ZMY8X5y-V-oqPQVb9k8TvVB7I3oprUE0cTfjEWkrxef36MOV6RoC1IsQAvD_BwE',
      description: 'You cannot apply for a business bank account until your entity is fully formed and approved by the state.'
    },
  ],
  "Profitable": [
    {
      id: 'pricing',
      label: 'Product & Service Pricing Completed',
      link: '/dashboard/financial-tools/budget',
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
      link: '/dashboard/financial-tools/bookkeeping',
      description: 'Placeholder description for Bookkeeping System.'
    },
  ],
  "Stability": {
    "Financial Stability": [
      {
        id: 'fs-1',
        title: 'Separate Business and Personal Finances',
        description: 'Maintain separate bank accounts and credit cards for your business to simplify bookkeeping and protect your personal assets.'
      },
      {
        id: 'fs-2',
        title: 'Build an Emergency Fund',
        description: 'Set aside 3-6 months of living expenses in a separate savings account to cover unexpected shortfalls.'
      },
    ],
    "Client Stability": [
      {
        id: 'cs-1',
        title: 'Diversify Your Client Base',
        description: 'Avoid relying on a single client for a significant portion of your income. Aim to have a mix of clients to reduce risk.'
      },
      {
        id: 'cs-2',
        title: 'Develop a Client Acquisition Strategy',
        description: 'Create a repeatable process for finding and attracting new clients, such as networking, content marketing, or advertising.'
      },
    ],
    "Taxes & Compliance": [
      {
        id: 'tc-1',
        title: 'Understand Your Tax Obligations',
        description: 'Consult with a tax professional to understand your federal, state, and local tax obligations, including income tax, self-employment tax, and sales tax.'
      },
      {
        id: 'tc-2',
        title: 'Set Aside Money for Taxes',
        description: 'Regularly set aside a percentage of your income (e.g., 25-30%) to cover your quarterly estimated tax payments.'
      },
    ],
    "Scaling": [
      {
        id: 's-1',
        title: 'Automate Repetitive Tasks',
        description: 'Use software and tools to automate tasks like invoicing, scheduling, and email marketing to free up your time.'
      },
      {
        id: 's-2',
        title: 'Delegate or Outsource',
        description: 'Consider hiring contractors or employees to handle tasks that are outside of your expertise or that you don\'t have time for.'
      },
    ]
  }
};

export default function ScalingYourBusinessPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof checklistItems>('Getting Started');
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

  const currentChecklist = checklistItems[activeTab];

  const progress = useMemo(() => {
    const items = Array.isArray(currentChecklist) ? currentChecklist : Object.values(currentChecklist).flat();
    const checkedCount = items.filter(item => checkedItems[item.id]).length;
    return (checkedCount / items.length) * 100;
  }, [checkedItems, currentChecklist]);

  return (
    <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
      <div className="flex border-b">
        {Object.keys(checklistItems).map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-lg font-medium ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab as keyof typeof checklistItems)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeTab}</h2>
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
          {Array.isArray(currentChecklist) ? (
            currentChecklist.map((item) => (
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
            ))
          ) : (
            Object.entries(currentChecklist).map(([section, items]) => (
              <div key={section}>
                <h3 className="text-xl font-bold text-gray-800 mt-6 mb-4">{section}</h3>
                {items.map((item: any) => (
                  <div key={item.id} className="mb-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={checkedItems[item.id] || false}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <button onClick={() => toggleExpand(item.id)} className="ml-3 text-lg text-gray-700 text-left flex-grow">
                        {item.title}
                      </button>
                    </div>
                    {expandedItems[item.id] && (
                      <div className="mt-2 ml-8 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}