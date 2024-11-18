import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, User } from "lucide-react";
import type { WorkOrder } from "../lib/types";

interface QuestDetailsProps {
  quest: WorkOrder;
  onStatusUpdate: (status: 'in_progress' | 'completed') => void;
}

export default function QuestDetails({ quest, onStatusUpdate }: QuestDetailsProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '受付中';
      case 'in_progress': return '進行中';
      case 'completed': return '完了';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      case 'urgent': return '緊急';
      default: return priority;
    }
  };

  return (
    <div className="p-6 bg-gray-900/50 rounded-lg border-2 border-gray-800 h-full">
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h2 className="text-3xl font-bold font-game bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          {quest.title}
        </h2>
        <div className="flex items-center space-x-4 mt-2 text-gray-400">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(quest.dueDate).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {quest.location}
          </span>
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {quest.assignedTo}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-2 font-game">クエスト詳細</h3>
          <p className="text-gray-300">{quest.description}</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2 font-game">要件</h3>
          <Card className="p-4 bg-gray-800/50">
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>優先度: {getPriorityLabel(quest.priority)}</li>
              <li>現在のステータス: {getStatusLabel(quest.status)}</li>
              <li>期限: {new Date(quest.dueDate).toLocaleString()}</li>
            </ul>
          </Card>
        </div>

        <div className="flex space-x-4 pt-4 border-t-2 border-gray-800">
          {quest.status === 'pending' && (
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => onStatusUpdate('in_progress')}
            >
              クエスト受注
            </Button>
          )}
          {quest.status === 'in_progress' && (
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => onStatusUpdate('completed')}
            >
              クエスト完了
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
