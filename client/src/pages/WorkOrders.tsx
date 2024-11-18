import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

  const { data: orders = [], error: fetchError, mutate: mutateOrders } = 
    useSWR<WorkOrder[]>(`/api/work-orders${search ? `?search=${search}` : ''}`);

  if (fetchError) {
    console.error('Error fetching work orders:', fetchError);
    toast({
      title: "Error",
      description: "Failed to load quests. Please refresh the page.",
      variant: "destructive"
    });
  }

  const handleCreate = async (data: Partial<WorkOrder>) => {
    try {
      console.log('Creating new quest with data:', data);

      // Optimistic update
      const optimisticQuest = {
        id: Math.random(), // temporary ID
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as WorkOrder;

      await mutateOrders(
        (currentOrders = []) => [optimisticQuest, ...currentOrders],
        false // Don't revalidate immediately
      );

      const response = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create quest');
      }

      const newQuest = await response.json();
      console.log('Quest created successfully:', newQuest);

      // Update both the work orders list and stats with the actual data
      await Promise.all([
        mutateOrders(),
        mutate('/api/stats')
      ]);

      setIsCreateOpen(false);
      toast({
        title: "Success",
        description: "New quest has been posted successfully!"
      });
    } catch (error) {
      console.error('Error creating quest:', error);
      // Revert optimistic update
      await mutateOrders();
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create quest",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (status: 'in_progress' | 'completed') => {
    if (!selectedQuest) return;
    
    const originalQuest = { ...selectedQuest };
    try {
      // Optimistic update
      await mutateOrders(
        currentOrders => currentOrders?.map(order => 
          order.id === selectedQuest.id ? { ...order, status } : order
        ),
        false
      );

      const response = await fetch(`/api/work-orders/${selectedQuest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedQuest, status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update quest status');
      }

      const updatedQuest = await response.json();
      console.log('Quest status updated:', updatedQuest);

      // Update both the work orders list and stats
      await Promise.all([
        mutateOrders(),
        mutate('/api/stats')
      ]);

      toast({
        title: "Success",
        description: `Quest ${status === 'in_progress' ? 'accepted' : 'completed'} successfully`
      });
    } catch (error) {
      console.error('Error updating quest status:', error);
      // Revert optimistic update
      await mutateOrders(currentOrders => 
        currentOrders?.map(order => 
          order.id === selectedQuest.id ? originalQuest : order
        )
      );

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update quest status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight font-game bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          クエストボード
        </h2>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          新規クエスト投稿
        </Button>
      </div>

      <Input
        placeholder="クエストを検索..."
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
              詳細を見るクエストを選択してください
            </div>
          )}
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="font-game">新規クエスト投稿</DialogTitle>
            <DialogDescription>
              クエストボードに新しいクエストを投稿するために、以下の詳細を入力してください。
            </DialogDescription>
          </DialogHeader>
          <WorkOrderForm onSubmit={handleCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}