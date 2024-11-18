export type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkOrder {
  id: number;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignedTo: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
}

export interface Stats {
  pending: number;
  inProgress: number;
  completed: number;
}
