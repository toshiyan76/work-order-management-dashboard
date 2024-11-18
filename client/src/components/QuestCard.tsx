import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sword, Shield, Zap, Flame } from "lucide-react";
import type { WorkOrder } from "../lib/types";
import { cn } from "@/lib/utils";

const difficultyIcons = {
  low: Shield,
  medium: Sword,
  high: Zap,
  urgent: Flame,
};

interface QuestCardProps {
  quest: WorkOrder;
  isSelected: boolean;
  onClick: () => void;
}

export default function QuestCard({ quest, isSelected, onClick }: QuestCardProps) {
  const DifficultyIcon = difficultyIcons[quest.priority];
  
  return (
    <Card
      className={cn(
        "p-4 mb-4 cursor-pointer border-2 transition-all duration-200 bg-gray-900/50 hover:bg-gray-800/50",
        isSelected ? "border-primary shadow-lg shadow-primary/20" : "border-gray-800 hover:border-gray-700"
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={cn(
          "p-2 rounded-lg",
          quest.priority === 'urgent' ? "bg-red-500/20" :
          quest.priority === 'high' ? "bg-orange-500/20" :
          quest.priority === 'medium' ? "bg-yellow-500/20" :
          "bg-green-500/20"
        )}>
          <DifficultyIcon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1 font-game">{quest.title}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs",
              quest.status === 'pending' ? "bg-yellow-500/20 text-yellow-200" :
              quest.status === 'in_progress' ? "bg-blue-500/20 text-blue-200" :
              quest.status === 'completed' ? "bg-green-500/20 text-green-200" :
              "bg-red-500/20 text-red-200"
            )}>
              {quest.status.toUpperCase()}
            </span>
            <span className="text-sm text-gray-400">Location: {quest.location}</span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{quest.description}</p>
        </div>
      </div>
    </Card>
  );
}
