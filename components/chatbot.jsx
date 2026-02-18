"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquare, X, Send, Loader2, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { chatWithBot } from "@/actions/bot";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
});

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Hi! I'm your Career Coach. How can I help you today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const onSubmit = async (data) => {
        const userMessage = data.message;
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);
        reset();

        try {
            const response = await chatWithBot(userMessage);
            setMessages((prev) => [...prev, { role: "bot", content: response }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "Sorry, I encountered an error. Please try again." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg p-0 bg-primary hover:bg-primary/90 z-50"
            >
                <MessageSquare className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
            <Card className="shadow-xl border-primary/20">
                <CardHeader className="p-4 border-b flex flex-row items-center justify-between bg-primary/5">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        AI Career Coach
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div
                        ref={scrollRef}
                        className="h-80 overflow-y-auto p-4 space-y-4 bg-background"
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-start gap-2 max-w-[85%]",
                                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                )}>
                                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div
                                    className={cn(
                                        "p-3 rounded-lg text-sm",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none whitespace-pre-wrap"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-start gap-2 mr-auto">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                                    <Bot className="h-4 w-4" />
                                </div>
                                <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t bg-background">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
                            <Input
                                placeholder="Ask career questions..."
                                {...register("message")}
                                disabled={loading}
                                className="flex-1"
                                autoComplete="off"
                            />
                            <Button type="submit" size="icon" disabled={loading || !!errors.message}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
