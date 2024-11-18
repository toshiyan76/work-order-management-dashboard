import { useForm } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      priority: 'medium',
      title: '',
      description: '',
      assignedTo: '',
      location: '',
      dueDate: new Date().toISOString().slice(0, 16)
    }
  });

  const handleSubmit = async (data: Partial<WorkOrder>) => {
    try {
      const formattedData = {
        ...data,
        dueDate: new Date(data.dueDate as string).toISOString()
      };

      console.log('Submitting form data:', formattedData);

      await onSubmit(formattedData);
      form.reset();
      toast({
        title: `クエスト${isEdit ? '更新' : '作成'}`,
        description: `クエストが${isEdit ? '更新' : '作成'}されました。`
      });
    } catch (error) {
      console.error('Form submission error:', error);
      let errorMessage = "クエストの保存に失敗しました。もう一度お試しください。";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          formData: data
        });
      }
      toast({
        title: "エラー",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input {...field} placeholder="クエストタイトル" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="クエストの説明" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ステータス</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">受付中</SelectItem>
                    <SelectItem value="in_progress">進行中</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                    <SelectItem value="cancelled">キャンセル</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>優先度</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="優先度を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="urgent">緊急</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>担当者</FormLabel>
              <FormControl>
                <Input {...field} placeholder="クエスト担当者" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>場所</FormLabel>
              <FormControl>
                <Input {...field} placeholder="クエスト場所" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>期限</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" min={new Date().toISOString().slice(0, 16)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          {isEdit ? 'クエスト更新' : 'クエスト作成'}
        </Button>
      </form>
    </Form>
  );
}
