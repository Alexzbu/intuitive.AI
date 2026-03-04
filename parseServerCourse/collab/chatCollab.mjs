const CHAT_ROOM = 'global-chat'
const chatMessages = []
const MAX_MESSAGES = 50

export function initChatCollab(io) {
    const chatNamespace = io.of('/chat')

    chatNamespace.on('connection', (socket) => {
        const { displayName } = socket.handshake.auth

        socket.join(CHAT_ROOM)
        socket.emit('chat-history', chatMessages)

        socket.on('chat-send', ({ text }) => {
            if (!text?.trim()) return
            const msg = {
                id: Date.now() + Math.random(),
                displayName: displayName || 'Guest',
                text: text.trim(),
                timestamp: new Date().toISOString()
            }
            chatMessages.push(msg)
            if (chatMessages.length > MAX_MESSAGES) chatMessages.shift()
            chatNamespace.to(CHAT_ROOM).emit('chat-message', msg)
        })
    })
}
