import React from 'react';
import ComplianceChecklist from './ComplianceChecklist';
import { getSession } from '@/app/login/actions';
import { getAllUserBusinesses } from '@/app/dashboard/businesses/actions';
import { getAdminChecklistItems } from '@/app/dashboard/admin/agency-setup/checklist-management/actions';

export default async function BusinessCompliancePage() {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-foreground">Business Compliance</h1>
        <p className="mt-4 text-muted-foreground">
          Please log in to view your business compliance checklist.
        </p>
      </div>
    );
  }

  const businesses = await getAllUserBusinesses(userId);
  const checklistItems = await getAdminChecklistItems('business-compliance');

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground">Business Compliance</h1>
      <ComplianceChecklist businesses={businesses} checklistItems={checklistItems} />
    </div>
  );
}
