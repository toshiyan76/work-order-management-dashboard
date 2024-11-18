import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import WorkOrderForm from '../components/WorkOrderForm';
import QuestCard from '../components/QuestCard';
import QuestDetails from '../components/QuestDetails';
import type { WorkOrder } from '../lib/types';
import { useToast } from '@/hooks/use-toast';

export default function WorkOrders() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<WorkOrder | null>(null);
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

  const handleStatusUpdate = async (status: 'in_progress' | 'completed') => {
    if (!selectedQuest) return;
    try {
      await fetch(`/api/work-orders/${selectedQuest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedQuest, status }),
      });
      mutate('/api/work-orders');
      toast({
        title: "Success",
        description: `Quest ${status === 'in_progress' ? 'accepted' : 'completed'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quest status",
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
        <h2 className="text-3xl font-bold tracking-tight font-game bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Quest Board
        </h2>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          Post New Quest
        </Button>
      </div>

      <Input
        placeholder="Search quests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm bg-gray-900/50 border-gray-800"
      />

      <div className="grid grid-cols-10 gap-6 h-[calc(100vh-240px)]">
        <ScrollArea className="col-span-4 pr-4">
          <div className="space-y-4">
            {orders.map((order) => (
              <QuestCard
                key={order.id}
                quest={order}
                isSelected={selectedQuest?.id === order.id}
                onClick={() => setSelectedQuest(order)}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="col-span-6">
          {selectedQuest ? (
            <QuestDetails
              quest={selectedQuest}
              onStatusUpdate={handleStatusUpdate}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a quest to view details
            </div>
          )}
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="font-game">Post New Quest</DialogTitle>
          </DialogHeader>
          <WorkOrderForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}