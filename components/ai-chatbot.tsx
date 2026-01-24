'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }]
                })
            })

            const data = await response.json()

            if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${data.error}` }])
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: '❌ Gagal terhubung ke server. Coba lagi.' }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    if (!mounted) return null

    const chatWindow = isOpen ? (
        <div className="fixed bottom-24 right-6 z-[9998] w-[380px] max-w-[calc(100vw-48px)] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col" style={{ height: '550px' }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 flex items-center gap-3 text-white">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-sm">AI Business Assistant</h3>
                        <p className="text-xs text-white/70 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Analisis toko real-time
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.length === 0 && (
                        <div className="text-center py-8">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                                <Bot className="h-8 w-8 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1">Halo! Saya AI Asisten 👋</h4>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                Saya sudah menganalisis data toko Anda. Tanya apa saja tentang bisnis!
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                {['Analisis pendapatan', 'Status stok', 'Saran strategi'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => {
                                            setInput(suggestion)
                                        }}
                                        className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                                }`}>
                                {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-md'
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-md shadow-sm'
                                }`}>
                                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {message.content.split('\n').map((line, i) => (
                                        <span key={i}>
                                            {line.startsWith('**') && line.endsWith('**')
                                                ? <strong>{line.slice(2, -2)}</strong>
                                                : line}
                                            {i < message.content.split('\n').length - 1 && <br />}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shrink-0">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Sedang menganalisis...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-100 bg-white">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Tanya tentang bisnis Anda..."
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent focus:border-blue-300 transition-all disabled:opacity-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center mt-2">
                        AI menganalisis data toko Anda secara real-time
                    </p>
                </div>
            </div>
        </div>
    ) : null

    const floatingButton = (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9997] h-14 w-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
    )

    return (
        <>
            {!isOpen && createPortal(floatingButton, document.body)}
            {chatWindow && createPortal(chatWindow, document.body)}
        </>
    )
}
