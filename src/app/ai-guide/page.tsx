"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/stores/useAppStore";
import { scenarios } from "@/lib/mock-data";
import {
  Send,
  Volume2,
  AlertTriangle,
  Bot,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIGuidePage() {
  const { alerts } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // TTS 재생
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      utterance.rate = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  // 시나리오 선택
  const handleScenarioSelect = (scenario: typeof scenarios[0]) => {
    setInputValue(scenario.description);
  };

  // 메시지 전송
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("API Error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const text = JSON.parse(line.slice(2));
                assistantContent += text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  )
                );
              } catch {
                // Skip non-JSON lines
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 제출
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const latestAlerts = alerts.filter((a) => a.status === "new").slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">AI 안전 가이드</h1>
            <p className="text-slate-400">생성형 AI 기반 실시간 대응 지침</p>
          </div>
          <Badge variant="outline" className="border-purple-500 text-purple-400">
            <Sparkles className="w-4 h-4 mr-2" />
            Claude Sonnet 4.0
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-4rem)]">
          {/* Scenarios & Alerts */}
          <div className="space-y-6">
            {/* Quick Scenarios */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">빠른 시나리오</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {scenarios.map((scenario) => (
                  <Button
                    key={scenario.id}
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left h-auto py-3 border-slate-700 hover:bg-slate-800",
                      scenario.type === "gas_leak" && "hover:border-orange-500",
                      scenario.type === "fire" && "hover:border-red-500",
                      scenario.type === "fallen_worker" && "hover:border-purple-500",
                      scenario.type === "no_helmet" && "hover:border-amber-500"
                    )}
                    onClick={() => handleScenarioSelect(scenario)}
                  >
                    <span className="text-xl mr-3">{scenario.icon}</span>
                    <div>
                      <p className="font-medium text-white">{scenario.name}</p>
                      <p className="text-xs text-slate-400 whitespace-pre-line">{scenario.description}</p>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  활성 알림
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {latestAlerts.length > 0 ? (
                  latestAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]",
                        alert.severity === "critical" && "border-red-500/50 bg-red-500/10",
                        alert.severity === "warning" && "border-amber-500/50 bg-amber-500/10"
                      )}
                      onClick={() => {
                        setInputValue(`${alert.title}에 대한 대응 지침을 알려주세요. 상세 내용: ${alert.description}`);
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={cn(
                            "text-xs",
                            alert.severity === "critical" && "bg-red-500",
                            alert.severity === "warning" && "bg-amber-500"
                          )}
                        >
                          {alert.severity === "critical" ? "긴급" : "주의"}
                        </Badge>
                      </div>
                      <p className="text-sm text-white truncate">{alert.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(alert.timestamp, "HH:mm:ss")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    활성 알림이 없습니다
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <Card className="lg:col-span-3 bg-slate-900 border-slate-800 flex flex-col h-full">
            <CardHeader className="border-b border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  AI 안전 어시스턴트
                </CardTitle>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                  온라인
                </Badge>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-[450px] p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                      <Bot className="w-16 h-16 mb-4 text-slate-600" />
                      <p className="text-lg font-medium">안녕하세요! AI 안전 가이드입니다.</p>
                      <p className="text-sm mt-2">
                        안전 관련 질문이나 긴급 상황 대응 지침을 안내해드립니다.
                      </p>
                      <p className="text-sm mt-1">
                        왼쪽의 빠른 시나리오를 선택하거나 직접 질문해주세요.
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "flex-row-reverse"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          message.role === "user"
                            ? "bg-blue-500"
                            : "bg-purple-500"
                        )}
                      >
                        {message.role === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-4",
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-slate-800 text-white"
                        )}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        {message.role === "assistant" && message.content && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-slate-400 hover:text-white p-0 h-auto"
                            onClick={() => speakText(message.content)}
                          >
                            <Volume2 className="w-4 h-4 mr-1" />
                            음성 안내
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">분석 중...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-slate-800">
              <form onSubmit={onSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="안전 관련 질문을 입력하세요..."
                  className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-slate-500 mt-2 text-center">
                AI 응답은 참고용이며, 실제 긴급상황 시 중앙관제실(내선 100)로 연락하세요.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
