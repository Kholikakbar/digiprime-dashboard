'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, RefreshCw } from 'lucide-react'

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
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isOpen])

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
        <div className="fixed bottom-24 right-6 z-[9999] w-[380px] max-w-[calc(100vw-48px)] animate-in slide-in-from-bottom-5 fade-in duration-300 transform transition-all">
            <div className="bg-white rounded-[24px] shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col h-[600px] max-h-[80vh] relative">

                {/* 1. HEADER SECTION (FIXED AT TOP) */}
                <div className="bg-slate-900 p-4 flex items-center gap-3 text-white shadow-md z-20 shrink-0 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative z-10">
                        <Bot className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1 relative z-10">
                        <h3 className="font-bold text-sm tracking-wide text-white">AI Business Assistant</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[11px] text-slate-300 font-medium">Online</span>
                        </div>
                    </div>

                    {/* CLOSE BUTTON - HIGHLY VISIBLE */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 group active:scale-95"
                        aria-label="Close chat"
                    >
                        <X className="h-5 w-5 text-white/90 group-hover:text-white" />
                    </button>
                </div>

                {/* 2. MESSAGES AREA (SCROLLABLE) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50 scroll-smooth">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 ring-4 ring-slate-100">
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <Bot className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg mb-2">Halo, Boss! 👋</h4>
                            <p className="text-sm text-slate-500 max-w-[260px] leading-relaxed mb-8">
                                Saya siap menganalisis data toko Anda. Ada yang bisa saya bantu cek hari ini?
                            </p>

                            <div className="grid gap-2.5 w-full">
                                {['💰 Cek pendapatan bulan ini', '📦 Bagaimana stok saya?', '📈 Saran strategi penjualan'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setInput(suggestion)}
                                        className="group px-4 py-3 text-sm font-medium bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-left shadow-sm flex items-center justify-between active:scale-[0.98]"
                                    >
                                        {suggestion}
                                        <Sparkles className="h-3.5 w-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110" />
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
                            {/* Avatar */}
                            {message.role === 'assistant' && (
                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-1">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                            )}

                            {/* Bubble */}
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${message.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                }`}>
                                <div className="whitespace-pre-wrap">
                                    {message.content.split('\n').map((line, i) => (
                                        <div key={i} className="min-h-[1em]">
                                            {line.startsWith('**') && line.endsWith('**')
                                                ? <strong className="font-bold">{line.slice(2, -2)}</strong>
                                                : line}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-1">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* 3. INPUT AREA (FIXED AT BOTTOM) */}
                <div className="p-4 bg-white border-t border-slate-100 z-20">
                    <div className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ketik pesan..."
                                disabled={isLoading}
                                className="w-full pl-4 pr-4 py-3 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent focus:border-blue-300 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="h-[46px] w-[46px] flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95"
                        >
                            <Send className="h-5 w-5 ml-0.5" />
                        </button>
                    </div>
                    <div className="flex justify-center mt-2">
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            Powered by DigiPrime AI <Sparkles className="h-2.5 w-2.5" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    ) : null

    const floatingButton = (
        <button
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-[9997] h-14 w-14 bg-slate-900 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
    )

    return (
        <>
            {!isOpen && createPortal(floatingButton, document.body)}
            {chatWindow && createPortal(chatWindow, document.body)}
        </>
    )
}
