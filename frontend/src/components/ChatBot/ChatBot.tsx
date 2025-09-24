import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  X,
  Bot,
  User,
  Loader2,
  Minimize2
} from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

const ChatMessage: React.FC<{ message: any }> = ({ message }) => {
  return (
    <div className={cn(
      "flex gap-3 p-3",
      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
    )}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={cn(
          "text-xs",
          message.role === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        )}>
          {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
        message.role === 'user' 
          ? 'bg-primary text-primary-foreground ml-2' 
          : 'bg-muted text-foreground mr-2'
      )}>
        {message.isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Typing...</span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
};

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className="border-t bg-background p-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="sm"
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export const ChatBot: React.FC = () => {
  const { isOpen, setIsOpen, currentSession, createNewSession } = useChatStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [currentSession?.messages]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!currentSession) {
      createNewSession();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={handleOpen}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 shadow-xl z-50 flex flex-col border">
      {/* Header */}
      <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-foreground text-primary">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm">Tracey</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleMinimize}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Chat Area */}
      {!isMinimized && (
        <div className="flex flex-col h-96">
          <CardContent className="flex-1 p-0 overflow-hidden">
            {currentSession ? (
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                {currentSession.messages.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium text-foreground mb-1">Hello! 👋</div>
                    <div className="text-xs text-muted-foreground">
                      I'm Tracey, your AI assistant. How can I help you today?
                    </div>
                  </div>
                ) : (
                  <div>
                    {currentSession.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                  </div>
                )}
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full p-4">
                <Button onClick={createNewSession} variant="outline">
                  Start Conversation
                </Button>
              </div>
            )}
          </CardContent>
          <ChatInput />
        </div>
      )}
      
      {/* Minimized state */}
      {isMinimized && (
        <div className="p-4 text-center cursor-pointer" onClick={handleMinimize}>
          <div className="text-sm text-muted-foreground">Chat minimized</div>
          <div className="text-xs text-muted-foreground/70">Click to expand</div>
        </div>
      )}
    </Card>
  );
};