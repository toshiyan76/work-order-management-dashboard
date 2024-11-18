import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkOrder } from "../lib/types";

interface OrdersChartProps {
  data: WorkOrder[];
}

export default function OrdersChart({ data }: OrdersChartProps) {
  const chartData = [
    { name: 'Pending', value: data.filter(o => o.status === 'pending').length },
    { name: 'In Progress', value: data.filter(o => o.status === 'in_progress').length },
    { name: 'Completed', value: data.filter(o => o.status === 'completed').length },
    { name: 'Cancelled', value: data.filter(o => o.status === 'cancelled').length },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Work Orders Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
