import { create } from 'zustand';
import type { ChatMessage, ChatSession } from '@/types/chat';
import { geminiService } from '@/services/geminiService';

interface ChatStore {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  isOpen: boolean;
  
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  createNewSession: () => void;
  sendMessage: (content: string) => Promise<void>;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearCurrentSession: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  currentSession: null,
  sessions: [],
  isLoading: false,
  isOpen: false,

  setIsOpen: (isOpen: boolean) => set({ isOpen }),

  createNewSession: () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      currentSession: newSession,
      sessions: [newSession, ...state.sessions],
    }));
  },

  sendMessage: async (content: string) => {
    const { currentSession } = get();
    
    if (!currentSession) {
      get().createNewSession();
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    // Add user message and loading message
    set((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        messages: [...state.currentSession.messages, userMessage, loadingMessage],
        title: state.currentSession.messages.length === 0 ? content.slice(0, 30) + '...' : state.currentSession.title,
        updatedAt: new Date(),
      } : null,
      isLoading: true,
    }));

    try {
      const response = await geminiService.generateResponse(content);
      
      // Replace loading message with actual response
      set((state) => ({
        currentSession: state.currentSession ? {
          ...state.currentSession,
          messages: state.currentSession.messages.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, content: response, isLoading: false }
              : msg
          ),
          updatedAt: new Date(),
        } : null,
        isLoading: false,
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Replace loading message with error message
      set((state) => ({
        currentSession: state.currentSession ? {
          ...state.currentSession,
          messages: state.currentSession.messages.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, content: 'Sorry, I encountered an error. Please try again.', isLoading: false }
              : msg
          ),
          updatedAt: new Date(),
        } : null,
        isLoading: false,
      }));
    }
  },

  loadSession: (sessionId: string) => {
    const { sessions } = get();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      set({ currentSession: session });
    }
  },

  deleteSession: (sessionId: string) => {
    set((state) => ({
      sessions: state.sessions.filter(s => s.id !== sessionId),
      currentSession: state.currentSession?.id === sessionId ? null : state.currentSession,
    }));
  },

  clearCurrentSession: () => {
    set({ currentSession: null });
  },
}));