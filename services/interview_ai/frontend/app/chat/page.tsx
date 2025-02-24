// app/chat/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { sendChat } from "../../lib/api";

// Import shadcn UI components
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [initialFetched, setInitialFetched] = useState(false); // Track if greeting fetched


  // Scroll to bottom whenever chatLog updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

   // Fetch greeting message on first load
   useEffect(() => {
    if (sessionId && !initialFetched) {
      handleSend("");
      setInitialFetched(true); // Ensure it doesn't send multiple times
    }
  }, [sessionId, initialFetched]);


  // Retrieve session_id on mount and trigger the initial greeting
  useEffect(() => {
    const storedSession = localStorage.getItem("session_id");
    if (!storedSession) {
      router.push("/");
    } else {
      setSessionId(storedSession);
      // Trigger initial greeting message immediately
      if (chatLog.length === 0) {
        handleSend("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (input: string) => {
    if (!sessionId) return;
    setLoading(true);
    try {
      // Add the user's message if not empty
      if (input !== "") {
        setChatLog((prev) => [...prev, { sender: "user", text: input }]);
      }
      // Send the API request and update chat log with AI response
      const response = await sendChat(sessionId, input);
      setChatLog((prev) => [...prev, { sender: "ai", text: response.text }]);
      if (response.state === "completed") {
        router.push(`/thank-you?text=${encodeURIComponent(response.text)}`);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    handleSend(userInput.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <Card className="w-full max-w-3xl flex flex-col h-[80vh] shadow-lg">
        <CardHeader className="border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Kifya AI Interview Chat
          </h1>
          <div className="w-10 h-10">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatLog.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "ai" && (
                <Avatar className="mr-2">
                  <AvatarImage src="/ai-profile.png" alt="AI Profile" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-gray-800"
                    : "bg-white text-gray-800 shadow"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <Avatar className="ml-2">
                  <AvatarImage src="/user-profile.png" alt="User Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center">
              <Avatar className="mr-2">
                <AvatarImage src="/ai-profile.png" alt="AI Profile" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-1">
                <span className="text-gray-600 italic">AI is typing</span>
                <span className="animate-pulse text-gray-600">...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="border-t px-6 py-4">
          <form onSubmit={handleSubmit} className="flex">
            <Input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 rounded-r-none border-r-0"
            />
            <Button type="submit" disabled={loading} className="rounded-l-none">
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
