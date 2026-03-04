'use client'
import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

function getDisplayName() {
    if (typeof window === 'undefined') return 'Guest'
    try {
        const stored = localStorage.getItem('user')
        if (stored) {
            const user = JSON.parse(stored)
            if (user.firstName) return user.firstName
        }
    } catch {}
    const key = 'chat_guest_name'
    let name = sessionStorage.getItem(key)
    if (!name) {
        name = `Guest#${Math.floor(Math.random() * 9000) + 1000}`
        sessionStorage.setItem(key, name)
    }
    return name
}

export function useChat() {
    const [messages, setMessages] = useState([])
    const [connected, setConnected] = useState(false)
    const socketRef = useRef(null)
    const displayName = useRef(getDisplayName())

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/chat`, {
            auth: { displayName: displayName.current }
        })
        socketRef.current = socket

        socket.on('connect', () => setConnected(true))
        socket.on('disconnect', () => setConnected(false))
        socket.on('chat-history', (history) => setMessages(history))
        socket.on('chat-message', (msg) =>
            setMessages(prev => [...prev, msg])
        )

        return () => socket.disconnect()
    }, [])

    const sendMessage = (text) => {
        if (socketRef.current?.connected && text.trim()) {
            socketRef.current.emit('chat-send', { text })
        }
    }

    return { messages, connected, sendMessage, displayName: displayName.current }
}
