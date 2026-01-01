import { getToken } from '@/services/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = (
    workspaceId: string | undefined,
    eventName: string,
    queryKeyToInvalidate?: any[]
) => {
    const queryClient = useQueryClient();
    const invalidateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!workspaceId) return;

        if (!socket) {
            socket = io(import.meta.env.VITE_APP_URL, {
                path: '/socket.io',
                transports: ['websocket'],
                auth: {
                    token: getToken()
                }
            });
        }

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('join', { workspace_id: workspaceId });

        const handleUpdate = (data: { workspace_id: string }) => {
            if (data.workspace_id === workspaceId) {
                console.log(`${eventName} received via socket`);
                if (queryKeyToInvalidate) {
                    // Debounce invalidation to prevent rapid re-fetches
                    if (invalidateTimeoutRef.current) {
                        clearTimeout(invalidateTimeoutRef.current);
                    }
                    invalidateTimeoutRef.current = setTimeout(() => {
                        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
                        invalidateTimeoutRef.current = null;
                    }, 2000); // 2 second debounce
                }
            }
        };

        socket.on(eventName, handleUpdate);

        return () => {
            socket?.off(eventName, handleUpdate);
            if (invalidateTimeoutRef.current) {
                clearTimeout(invalidateTimeoutRef.current);
            }
        };
    }, [workspaceId, queryClient, eventName, JSON.stringify(queryKeyToInvalidate)]);

    return socket;
};
