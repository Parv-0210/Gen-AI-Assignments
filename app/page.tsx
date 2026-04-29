"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { personas, Persona } from "@/lib/personas";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

function TypingIndicator({ persona }: { persona: Persona }) {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div
        className="avatar"
        style={{ background: `linear-gradient(135deg, ${persona.color}, ${persona.accentColor})` }}
      >
        {persona.avatar}
      </div>
      <div className="message-ai flex items-center gap-1.5 py-4">
        <div className="typing-dot" style={{ background: persona.accentColor }} />
        <div className="typing-dot" style={{ background: persona.accentColor }} />
        <div className="typing-dot" style={{ background: persona.accentColor }} />
      </div>
    </div>
  );
}

function WelcomeScreen({ persona, onSuggestion }: { persona: Persona; onSuggestion: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-4 py-8 animate-fade-in">
      <div className="welcome-card max-w-md w-full">
        <div
          className="avatar mx-auto mb-4"
          style={{
            background: `linear-gradient(135deg, ${persona.color}, ${persona.accentColor})`,
            width: 64,
            height: 64,
            fontSize: "1.1rem",
            borderRadius: 16,
          }}
        >
          {persona.avatar}
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color: persona.accentColor }}>
          {persona.name}
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          {persona.title}
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Ask me anything about tech, careers, DSA, startups, or Scaler&apos;s story.
        </p>
      </div>

      <div className="w-full max-w-md">
        <p className="text-xs font-medium mb-3 text-center" style={{ color: "var(--text-muted)" }}>
          SUGGESTED QUESTIONS
        </p>
        <div className="flex flex-col gap-2">
          {persona.suggestions.map((s) => (
            <button
              key={s}
              className="chip text-left"
              style={{ borderRadius: 12, whiteSpace: "normal", padding: "10px 14px" }}
              onClick={() => onSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activePersonaId, setActivePersonaId] = useState(personas[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activePersona = personas.find((p) => p.id === activePersonaId)!;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const switchPersona = (personaId: string) => {
    if (personaId === activePersonaId) return;
    setActivePersonaId(personaId);
    setMessages([]);
    setInput("");
  };

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: trimmed,
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            personaId: activePersonaId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: data.error || "Something went wrong. Please try again.",
              isError: true,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: data.text,
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Network error. Please check your connection and try again.",
            isError: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, activePersonaId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  return (
    <div className="flex flex-col h-dvh relative overflow-hidden">
      {/* Background glow orbs */}
      <div
        className="glow-orb"
        style={{
          width: 400,
          height: 400,
          background: activePersona.color + "15",
          top: -100,
          right: -100,
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: 300,
          height: 300,
          background: activePersona.accentColor + "10",
          bottom: -50,
          left: -50,
          animationDelay: "2s",
        }}
      />

      {/* Header */}
      <header
        className="flex-shrink-0 border-b px-4 py-3"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Logo row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${activePersona.color}, ${activePersona.accentColor})` }}
              >
                S
              </div>
              <span className="font-bold text-sm logo-shimmer">Scaler Persona Chat</span>
            </div>
            <div
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              AI-Powered
            </div>
          </div>

          {/* Persona tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => switchPersona(persona.id)}
                className={`persona-tab flex items-center gap-2 flex-shrink-0 ${activePersonaId === persona.id ? "active" : ""}`}
                style={
                  activePersonaId === persona.id
                    ? {
                        background: `linear-gradient(135deg, ${persona.color}25, ${persona.accentColor}15)`,
                        borderColor: persona.color + "60",
                        boxShadow: `0 0 20px ${persona.color}20`,
                      }
                    : {}
                }
              >
                <div
                  className="avatar"
                  style={{
                    background:
                      activePersonaId === persona.id
                        ? `linear-gradient(135deg, ${persona.color}, ${persona.accentColor})`
                        : "var(--border)",
                    width: 28,
                    height: 28,
                    fontSize: "0.6rem",
                    borderRadius: 7,
                  }}
                >
                  {persona.avatar}
                </div>
                <div className="text-left">
                  <div
                    className="text-xs font-semibold leading-tight"
                    style={{
                      color: activePersonaId === persona.id ? persona.accentColor : "var(--text-secondary)",
                    }}
                  >
                    {persona.name.split(" ")[0]}
                  </div>
                  <div className="text-xs hidden sm:block" style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>
                    {activePersonaId === persona.id ? "● Active" : persona.title.split(",")[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-4 min-h-full flex flex-col">
          {messages.length === 0 ? (
            <WelcomeScreen persona={activePersona} onSuggestion={(q) => sendMessage(q)} />
          ) : (
            <div className="flex flex-col gap-5 flex-1">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx === messages.length - 1 ? 0 : 0}ms` }}
                >
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="message-user">{msg.content}</div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div
                        className="avatar flex-shrink-0"
                        style={{
                          background: msg.isError
                            ? "rgba(239,68,68,0.2)"
                            : `linear-gradient(135deg, ${activePersona.color}, ${activePersona.accentColor})`,
                        }}
                      >
                        {msg.isError ? "!" : activePersona.avatar}
                      </div>
                      {msg.isError ? (
                        <div className="error-bubble">{msg.content}</div>
                      ) : (
                        <div className="message-ai whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && <TypingIndicator persona={activePersona} />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Suggestion chips (when in conversation) */}
      {messages.length > 0 && !isLoading && (
        <div
          className="flex-shrink-0 px-4 py-2 border-t"
          style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}
        >
          <div className="max-w-3xl mx-auto overflow-x-auto flex gap-2" style={{ scrollbarWidth: "none" }}>
            {activePersona.suggestions.slice(0, 3).map((s) => (
              <button key={s} className="chip flex-shrink-0" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <footer
        className="flex-shrink-0 border-t px-4 py-3"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
      >
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <textarea
            ref={textareaRef}
            id="chat-input"
            className="chat-input"
            rows={1}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${activePersona.name.split(" ")[0]}…`}
            disabled={isLoading}
          />
          <button
            id="send-btn"
            className="send-btn"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={{
              background: input.trim() && !isLoading
                ? `linear-gradient(135deg, ${activePersona.color}, ${activePersona.accentColor})`
                : "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
        <p className="text-center mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
          AI personas — responses are simulated, not real statements from these individuals.
        </p>
      </footer>
    </div>
  );
}
