import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { api } from '../../../services/api';
import type { Message, SourceKnowledge } from '../../../types';

export function AssistantView() {
  const { chatHistory, addMessage, clearChat } = useAppStore();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentSources, setCurrentSources] = useState<SourceKnowledge | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;
    
    const userQuery = input;
    const userMsg: Message = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content: userQuery,
      timestamp: new Date(),
    };
    
    addMessage(userMsg);
    setInput('');
    setIsThinking(true);

    try {
      const data = await api.ask(userQuery);
      
      const sources: SourceKnowledge = {
        cypherQuery: Array.isArray(data.graph_query) 
          ? data.graph_query.map((q: any) => (q && typeof q === 'object') ? q.query : q).join('\n')
          : (data.graph_query?.query || data.graph_query || 'No graph query executed'),
        vectorSnippets: (data.retrieved_context || []).map((text: string, i: number) => ({
          id: `DOC-${i+1}`,
          text,
          relevance: 0.95 - (i * 0.05), // Synthetic relevance for UI display
          drug: userQuery.split(' ')[0] // Approximate drug context
        }))
      };

      setCurrentSources(sources);

      const assistantMsg: Message = {
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        sources,
      };
      
      addMessage(assistantMsg);
    } catch (error) {
      console.error(error);
      addMessage({
        id: Math.random().toString(36).slice(2),
        role: 'assistant',
        content: "I'm sorry, I encountered an error connecting to the clinical knowledge base.",
        timestamp: new Date(),
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{ height: '100%', display: 'flex', overflow: 'hidden' }}
    >
      <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--accent-dim)' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--accent-dim)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.16em', marginBottom: 2 }}>
              ⬡ CLINICAL ASSISTANT
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-secondary)' }}>
              RAG-augmented drug knowledge interface
            </div>
          </div>
          <button
            onClick={clearChat}
            style={{
              background: 'none',
              border: '1px solid var(--accent-dim)',
              borderRadius: 3,
              padding: '4px 10px',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: 9,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
            }}
          >
            CLEAR
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {chatHistory.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--accent-bio)', letterSpacing: '0.08em', marginBottom: 8 }}>
                DRUGGRAPH ASSISTANT
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
                Ask about drug interactions, mechanisms of action, clinical pharmacology, contraindications, or therapeutic alternatives.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, justifyContent: 'center' }}>
                {[
                  'What interactions does warfarin have?',
                  'Explain metformin mechanism of action',
                  'Is aspirin safe with clopidogrel?',
                  'What are CYP3A4 inhibitors?',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); }}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--accent-dim)',
                      borderRadius: 4,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-bio)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-bio)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-dim)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatHistory.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isThinking && <ThinkingBubble />}
          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--accent-dim)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 10,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--accent-dim)',
              borderRadius: 4,
              padding: '10px 14px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent-bio)', flexShrink: 0 }}>[</span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about drug interactions..."
              rows={1}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
                resize: 'none',
                lineHeight: 1.5,
                maxHeight: 80,
                overflow: 'auto',
                boxShadow: 'none',
              }}
            />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent-bio)', flexShrink: 0 }}>]</span>
            <button
              onClick={sendMessage}
              disabled={isThinking || !input.trim()}
              className="btn-bio"
              style={{ padding: '5px 14px', fontSize: 11, flexShrink: 0 }}
            >
              SEND
            </button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 6, letterSpacing: '0.06em' }}>
            ENTER to send · SHIFT+ENTER for newline
          </div>
        </div>
      </div>

      <SourcePanel sources={currentSources} />
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '85%',
          background: 'var(--bg-elevated)',
          borderRadius: 4,
          padding: '10px 14px',
          borderLeft: isUser ? 'none' : '2px solid var(--accent-bio)',
          borderRight: isUser ? '2px solid var(--accent-bio)' : 'none',
          border: `1px solid var(--accent-dim)`,
          borderLeftColor: isUser ? 'var(--accent-dim)' : 'var(--accent-bio)',
          borderRightColor: isUser ? 'var(--accent-bio)' : 'var(--accent-dim)',
        }}
      >
        {isUser ? (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text-primary)', letterSpacing: '0.04em', lineHeight: 1.5 }}>
            {message.content}
          </p>
        ) : (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {message.content.split('\n').map((line, i) => {
              const boldLine = line.replace(/\*\*(.*?)\*\*/g, (_m, p1) => `<b style="color:var(--text-primary)">${p1}</b>`);
              return (
                <p key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: boldLine }} />
              );
            })}
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 6 }}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div
        className="scan-loading"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--accent-dim)',
          borderLeft: '2px solid var(--accent-bio)',
          borderRadius: 4,
          padding: '10px 14px',
          width: 200,
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          PROCESSING QUERY...
        </div>
      </div>
    </div>
  );
}

function SourcePanel({ sources }: { sources: SourceKnowledge | null }) {
  return (
    <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--accent-dim)',
          flexShrink: 0,
        }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.16em' }}>
          [ SOURCE KNOWLEDGE ]
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!sources ? (
          <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            AWAITING QUERY
          </div>
        ) : (
          <>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: 8 }}>
                CYPHER QUERY
              </div>
              <div
                style={{
                  background: '#020408',
                  border: '1px solid var(--accent-dim)',
                  borderRadius: 4,
                  padding: '12px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                }}
              >
                {sources.cypherQuery.split('\n').map((line, i) => (
                  <div key={i}>
                    {line.split(/\b(MATCH|WHERE|RETURN|OPTIONAL|WITH|ORDER BY|LIMIT|AND|IN|AS|collect)\b/).map((part, j) =>
                      ['MATCH', 'WHERE', 'RETURN', 'OPTIONAL', 'WITH', 'ORDER BY', 'LIMIT', 'AND', 'IN', 'AS', 'collect'].includes(part) ? (
                        <span key={j} style={{ color: 'var(--accent-bio)' }}>{part}</span>
                      ) : (
                        <span key={j} style={{ color: 'var(--text-secondary)' }}>{part}</span>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.14em', marginBottom: 8 }}>
                VECTOR SNIPPETS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sources.vectorSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="card"
                    style={{ padding: '10px 12px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent-bio)', letterSpacing: '0.1em' }}>
                        [{snippet.id}] DOCUMENT CLIP
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>
                        {(snippet.relevance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 2,
                        background: 'var(--accent-dim)',
                        borderRadius: 1,
                        marginBottom: 8,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: `${snippet.relevance * 100}%`,
                          background: 'var(--accent-bio)',
                          borderRadius: 1,
                        }}
                      />
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {snippet.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
