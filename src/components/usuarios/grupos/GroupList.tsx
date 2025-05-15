
import React from 'react';
import { UserGroup } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupListProps {
  groups: UserGroup[];
  selectedGroupId?: string;
  onSelectGroup: (group: UserGroup) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groups, selectedGroupId, onSelectGroup }) => {
  if (groups.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum grupo encontrado
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-400px)]">
      <div className="space-y-2">
        {groups.map((group) => (
          <Button
            key={group.id}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left px-2 py-3 h-auto",
              selectedGroupId === group.id && "bg-primary/10"
            )}
            onClick={() => onSelectGroup(group)}
          >
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">{group.name}</div>
                <div className="text-xs text-muted-foreground">
                  {group.description}
                </div>
                <div className="flex items-center mt-1">
                  <Shield className="h-3 w-3 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">
                    {group.permissions.length} permissões
                  </span>
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default GroupList;
