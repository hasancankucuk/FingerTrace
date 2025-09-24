import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormattedMessage } from './MessageFormatter';

export const ChatMessage: React.FC<{ message: any }> = ({ message }) => {
  return (
    <div className={cn(
      "flex gap-2 p-2",
      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
    )}>
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
        <AvatarFallback className={cn(
          "text-sm",
          message.role === 'user'
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}>
          {message.role === 'user' ? (
            <User className="h-5 w-5" />
          ) : (
            <Bot className="h-full w-full p-1"/>
          )}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        "max-w-[85%] rounded-lg p-2 break-words",
        message.role === 'user'
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      )}>
        <FormattedMessage content={message.content} />
      </div>
    </div>
  );
};