import { useState, useRef, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { useUser } from '~/hooks/useUser';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface APIResponse {
  success?: boolean;
  result?: {
    message: string;
  };
  error?: string;
}

interface ChatbotProps {
  initialCommand?: string | null;
}

export default function Chatbot({ initialCommand }: ChatbotProps) {
  const user = useUser();
  const fetcher = useFetcher<APIResponse>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialCommand || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const promptSuggestions = [
    'Make my titles more professional?',
    "What's this month's revenue?",
    'Update my inventory levels',
    'Optimize my product descriptions',
  ];

  const handleSubmit = async (commandText?: string) => {
    const command = commandText || input.trim();
    if (!command || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: command,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Submit to API
    const formData = new FormData();
    formData.append('command', command);
    formData.append('tier', user.tier.toString());
    formData.append('shop', user.shopId || '');

    fetcher.submit(formData, {
      method: 'POST',
      action: '/api/chat',
    });
  };

  const handlePromptClick = (prompt: string) => {
    handleSubmit(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

    // Handle fetcher response
  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
      setIsProcessing(false);
      
      if (fetcher.data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: fetcher.data.result?.message || 'Command executed successfully',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: fetcher.data.error || 'Command failed',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  }, [fetcher.data, fetcher.state]);

  // Auto-execute initial command if provided
  useEffect(() => {
    if (initialCommand && initialCommand.trim() && messages.length === 0) {
      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        handleSubmit(initialCommand);
      }, 500);
    }
  }, [initialCommand]);

  return (
    <div className="omniai-chat">
      <style>{`
        .omniai-chat {
          display: flex;
          height: 100vh;
          font-family: 'Poppins', sans-serif;
        }
        
        .chat-sidebar {
          width: 60px;
          background: #f9f9f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 0;
          border-right: 1px solid #eee;
        }
        
        .chat-logo {
          margin-bottom: 1rem;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.2rem;
        }
        
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #fcd8ff, #d0e5ff);
          min-height: 100vh;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          max-height: calc(100vh - 200px);
        }
        
        .chat-message {
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .chat-message.user {
          justify-content: flex-end;
        }
        
        .chat-message.assistant {
          justify-content: flex-start;
        }
        
        .message-content {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          line-height: 1.5;
        }
        
        .chat-message.user .message-content {
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          color: white;
          border-bottom-right-radius: 0.25rem;
        }
        
        .chat-message.assistant .message-content {
          background: white;
          color: #333;
          border-bottom-left-radius: 0.25rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .chat-welcome {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          text-align: center;
        }
        
        .hero-text {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #222;
        }
        
        .hero-subtext {
          font-size: 1rem;
          color: #555;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        
        .prompt-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .prompt-buttons button {
          padding: 0.75rem 1.25rem;
          border-radius: 999px;
          border: none;
          background: #fff;
          box-shadow: 0 0 0 1px #ddd;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease-in-out;
          font-family: 'Poppins', sans-serif;
        }
        
        .prompt-buttons button:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .chat-input-container {
          padding: 1rem;
          background: transparent;
        }
        
        .chat-input-wrapper {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 999px;
          padding: 0.75rem 1rem;
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          box-shadow: 0 0 0 2px #d77cf0;
          position: relative;
        }
        
        .chat-input-wrapper input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          background: transparent;
        }
        
        .chat-input-wrapper input::placeholder {
          color: #999;
        }
        
        .chat-input-wrapper button {
          background: linear-gradient(135deg, #d77cf0, #7aa2ff);
          border: none;
          padding: 0.5rem 1rem;
          color: white;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
          margin-left: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          min-width: 40px;
          height: 40px;
        }
        
        .chat-input-wrapper button:hover:not(:disabled) {
          background: linear-gradient(135deg, #c357e6, #6499ff);
        }
        
        .chat-input-wrapper button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .char-count {
          font-size: 0.8rem;
          color: #999;
          margin-left: 0.5rem;
          position: absolute;
          right: 60px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .processing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border-radius: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 200px;
        }
        
        .processing-dots {
          display: flex;
          gap: 0.25rem;
        }
        
        .processing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d77cf0;
          animation: pulse 1.5s infinite;
        }
        
        .processing-dot:nth-child(2) {
          animation-delay: 0.3s;
        }
        
        .processing-dot:nth-child(3) {
          animation-delay: 0.6s;
        }
        
        @keyframes pulse {
          0%, 60%, 100% {
            opacity: 0.3;
          }
          30% {
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .chat-sidebar {
            width: 50px;
          }
          
          .hero-text {
            font-size: 1.5rem;
          }
          
          .prompt-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .prompt-buttons button {
            width: 100%;
            max-width: 300px;
          }
          
          .message-content {
            max-width: 85%;
          }
        }
      `}</style>

      <div className="chat-sidebar">
        <div className="chat-logo">
          AI
        </div>
      </div>

      <div className="chat-main">
        {messages.length === 0 ? (
          <div className="chat-welcome">
                         <div className="hero-text">Talk Shopify to Me</div>
             <div className="hero-subtext">
               choose a prompt below or write your own to start chatting with OmniAI
             </div>
            <div className="prompt-buttons">
              {promptSuggestions.slice(0, 2).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isProcessing}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.type}`}>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="chat-message assistant">
                <div className="processing-indicator">
                                     <span>Processing...</span>
                  <div className="processing-dots">
                    <div className="processing-dot"></div>
                    <div className="processing-dot"></div>
                    <div className="processing-dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
                             placeholder="Ask whatever you want..."
               maxLength={1000}
               disabled={isProcessing}
             />
             <span className="char-count">{input.length}/1000</span>
             <button
               onClick={() => handleSubmit()}
               disabled={!input.trim() || isProcessing}
               aria-label="Execute"
            >
              <svg 
                width="20" 
                height="20" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                viewBox="0 0 24 24"
              >
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 