'use client'
import { useState, useRef, useEffect } from 'react'
import {
    Dialog, Portal, VStack, HStack, Box, Input, IconButton,
    Text, Badge, CloseButton
} from '@chakra-ui/react'
import { Send, MessageCircle } from 'lucide-react'
import { useChat } from '../hooks/useChat'

export function ChatModal({ open, onClose }) {
    const { messages, connected, sendMessage, displayName } = useChat()
    const [input, setInput] = useState('')
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return
        sendMessage(input)
        setInput('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} lazyMount>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxH="80vh" w="full" maxW="md" display="flex" flexDir="column">
                        <Dialog.Header>
                            <HStack>
                                <MessageCircle size={18} />
                                <Dialog.Title>Community Chat</Dialog.Title>
                                <Badge
                                    size="sm"
                                    colorPalette={connected ? 'green' : 'red'}
                                    ml="auto"
                                >
                                    {connected ? 'Live' : 'Connecting...'}
                                </Badge>
                            </HStack>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={onClose} />
                        </Dialog.CloseTrigger>

                        <Dialog.Body flex="1" overflowY="auto" py={3}>
                            <VStack align="stretch" gap={2}>
                                {messages.length === 0 && (
                                    <Text fontSize="sm" color="gray.400" textAlign="center" mt={8}>
                                        No messages yet. Say hello!
                                    </Text>
                                )}
                                {messages.map((msg) => {
                                    const isSelf = msg.displayName === displayName
                                    return (
                                        <Box
                                            key={msg.id}
                                            alignSelf={isSelf ? 'flex-end' : 'flex-start'}
                                            maxW="80%"
                                        >
                                            {!isSelf && (
                                                <Text fontSize="xs" color="gray.500" mb={0.5}>
                                                    {msg.displayName}
                                                </Text>
                                            )}
                                            <Box
                                                bg={isSelf ? 'blue.500' : 'gray.100'}
                                                color={isSelf ? 'white' : 'gray.800'}
                                                px={3}
                                                py={2}
                                                borderRadius="lg"
                                                borderBottomRightRadius={isSelf ? 'sm' : 'lg'}
                                                borderBottomLeftRadius={isSelf ? 'lg' : 'sm'}
                                            >
                                                <Text fontSize="sm">{msg.text}</Text>
                                            </Box>
                                        </Box>
                                    )
                                })}
                                <div ref={bottomRef} />
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer borderTopWidth="1px" pt={3}>
                            <HStack w="full">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    flex="1"
                                    size="sm"
                                />
                                <IconButton
                                    aria-label="Send"
                                    size="sm"
                                    colorPalette="blue"
                                    onClick={handleSend}
                                    disabled={!input.trim() || !connected}
                                >
                                    <Send size={16} />
                                </IconButton>
                            </HStack>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
