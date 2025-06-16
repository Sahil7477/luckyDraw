"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ParticipantPage() {
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [winners, setWinners] = useState<string[]>([]);

  const checkStatus = async () => {
    const res = await fetch("/api/participant/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });

    const data = await res.json();
    if (data.status === "winner") {
      setStatus("winner");
    } else {
      setStatus("not-winner");
      setWinners(data.winners);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 space-y-4">
      <h2 className="text-2xl font-bold">Check Your Lucky Draw Result</h2>
      <Input
        placeholder="Enter your mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <Button onClick={checkStatus}>Check</Button>

      {status === "winner" && (
        <p className="text-green-600 font-semibold">🎉 You are a winner!</p>
      )}

      {status === "not-winner" && (
        <div>
          <p className="text-red-500">Sorry, you did not win.</p>
          <h3 className="font-semibold mt-4">Winning Numbers:</h3>
          <ul className="list-disc list-inside">
            {winners.map((num) => (
              <li key={num}>{num}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
