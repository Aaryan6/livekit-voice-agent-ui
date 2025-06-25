"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

interface CodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    code: string,
    language: string,
    explanation?: string,
    executionOutput?: string
  ) => void;
  question: string;
  language?: string;
  isInterpreter?: boolean;
}

const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

const DEFAULT_CODE_TEMPLATES = {
  javascript: `// Write your JavaScript solution here
function solution() {
    // Your code here
    return null;
}

// Test your solution
console.log(solution());`,
  typescript: `// Write your TypeScript solution here
function solution(): any {
    // Your code here
    return null;
}

// Test your solution
console.log(solution());`,
  python: `# Write your Python solution here
def solution():
    # Your code here
    pass

# Test your solution
if __name__ == "__main__":
    print(solution())`,
  java: `// Write your Java solution here
public class Solution {
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.solution());
    }
    
    public Object solution() {
        // Your code here
        return null;
    }
}`,
  cpp: `#include <iostream>
#include <vector>
#include <string>

// Write your C++ solution here
class Solution {
public:
    auto solution() {
        // Your code here
        return nullptr;
    }
};

int main() {
    Solution sol;
    std::cout << "Result: " << std::endl;
    return 0;
}`,
  c: `#include <stdio.h>
#include <stdlib.h>

// Write your C solution here
void solution() {
    // Your code here
    printf("Hello World\\n");
}

int main() {
    solution();
    return 0;
}`,
  csharp: `using System;

// Write your C# solution here
public class Solution 
{
    public static void Main(string[] args)
    {
        Solution sol = new Solution();
        Console.WriteLine(sol.solution());
    }
    
    public object solution() 
    {
        // Your code here
        return null;
    }
}`,
  go: `package main

import "fmt"

// Write your Go solution here
func solution() interface{} {
    // Your code here
    return nil
}

func main() {
    result := solution()
    fmt.Println(result)
}`,
  rust: `// Write your Rust solution here
fn solution() -> Option<i32> {
    // Your code here
    None
}

fn main() {
    println!("{:?}", solution());
}`,
  php: `<?php
// Write your PHP solution here
function solution() {
    // Your code here
    return null;
}

// Test your solution
var_dump(solution());
?>`,
  ruby: `# Write your Ruby solution here
def solution
    # Your code here
    nil
end

# Test your solution
puts solution.inspect`,
  sql: `-- Write your SQL query here
SELECT 
    -- Your columns here
FROM 
    -- Your table here
WHERE 
    -- Your conditions here;`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solution</title>
</head>
<body>
    <!-- Write your HTML solution here -->
    <h1>Hello World</h1>
</body>
</html>`,
  css: `/* Write your CSS solution here */
.container {
    /* Your styles here */
    display: flex;
    justify-content: center;
    align-items: center;
}`,
};

export default function CodeEditor({
  isOpen,
  onClose,
  onSubmit,
  question,
  language = "javascript",
  isInterpreter = false,
}: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [executionOutput, setExecutionOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const template =
        DEFAULT_CODE_TEMPLATES[selectedLanguage as keyof typeof DEFAULT_CODE_TEMPLATES] || "";
      setCode(template);
      setExplanation("");
    }
  }, [isOpen, selectedLanguage]);

  const handleExecute = async () => {
    if (!isInterpreter || selectedLanguage !== "python") {
      return;
    }

    setIsExecuting(true);
    try {
      // For demonstration, we'll simulate code execution
      // In a real implementation, you'd want to use a secure code execution service
      const simulatedOutput = `Executing Python code...\n${code}\n\nOutput: (simulated execution)`;
      setExecutionOutput(simulatedOutput);
    } catch (error) {
      setExecutionOutput(`Error: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = () => {
    onSubmit(code, selectedLanguage, explanation, executionOutput);
    onClose();
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    const template =
      DEFAULT_CODE_TEMPLATES[newLanguage as keyof typeof DEFAULT_CODE_TEMPLATES] || "";
    setCode(template);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isInterpreter ? "Python Code Interpreter" : "Code Editor"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {question}
              {isInterpreter && (
                <div className="mt-1 text-blue-600">
                  ✨ You can write and execute Python code directly in this environment
                </div>
              )}
            </DialogDescription>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Language:</label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <div className="flex-1 flex flex-col space-y-4">
          {/* Code Editor */}
          <div
            className={`${isInterpreter ? "flex-1" : "flex-1"} border rounded-md overflow-hidden`}
          >
            <Editor
              height="100%"
              language={selectedLanguage}
              value={code}
              onChange={(value: string | undefined) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
                lineNumbers: "on",
                tabSize: 2,
                insertSpaces: true,
              }}
            />
          </div>

          {/* Execute Button for Interpreter */}
          {isInterpreter && (
            <div className="flex justify-center">
              <Button
                onClick={handleExecute}
                disabled={isExecuting || !code.trim()}
                variant="outline"
                className="w-32"
              >
                {isExecuting ? "Executing..." : "Run Code"}
              </Button>
            </div>
          )}

          {/* Execution Output for Interpreter */}
          {isInterpreter && executionOutput && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Output</label>
              <div className="border rounded-md p-3 bg-gray-900 text-green-400 font-mono text-sm max-h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{executionOutput}</pre>
              </div>
            </div>
          )}

          {/* Explanation Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Explanation (Optional)</label>
            <Textarea
              placeholder="Explain your approach, thought process, or any assumptions you made..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="min-h-20 max-h-32"
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!code.trim()}>
            Submit Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
