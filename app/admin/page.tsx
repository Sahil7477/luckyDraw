"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  const addWinner = async () => {
    const res = await fetch("/api/admin/add-winner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Winner added successfully!");
      setMobile("");
    } else {
      setMessage(data.error);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 space-y-4">
      <h2 className="text-2xl font-bold">Admin Panel</h2>
      <Input
        placeholder="Enter winner mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <Button onClick={addWinner}>Add Winner</Button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </Card>
  );
}
