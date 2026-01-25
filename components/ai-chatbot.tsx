'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Minus, Maximize2 } from 'lucide-react'

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

    const sendMessage = async (text?: string) => {
        const messageToSend = text || input.trim()
        if (!messageToSend || isLoading) return

        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: messageToSend }])
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: messageToSend }]
                })
            })

            const data = await response.json()

            if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${data.error}` }])
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: '❌ Gagal terhubung ke server. Coba lagi nanti.' }])
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
        <div className="fixed bottom-24 right-6 z-[9999] w-[360px] max-w-[calc(100vw-32px)] animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom-right">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[550px] max-h-[80vh]">

                {/* 1. COMPACT HEADER */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between shadow-sm shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-indigo-600"></span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm leading-tight">DigiPrime AI</h3>
                            <p className="text-[11px] text-white/80 font-medium">Business Assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* 2. CHAT AREA */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
                    {/* Welcome Screen */}
                    {messages.length === 0 && (
                        <div className="mt-4 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                                <Bot className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg">Halo, Bos! 👋</h3>
                            <p className="text-sm text-slate-500 mt-2 max-w-[240px] leading-relaxed">
                                Saya siap membantu menganalisis performa toko Anda hari ini.
                            </p>

                            <div className="grid grid-cols-1 gap-2 mt-8 w-full">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left pl-1 mb-1">Coba tanyakan:</p>
                                {[
                                    { text: 'Analisis pendapatan 💰', prompt: 'Berikan analisis pendapatan total saya' },
                                    { text: 'Cek stok menipis 📉', prompt: 'Apakah ada stok yang menipis?' },
                                    { text: 'Strategi marketing 🚀', prompt: 'Berikan saran strategi marketing' }
                                ].map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => sendMessage(item.prompt)}
                                        className="text-left px-4 py-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-sm text-slate-600 hover:text-indigo-700 transition-all shadow-sm active:scale-[0.98]"
                                    >
                                        {item.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chat Messages */}
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                                    <Bot className="h-3.5 w-3.5 text-indigo-600" />
                                </div>
                            )}

                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-sm'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                                }`}>
                                <div className="leading-relaxed whitespace-pre-wrap">
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
                        <div className="flex gap-2.5">
                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                                <Bot className="h-3.5 w-3.5 text-indigo-600" />
                            </div>
                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* 3. INPUT AREA */}
                <div className="p-3 bg-white border-t border-slate-100">
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pesan..."
                            className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                            <Sparkles className="h-2 w-2" /> AI Powered by DigiPrime
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ) : null

    const floatingButton = (
        <button
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-[9997] h-14 w-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        >
            <MessageCircle className="h-7 w-7" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
    )

    return (
        <>
            {!isOpen && createPortal(floatingButton, document.body)}
            {chatWindow && createPortal(chatWindow, document.body)}
        </>
    )
}
