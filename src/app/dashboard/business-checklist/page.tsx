import { getChecklistItems } from './actions';
import ChecklistClientPage from './ChecklistClientPage';

export default async function BusinessChecklistPage() {
  const initialItems = await getChecklistItems();

  return <ChecklistClientPage initialItems={initialItems} />;
}
