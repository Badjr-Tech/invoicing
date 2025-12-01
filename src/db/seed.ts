import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from './index';
import { adminChecklistItems } from './schema';

async function main() {
  const complianceItems = [
    {
      itemId: 'llc',
      category: 'business-compliance',
      title: 'LLC or Business Formation',
      description: 'Placeholder description for LLC or Business Formation.',
      link: '#',
    },
    {
      itemId: 'ein',
      category: 'business-compliance',
      title: 'EIN',
      description: "An EIN is free and protects your identity. It's mandatory for LLCs but just good to have for sole proprietors. But you can start making sales after you have an EIN.",
      link: 'https://sa.www4.irs.gov/applyein/legalStructure',
    },
    {
      itemId: 'bank-account',
      category: 'business-compliance',
      title: 'Business Bank Account',
      description: 'You cannot apply for a business bank account until your entity is fully formed and approved by the state.',
      link: 'https://www.americanexpress.com/en-us/business/checking/?eep=79266&utm_source=go&utm_campaign=bca-br&utm_medium=se&utm_term=american+express+business+account_3495823104_161616706515&utm_content=e&refid=amex_search_bca_go_br_pro|CjwKCAiAraXJBhBJEiwAjz7MZUK2ZMY8X5y-V-oqPQVb9k8TvVB7I3oprUE0cTfjEWkrxef36MOV6RoC1IsQAvD_BwE&gclsrc=aw.ds&gad_source=1&gad_campaignid=18543565565&gbraid=0AAAAADq2FFrtgsc-sNo5arWorXld15YAv&gclid=CjwKCAiAraXJBhBJEiwAjz7MZUK2ZMY8X5y-V-oqPQVb9k8TvVB7I3oprUE0cTfjEWkrxef36MOV6RoC1IsQAvD_BwE',
    },
    {
      itemId: 'pricing',
      category: 'business-compliance',
      title: 'Product & Service Pricing Completed',
      description: 'Placeholder description for Product & Service Pricing.',
      link: '/dashboard/financial-tools/budget',
    },
    {
      itemId: 'cashflow',
      category: 'business-compliance',
      title: '6-Month Cashflow Budget Completed',
      description: 'Placeholder description for 6-Month Cashflow Budget.',
      link: '/dashboard/financial-tools/budget',
    },
    {
      itemId: 'bookkeeping',
      category: 'business-compliance',
      title: 'Bookkeeping System Set Up',
      description: 'Placeholder description for Bookkeeping System.',
      link: '/dashboard/financial-tools/bookkeeping',
    },
    {
      itemId: 'website',
      category: 'business-compliance',
      title: 'Website Live',
      description: 'Placeholder description for Website.',
      link: '/dashboard/products/website',
    },
    {
      itemId: 'email',
      category: 'business-compliance',
      title: 'Professional Email Created',
      description: 'Placeholder description for Professional Email.',
      link: '/dashboard/products/professional-email',
    },
  ];

  const scalingItems = {
    "Getting Started": [
      {
        itemId: 'llc-scaling',
        category: 'scaling-your-business',
        title: 'LLC or Business Formation',
        description: 'Placeholder description for LLC or Business Formation.',
        link: '#',
      },
      {
        itemId: 'ein-scaling',
        category: 'scaling-your-business',
        title: 'EIN',
        description: "An EIN is free and protects your identity. It's mandatory for LLCs but just good to have for sole proprietors. But you can start making sales after you have an EIN.",
        link: 'https://sa.www4.irs.gov/applyein/legalStructure',
      },
      {
        itemId: 'bank-account-scaling',
        category: 'scaling-your-business',
        title: 'Business Bank Account',
        description: 'You cannot apply for a business bank account until your entity is fully formed and approved by the state.',
        link: 'https://www.americanexpress.com/en-us/business/checking/?eep=79266&utm_source=go&utm_campaign=bca-br&utm_medium=se&utm_term=american+express+business+account_3495823104_161616706515&utm_content=e&refid=amex_search_bca_go_br_pro|CjwKCAiAraXJBhBJEiwAjz7MZUK2ZMY8X5y-V-oqPQVb9k8TvVB7I3oprUE0cTfjEWkrxef36MOV6RoC1IsQAvD_BwE&gclsrc=aw.ds&gad_source=1&gad_campaignid=18543565565&gbraid=0AAAAADq2FFrtgsc-sNo5arWorXld15YAv&gclid=CjwKCAiAraXJBhBJEiwAjz7MZUK2ZMY8X5y-V-oqPQVb9k8TvVB7I3oprUE0cTfjEWkrxef36MOV6RoC1IsQAvD_BwE',
      },
    ],
    "Profitable": [
      {
        itemId: 'pricing-scaling',
        category: 'scaling-your-business',
        title: 'Product & Service Pricing Completed',
        description: 'Placeholder description for Product & Service Pricing.',
        link: '/dashboard/financial-tools/budget',
      },
      {
        itemId: 'cashflow-scaling',
        category: 'scaling-your-business',
        title: '6-Month Cashflow Budget Completed',
        description: 'Placeholder description for 6-Month Cashflow Budget.',
        link: '/dashboard/financial-tools/budget',
      },
      {
        itemId: 'bookkeeping-scaling',
        category: 'scaling-your-business',
        title: 'Bookkeeping System Set Up',
        description: 'Placeholder description for Bookkeeping System.',
        link: '/dashboard/financial-tools/bookkeeping',
      },
    ],
    "Stability": {
      "Financial Stability": [
        {
          itemId: 'fs-1',
          category: 'scaling-your-business',
          title: 'Separate Business and Personal Finances',
          description: 'Maintain separate bank accounts and credit cards for your business to simplify bookkeeping and protect your personal assets.',
          link: null,
        },
        {
          itemId: 'fs-2',
          category: 'scaling-your-business',
          title: 'Build an Emergency Fund',
          description: 'Set aside 3-6 months of living expenses in a separate savings account to cover unexpected shortfalls.',
          link: null,
        },
      ],
      "Client Stability": [
        {
          itemId: 'cs-1',
          category: 'scaling-your-business',
          title: 'Diversify Your Client Base',
          description: 'Avoid relying on a single client for a significant portion of your income. Aim to have a mix of clients to reduce risk.',
          link: null,
        },
        {
          itemId: 'cs-2',
          category: 'scaling-your-business',
          title: 'Develop a Client Acquisition Strategy',
          description: 'Create a repeatable process for finding and attracting new clients, such as networking, content marketing, or advertising.',
          link: null,
        },
      ],
      "Taxes & Compliance": [
        {
          itemId: 'tc-1',
          category: 'scaling-your-business',
          title: 'Understand Your Tax Obligations',
          description: 'Consult with a tax professional to understand your federal, state, and local tax obligations, including income tax, self-employment tax, and sales tax.',
          link: null,
        },
        {
          itemId: 'tc-2',
          category: 'scaling-your-business',
          title: 'Set Aside Money for Taxes',
          description: 'Regularly set aside a percentage of your income (e.g., 25-30%) to cover your quarterly estimated tax payments.',
          link: null,
        },
      ],
      "Scaling": [
        {
          itemId: 's-1',
          category: 'scaling-your-business',
          title: 'Automate Repetitive Tasks',
          description: 'Use software and tools to automate tasks like invoicing, scheduling, and email marketing to free up your time.',
          link: null,
        },
        {
          itemId: 's-2',
          category: 'scaling-your-business',
          title: 'Delegate or Outsource',
          description: 'Consider hiring contractors or employees to handle tasks that are outside of your expertise or that you don\'t have time for.',
          link: null,
        },
      ]
    }
  };

  const allItems = [
    ...complianceItems,
    ...Object.values(scalingItems["Getting Started"]),
    ...Object.values(scalingItems["Profitable"]),
    ...Object.values(scalingItems["Stability"]["Financial Stability"]),
    ...Object.values(scalingItems["Stability"]["Client Stability"]),
    ...Object.values(scalingItems["Stability"]["Taxes & Compliance"]),
    ...Object.values(scalingItems["Stability"]["Scaling"]),
  ];

  for (const item of allItems) {
    await db.insert(adminChecklistItems).values(item).onConflictDoNothing();
  }
}

main().catch(console.error);
