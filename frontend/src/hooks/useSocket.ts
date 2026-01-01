import { getToken } from '@/services/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = (workspaceId?: string) => {
    const queryClient = useQueryClient();

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
                console.log("Analysis update received via socket");
                queryClient.invalidateQueries({ queryKey: ['analysis', workspaceId] });
            }
        };

        socket.on('analysis_update', handleUpdate);

        return () => {
            socket?.off('analysis_update', handleUpdate);
        };
    }, [workspaceId, queryClient]);

    return socket;
};
