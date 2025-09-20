"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [theme, setTheme] = useState("dark");

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const send = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: input }]);
    const text = input;
    setInput("");
    inputRef.current?.focus();
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      setTyping(false);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setTyping(false);
    }
  };

  return (
    <div className="chat-wrapper flex items-center justify-center min-h-screen bg-[var(--bg)]">
      <motion.div
        className="chat-container relative flex flex-col w-full max-w-md bg-[var(--card-bg)] rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="chat-header flex items-center justify-between px-4 py-3 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <Image
                src="/my_chatbot.png"
                alt="Chatbot"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </motion.div>
            <span className="text-lg font-bold text-[var(--text)]">My Chatbot</span>
          </div>

          <motion.button
            onClick={toggleTheme}
            whileTap={{ rotate: 90, scale: 0.85 }}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>

        {/* Chat Box */}
        <div className="chat-box flex-1 overflow-y-auto p-4 space-y-2">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
               className={`message ${m.sender === "user" ? "user-message ml-auto" : "bot-message"}`}

                dangerouslySetInnerHTML={{ __html: m.text }}
                initial={{ opacity: 0, x: m.sender === "user" ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: m.sender === "user" ? 50 : -50 }}
                transition={{ duration: 0.3 }}
              /> 
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div
              className="message bot-message max-w-[80%] p-2 rounded-md bg-gray-700 text-white"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Bot is typing...
            </motion.div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="input-area flex border-t border-gray-300 p-2 gap-2 items-center">
          {/* Hidden File Input */}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              const fileURL = URL.createObjectURL(file);
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  sender: "user",
                  text: file.type.startsWith("image/")
                    ? `<img src="${fileURL}" class="uploaded-image" />`
                    : `📎 ${file.name}`,
                },
              ]);
            }}
          />

          {/* File Upload Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
            onClick={() => document.getElementById("fileInput").click()}
          >
            📎
          </motion.button>

          {/* Text Input */}
          <input
            ref={inputRef}
            className="input-box flex-1 p-2 rounded-md border border-gray-400 outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />

          {/* Send Button */}
          <motion.button
            className="send-btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            whileTap={{ scale: 0.9 }}
            onClick={send}
          >
            Send
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
