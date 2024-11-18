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
        "p-4 mb-4 cursor-pointer transition-all duration-200 paper-texture decorative-border",
        isSelected 
          ? "border-primary/50 shadow-scroll bg-card/80" 
          : "border-border/50 hover:border-primary/30 bg-card/50",
        "transform hover:-translate-y-0.5 hover:shadow-quest"
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={cn(
          "p-2 rounded-lg bg-gradient-to-br",
          quest.priority === 'urgent' ? "from-red-500/20 to-red-700/20 text-red-400" :
          quest.priority === 'high' ? "from-orange-500/20 to-orange-700/20 text-orange-400" :
          quest.priority === 'medium' ? "from-yellow-500/20 to-yellow-700/20 text-yellow-400" :
          "from-green-500/20 to-green-700/20 text-green-400"
        )}>
          <DifficultyIcon className="w-6 h-6 drop-shadow" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1 font-game bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {quest.title}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              quest.status === 'pending' ? "bg-yellow-500/20 text-yellow-200" :
              quest.status === 'in_progress' ? "bg-blue-500/20 text-blue-200" :
              quest.status === 'completed' ? "bg-green-500/20 text-green-200" :
              "bg-red-500/20 text-red-200"
            )}>
              {quest.status === 'pending' ? '受付中' :
               quest.status === 'in_progress' ? '進行中' :
               quest.status === 'completed' ? '完了' :
               'キャンセル'}
            </span>
            <span className="text-sm text-muted-foreground">場所: {quest.location}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{quest.description}</p>
        </div>
      </div>
    </Card>
  );
}
