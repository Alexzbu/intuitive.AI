// In-memory room state for whiteboard collaboration
const rooms = {}

function getOrCreateRoom(roomId) {
    if (!rooms[roomId]) {
        rooms[roomId] = {
            hostId: null,
            elements: [],
            permissions: new Set(),  // userIds allowed to draw (besides host)
            users: new Map()         // socketId → { userId, firstName, role }
        }
    }
    return rooms[roomId]
}

function serializeRoom(room) {
    return {
        elements: room.elements,
        permissions: [...room.permissions],
        users: [...room.users.values()]
    }
}

export function initWhiteboardCollab(io) {
    io.on('connection', (socket) => {
        const { userId, position, firstName } = socket.handshake.auth
        let currentRoomId = null

        socket.on('join-room', (roomId) => {
            if (currentRoomId) {
                socket.leave(currentRoomId)
                const prevRoom = rooms[currentRoomId]
                if (prevRoom) {
                    prevRoom.users.delete(socket.id)
                    io.to(currentRoomId).emit('users-updated', [...prevRoom.users.values()])
                }
            }

            currentRoomId = roomId
            socket.join(roomId)

            const room = getOrCreateRoom(roomId)
            const role = position === 'trainer' ? 'host' : 'viewer'

            if (role === 'host' && !room.hostId) {
                room.hostId = userId
            }

            room.users.set(socket.id, { userId, firstName, role })

            // Send current room state to the joining user
            socket.emit('room-state', {
                elements: room.elements,
                role,
                permissions: [...room.permissions],
                users: [...room.users.values()]
            })

            // Broadcast updated user list to everyone in the room
            io.to(roomId).emit('users-updated', [...room.users.values()])
        })

        socket.on('whiteboard-update', ({ roomId, elements }) => {
            const room = rooms[roomId]
            if (!room) return

            const user = room.users.get(socket.id)
            if (!user) return

            // Only host or permitted users can update the whiteboard
            if (user.role !== 'host' && !room.permissions.has(user.userId)) return

            room.elements = elements
            // Broadcast to everyone else in the room
            socket.to(roomId).emit('whiteboard-update', elements)
        })

        socket.on('grant-permission', ({ roomId, targetUserId }) => {
            const room = rooms[roomId]
            if (!room) return

            const user = room.users.get(socket.id)
            if (user?.role !== 'host') return

            room.permissions.add(targetUserId)
            io.to(roomId).emit('permission-updated', { userId: targetUserId, canDraw: true })
        })

        socket.on('revoke-permission', ({ roomId, targetUserId }) => {
            const room = rooms[roomId]
            if (!room) return

            const user = room.users.get(socket.id)
            if (user?.role !== 'host') return

            room.permissions.delete(targetUserId)
            io.to(roomId).emit('permission-updated', { userId: targetUserId, canDraw: false })
        })

        socket.on('disconnect', () => {
            if (!currentRoomId) return
            const room = rooms[currentRoomId]
            if (!room) return

            room.users.delete(socket.id)
            io.to(currentRoomId).emit('users-updated', [...room.users.values()])

            // Clean up empty rooms
            if (room.users.size === 0) {
                delete rooms[currentRoomId]
            }
        })
    })
}
