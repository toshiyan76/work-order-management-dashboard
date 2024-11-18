import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkOrder } from "../lib/types";

interface OrdersChartProps {
  data: WorkOrder[];
}

export default function OrdersChart({ data }: OrdersChartProps) {
  const chartData = [
    { name: '受付中', value: data.filter(o => o.status === 'pending').length },
    { name: '進行中', value: data.filter(o => o.status === 'in_progress').length },
    { name: '完了', value: data.filter(o => o.status === 'completed').length },
    { name: 'キャンセル', value: data.filter(o => o.status === 'cancelled').length },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>クエスト概要</CardTitle>
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
