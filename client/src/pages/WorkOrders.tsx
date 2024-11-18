import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import WorkOrderForm from '../components/WorkOrderForm';
import type { WorkOrder } from '../lib/types';
import { useToast } from '@/hooks/use-toast';

export default function WorkOrders() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const { data: orders } = useSWR<WorkOrder[]>(`/api/work-orders${search ? `?search=${search}` : ''}`);

  const handleCreate = async (data: Partial<WorkOrder>) => {
    try {
      await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      mutate('/api/work-orders');
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create work order",
        variant: "destructive"
      });
    }
  };

  const handleUpdate = async (data: Partial<WorkOrder>) => {
    if (!editingOrder) return;
    try {
      await fetch(`/api/work-orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      mutate('/api/work-orders');
      setIsEditOpen(false);
      setEditingOrder(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update work order",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/work-orders/${id}`, { method: 'DELETE' });
      mutate('/api/work-orders');
      toast({
        title: "Success",
        description: "Work order deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete work order",
        variant: "destructive"
      });
    }
  };

  if (!orders) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Work Orders</h2>
        <Button onClick={() => setIsCreateOpen(true)}>Create New</Button>
      </div>

      <Input
        placeholder="Search work orders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.title}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.priority}</TableCell>
              <TableCell>{order.assignedTo}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setEditingOrder(order);
                    setIsEditOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(order.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Work Order</DialogTitle>
          </DialogHeader>
          <WorkOrderForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Work Order</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <WorkOrderForm
              onSubmit={handleUpdate}
              defaultValues={editingOrder}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
