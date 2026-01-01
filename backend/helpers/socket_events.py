from flask import request
from flask_socketio import join_room
from socket_extensions import socketio

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on('join')
def handle_join(data):
    workspace_id = data.get('workspace_id')
    if workspace_id:
        room = f"workspace_{workspace_id}"
        join_room(room)
        print(f"Client {request.sid} joined room {room}")
