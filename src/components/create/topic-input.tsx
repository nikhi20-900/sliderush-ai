"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

interface TopicInputProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  onSubmit: (topic: string) => void;
  suggestions: string[];
  onSuggestionsChange: (suggestions: string[]) => void;
}

export function TopicInput({
  topic,
  onTopicChange,
  onSubmit,
  suggestions,
  onSuggestionsChange,
}: TopicInputProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSuggestTopics = async () => {
    if (!topic.trim()) {
      toast({
        title: "Enter a topic first",
        description: "Please enter a base topic to generate suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setShowSuggestions(true);

    try {
      const res = await fetch("/api/ai/suggest-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate suggestions");
      }

      const data = await res.json();
      onSuggestionsChange(data.suggestions || []);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate topic suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onTopicChange(suggestion);
    onSuggestionsChange([]);
    setShowSuggestions(false);
  };

  const isValid = topic.trim().length >= 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle>What is your presentation about?</CardTitle>
        <CardDescription>
          Enter a topic and optionally get AI suggestions for variations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Topic Input */}
        <div className="space-y-2">
          <Label htmlFor="topic">Presentation Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., The Future of Artificial Intelligence"
            value={topic}
            onChange={(e) => {
              onTopicChange(e.target.value);
              setShowSuggestions(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValid) {
                onSubmit(topic);
              }
            }}
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500">
            {topic.length}/100 characters
          </p>
        </div>

        {/* AI Suggestion Button */}
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSuggestTopics}
            disabled={!topic.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Suggest variations
          </Button>
          <span className="text-sm text-gray-500">
            Get AI-powered topic ideas
          </span>
        </div>

        {/* Topic Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="space-y-2">
            <Label>Suggested Topics</Label>
            <div className="grid gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => onSubmit(topic)}
            disabled={!isValid || isLoading}
            size="lg"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

