"use client";

import CodeEditor from "@/components/CodeEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Code, FileText, Play, Trash2 } from "lucide-react";
import { useState } from "react";

interface CodeSubmission {
  id: string;
  question: string;
  code: string;
  language: string;
  explanation?: string;
  timestamp: Date;
}

const SAMPLE_QUESTIONS = [
  {
    category: "Data Structures",
    questions: [
      "Implement a function to reverse a linked list",
      "Write a function to check if a binary tree is balanced",
      "Implement a hash table with collision handling",
      "Create a function to find the intersection of two arrays",
    ],
  },
  {
    category: "Algorithms",
    questions: [
      "Implement binary search algorithm",
      "Write a function to find the longest palindromic substring",
      "Implement merge sort algorithm",
      "Find the shortest path in a graph using Dijkstra's algorithm",
    ],
  },
  {
    category: "String Manipulation",
    questions: [
      "Write a function to check if two strings are anagrams",
      "Implement string compression (e.g., 'aabcccccaaa' becomes 'a2b1c5a3')",
      "Find all permutations of a string",
      "Implement a function to validate parentheses",
    ],
  },
  {
    category: "Dynamic Programming",
    questions: [
      "Solve the coin change problem",
      "Find the longest common subsequence of two strings",
      "Implement the knapsack problem solution",
      "Calculate the minimum number of steps to reach the top of stairs",
    ],
  },
];

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

export default function CodeInterpreterTestPage() {
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [customQuestion, setCustomQuestion] = useState("");
  const [submissions, setSubmissions] = useState<CodeSubmission[]>([]);

  const handleQuestionSelect = (question: string) => {
    setCurrentQuestion(question);
    setCodeEditorOpen(true);
  };

  const handleCustomQuestion = () => {
    if (customQuestion.trim()) {
      setCurrentQuestion(customQuestion.trim());
      setCodeEditorOpen(true);
    }
  };

  const handleCodeSubmission = (code: string, language: string, explanation?: string) => {
    const submission: CodeSubmission = {
      id: Date.now().toString(),
      question: currentQuestion,
      code,
      language,
      explanation,
      timestamp: new Date(),
    };

    setSubmissions([submission, ...submissions]);
    console.log("Code submitted:", submission);
  };

  const clearSubmissions = () => {
    setSubmissions([]);
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: "bg-yellow-100 text-yellow-800 border-yellow-200",
      typescript: "bg-blue-100 text-blue-800 border-blue-200",
      python: "bg-green-100 text-green-800 border-green-200",
      java: "bg-orange-100 text-orange-800 border-orange-200",
      cpp: "bg-purple-100 text-purple-800 border-purple-200",
      go: "bg-cyan-100 text-cyan-800 border-cyan-200",
      rust: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[language] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Code className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Code Interpreter Test Page</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Test the code editor component with various programming questions and scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Question Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Custom Question */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Custom Question</span>
                </CardTitle>
                <CardDescription>
                  Enter your own programming question to test the code editor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-question">Question</Label>
                  <Textarea
                    id="custom-question"
                    placeholder="Enter your programming question here..."
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    className="min-h-20"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1" />
                  <Button onClick={handleCustomQuestion} disabled={!customQuestion.trim()}>
                    <Play className="w-4 h-4 mr-2" />
                    Open Editor
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sample Questions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Sample Questions</h2>
              {SAMPLE_QUESTIONS.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {category.questions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start text-left h-auto p-3"
                          onClick={() => handleQuestionSelect(question)}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{question}</div>
                          </div>
                          <Play className="w-4 h-4 ml-2 opacity-60" />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Panel - Submissions History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Submissions ({submissions.length})</span>
                  </CardTitle>
                  {submissions.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearSubmissions}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardDescription>Recent code submissions from the editor.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {submissions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No submissions yet</p>
                      <p className="text-sm">Submit some code to see it here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <div key={submission.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <Badge className={getLanguageColor(submission.language)}>
                              {submission.language}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {submission.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2">Question:</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {submission.question}
                            </p>
                          </div>
                          {submission.explanation && (
                            <div>
                              <h4 className="font-medium text-sm mb-1">Explanation:</h4>
                              <p className="text-xs text-muted-foreground">
                                {submission.explanation}
                              </p>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-sm mb-1">Code:</h4>
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              <code>
                                {submission.code.slice(0, 200)}
                                {submission.code.length > 200 && "..."}
                              </code>
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Test Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-primary">1.</span>
                  <span>Select a sample question or enter a custom one</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-primary">2.</span>
                  <span>Choose your preferred programming language</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-primary">3.</span>
                  <span>Write your solution in the code editor</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-primary">4.</span>
                  <span>Add an explanation (optional) and submit</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-primary">5.</span>
                  <span>View your submissions in the history panel</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Code Editor Modal */}
      <CodeEditor
        isOpen={codeEditorOpen}
        onClose={() => setCodeEditorOpen(false)}
        onSubmit={handleCodeSubmission}
        question={currentQuestion}
        language={currentLanguage}
      />
    </div>
  );
}
