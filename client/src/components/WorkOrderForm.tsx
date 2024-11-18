import { useForm } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { workOrderSchema } from "../lib/schema";
import type { WorkOrder } from "../lib/types";
import { useToast } from "@/hooks/use-toast";

interface WorkOrderFormProps {
  onSubmit: (data: Partial<WorkOrder>) => Promise<void>;
  defaultValues?: Partial<WorkOrder>;
  isEdit?: boolean;
}

export default function WorkOrderForm({ onSubmit, defaultValues, isEdit }: WorkOrderFormProps) {
  const { toast } = useToast();
  const form = useForm({
    schema: workOrderSchema,
    defaultValues: defaultValues || {
      status: 'pending',
      priority: 'medium'
    }
  });

  const handleSubmit = async (data: Partial<WorkOrder>) => {
    try {
      await onSubmit(data);
      toast({
        title: `Work Order ${isEdit ? 'Updated' : 'Created'}`,
        description: "The work order has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save work order.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            {...form.register("title")}
            placeholder="Work Order Title"
          />
        </div>
        
        <div>
          <Textarea
            {...form.register("description")}
            placeholder="Description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            {...form.register("status")}
            onValueChange={value => form.setValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            {...form.register("priority")}
            onValueChange={value => form.setValue("priority", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            {...form.register("assignedTo")}
            placeholder="Assigned To"
          />
        </div>

        <div>
          <Input
            {...form.register("location")}
            placeholder="Location"
          />
        </div>

        <div>
          <Input
            {...form.register("dueDate")}
            type="datetime-local"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {isEdit ? 'Update' : 'Create'} Work Order
      </Button>
    </form>
  );
}
