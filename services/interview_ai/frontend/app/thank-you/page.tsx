// app/thank-you/page.tsx
"use client";

import { useEffect, useState } from "react";
import { endSession } from "../../lib/api";
import { useSearchParams } from "next/navigation";

// Import shadcn components
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const finalText =
    searchParams.get("text") || "Your interview has been completed.";
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    const terminateSession = async () => {
      const sessionId = localStorage.getItem("session_id");
      if (sessionId) {
        setEnding(true);
        try {
          await endSession(sessionId);
        } catch (err) {
          console.error("Error ending session:", err);
        }
        localStorage.removeItem("session_id");
        setEnding(false);
      }
    };
    terminateSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{finalText}</p>
          {ending && <p>Ending session...</p>}
        </CardContent>
      </Card>
    </div>
  );
}
