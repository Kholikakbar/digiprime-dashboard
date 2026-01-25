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
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 flex items-center gap-3 text-white shadow-md z-10">
                    <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                        <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-sm tracking-wide">AI Business Assistant</h3>
                        <p className="text-[11px] text-white/80 flex items-center gap-1.5 font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Online & Analyzing
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-6 shadow-inner">
                                <Bot className="h-10 w-10 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg mb-2">Halo! Saya AI Asisten 👋</h4>
                            <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">
                                Saya sudah menganalisis data toko Anda secara real-time. Silakan tanya apa saja tentang performa bisnis Anda!
                            </p>

                            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                                {['Analisis pendapatan bulan ini 💰', 'Bagaimana stok saya? 📦', 'Saran strategi penjualan 🚀'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setInput(suggestion)}
                                        className="px-4 py-2.5 text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-left shadow-sm flex items-center justify-between group"
                                    >
                                        {suggestion}
                                        <Sparkles className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
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
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                                }`}>
                                {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${message.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                                }`}>
                                <div className="whitespace-pre-wrap">
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
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white shrink-0 border-2 border-white shadow-sm">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium ml-1">Sedang menganalisis...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 z-10">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ketik pertanyaan Anda..."
                            disabled={isLoading}
                            className="w-full pl-5 pr-12 py-3.5 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-slate-200 focus:border-blue-400 transition-all disabled:opacity-70 font-medium placeholder:text-slate-400 shadow-sm"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-0 disabled:scale-75 shadow-md active:scale-90"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex justify-center mt-3 gap-4 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                            <Bot className="h-3 w-3" /> Powered by AI
                        </span>
                        <span className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Data Real-time
                        </span>
                    </div>
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
