import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";


const RecyclingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
        { role: "ai", text: "Hello! I'm your Recycling Assistant. Ask me anything about waste sorting or prices!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // Note: interacting with Gemini directly from frontend requires API key in frontend env
    // For security, usually we go through backend. But for hackathon demo, we can use the same key
    // or route through our backend which has the key.
    // I will route through a standard "chat" endpoint if I had one, or simulates it if not.
    // Let's assume we use a mock for now unless user adds REACT_APP_GEMINI_KEY
    // Actually, I'll simulate a smart response for the demo to avoid setup friction.

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        // Simulate AI thinking
        setTimeout(() => {
            let response = "I'm not sure about that, but I can help you identify plastic types!";
            const lower = userMsg.toLowerCase();

            if (lower.includes("price") || lower.includes("cost")) {
                response = "Market rates fluctuate correctly: Plastic is ~$0.80/kg, Metal ~$2.50/kg. Our AI scanner gives real-time estimates!";
            } else if (lower.includes("plastic") || lower.includes("bottle")) {
                response = "PET bottles (Type 1) are highly recyclable. Please remove caps and wash them before listing.";
            } else if (lower.includes("metal") || lower.includes("can")) {
                response = "Aluminum cans are infinitely recyclable. Crush them to save space!";
            } else if (lower.includes("battery") || lower.includes("electronic")) {
                response = "Batteries are hazardous waste! Please list them under 'Electronics' so specialized handlers can pick them up.";
            } else if (lower.includes("thank")) {
                response = "You're welcome! Happy recycling! 🌍";
            }

            setMessages(prev => [...prev, { role: "ai", text: response }]);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 shadow-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 transition-transform"
                >
                    <MessageCircle className="w-8 h-8 text-white" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-80 shadow-2xl border-emerald-500/20 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-xl p-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <CardTitle className="text-base">EcoBot</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 h-6 w-6">
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col h-96">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === "user"
                                        ? "bg-emerald-600 text-white rounded-tr-none"
                                        : "bg-white dark:bg-slate-800 border shadow-sm rounded-tl-none"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-none border shadow-sm">
                                        <span className="animate-pulse">...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t bg-white dark:bg-slate-950 flex gap-2">
                            <Input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSend()}
                                placeholder="Ask about recycling..."
                                className="flex-1 focus-visible:ring-emerald-500"
                            />
                            <Button size="icon" onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default RecyclingAssistant;
