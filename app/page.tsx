
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Gift, Sparkles, Users } from 'lucide-react';

type Winner = {
  name: string;
  email: string;
};

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '' });
 const [winner, setWinner] = useState<Winner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/token', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        alert('Token submitted!');
        setForm({ name: '', email: '' });
      } else {
        alert('Email already registered.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const draw = async () => {
    setIsDrawing(true);
    try {
      const res = await fetch('/api/draw', { method: 'POST' });
      const data = await res.json();
      setWinner(data);
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center gap-8 p-4">
        {/* Header */}
        <div className="text-center mb-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              🎉 Lucky Draw System
            </h1>
            <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Enter your details for a chance to win amazing prizes!
          </p>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Registration Form */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-xl animate-scale-in">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-foreground">Join the Draw</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <Button
                onClick={submit}
                disabled={isSubmitting || !form.name || !form.email}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4 mr-2" />
                    Submit Entry
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Draw Button */}
          <div className="text-center">
            <Button
              onClick={draw}
              disabled={isDrawing}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-full transform transition-all duration-200 hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isDrawing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Drawing...
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5 mr-2" />
                  🎯 Draw Winner
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Winner Display */}
        {winner && (
          <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-xl animate-fade-in max-w-md w-full">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-yellow-700">🎉 We have a Winner! 🎉</h2>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              
              <div className="bg-white/80 rounded-lg p-4 border border-yellow-200">
                <Badge variant="secondary" className="mb-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                  WINNER
                </Badge>
                <p className="text-xl font-bold text-gray-800">{winner.name}</p>
                <p className="text-gray-600">{winner.email}</p>
              </div>
              
              <div className="mt-4 flex justify-center">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="text-2xl animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    🎉
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Features */}
        <div className="max-w-3xl mx-auto mt-8">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 bg-white/60 backdrop-blur-sm border border-purple-200 text-center hover:shadow-lg transition-shadow">
              <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Amazing Prizes</h3>
              <p className="text-sm text-muted-foreground">Win incredible rewards</p>
            </Card>
            
            <Card className="p-4 bg-white/60 backdrop-blur-sm border border-blue-200 text-center hover:shadow-lg transition-shadow">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Fair Drawing</h3>
              <p className="text-sm text-muted-foreground">Everyone has equal chances</p>
            </Card>
            
            <Card className="p-4 bg-white/60 backdrop-blur-sm border border-green-200 text-center hover:shadow-lg transition-shadow">
              <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Instant Results</h3>
              <p className="text-sm text-muted-foreground">Know the winner immediately</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
