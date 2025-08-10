import React, { useEffect, useRef, useState } from 'react';
import { chat } from '~/utils/api.client';

type Message = { role: 'user' | 'assistant'; content: string };

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await chat(text);
      if (res.needsAuth) {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content:
              'Your Shopify store is not connected. Click Install and complete OAuth, then try again.',
          },
        ]);
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: res.message }]);
      }
    } catch (err: any) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error: ' + (err?.message || 'Request failed') }]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="relative flex h-screen w-full bg-gradient-to-br from-[rgba(0,77,255,0.15)] via-[rgba(255,0,162,0.15)] to-[rgba(0,0,0,0.44)]">
      {/* Sidebar */}
      <aside className="w-[106px] bg-white/20 backdrop-blur-xl flex flex-col items-center justify-between py-8 fixed left-0 top-0 h-full">
        <div className="flex flex-col items-center gap-6">
          <img src="/image (4).png" alt="Menu" className="w-10 h-10" />
          <img src="/image (2).png" alt="Home" className="w-6 h-6" />
          <img src="/image (3).png" alt="Refresh" className="w-7 h-7" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <img src="/image.png" alt="Settings" className="w-9 h-9" />
          <img src="/image (1).png" alt="Profile" className="w-12 h-12 rounded-full" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 ml-[106px] flex-col items-center text-center px-4 relative">
        {/* Logo + Title */}
        <div className="mt-16 md:mt-24 flex flex-col items-center">
          <img src="/Untitled58_20250702154321.png" alt="Logo" className="w-28 h-28 md:w-36 md:h-36 mb-6" />
          <h1 className="text-white font-bold text-4xl md:text-6xl">Talk Shopify to Me</h1>
          <p className="text-gray-300 mt-4 text-base md:text-xl max-w-2xl">
            choose a prompt below or write your own to start chatting with OmniAI
          </p>
        </div>

        {/* Suggestion buttons */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <button
            onClick={() => sendMessage('Make my titles more professional?')}
            className="bg-white text-black rounded-2xl px-6 py-3 shadow hover:bg-gray-100"
          >
            Make my titles more professional?
          </button>
          <button
            onClick={() => sendMessage("What's this month’s revenue?")}
            className="bg-white text-black rounded-2xl px-6 py-3 shadow hover:bg-gray-100"
          >
            What's this month’s revenue?
          </button>
        </div>

        {/* Chat area */}
        <div ref={listRef} className="mt-10 mb-40 h-[40vh] w-full max-w-4xl overflow-y-auto space-y-4 px-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-left whitespace-pre-wrap leading-relaxed ${
                  m.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-neutral-900 text-neutral-100 rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-neutral-400 text-sm text-center">Thinking…</div>}
        </div>

        {/* Chat input bar */}
        <div className="sticky bottom-8 left-0 right-0 w-full flex items-center justify-center">
          <div className="flex-1 max-w-4xl bg-[#313130] rounded-full px-6 py-4 flex items-center relative mx-4">
            <input
              type="text"
              placeholder="Ask whatever you want..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-white/60"
            />
            <span className="absolute right-20 text-white/60 text-lg">{input.length}/1000</span>
            <button
              onClick={() => sendMessage(input)}
              disabled={loading}
              className="ml-4 w-14 h-14 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#D408D0] to-[#006CF9]"
              aria-label="Send message"
            >
              <img src="/download-removebg-preview (1).png" alt="Send" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
