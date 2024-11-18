import useSWR from 'swr';
import StatsCard from '../components/StatsCard';
import OrdersChart from '../components/OrdersChart';
import { WorkOrder } from '../lib/types';

export default function Dashboard() {
  const { data: stats } = useSWR('/api/stats');
  const { data: orders } = useSWR<WorkOrder[]>('/api/work-orders');

  if (!stats || !orders) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <StatsCard stats={stats} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <OrdersChart data={orders} />
      </div>
    </div>
  );
}
