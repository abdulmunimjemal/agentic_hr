// app/interview/[interview_id]/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { startInterview } from "../../../lib/api";

// Import shadcn components (or your own UI components)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function InterviewPage() {
  const router = useRouter();
  const params = useParams() as { interview_id: string };
  const { interview_id } = params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    if (!interview_id) return;
    setLoading(true);
    setError("");
    try {
      const response = await startInterview(interview_id);
      localStorage.setItem("session_id", response.session_id);
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/logo.svg" alt="Logo" className="mx-auto h-16 w-auto" />
          <h1 className="mt-4 text-2xl font-bold">Welcome to Kifya AI Interviewer</h1>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStart} disabled={loading} className="w-full">
            {loading ? "Starting..." : "Start Interview"}
          </Button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
