"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface UserInfo {
  name: string;
  skillLevel: "junior" | "mid" | "senior" | "staff";
  role: string;
  experience?: string;
}

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
}

export default function UserInfoForm({ onSubmit }: UserInfoFormProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    skillLevel: "mid",
    role: "Software Engineer",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (userInfo.name.trim()) {
      onSubmit(userInfo);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted w-full p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">AI Technical Interview</h1>
            <p className="text-muted-foreground mt-2">
              Structured interview with personalized questions and real-time feedback
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="block text-sm font-medium mb-2 text-foreground">Full Name</Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus-visible:border-border focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                required
              />
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2 text-foreground">
                Position Applied For
              </Label>
              <Select
                value={userInfo.role}
                onValueChange={(value) => setUserInfo({ ...userInfo, role: value })}
              >
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                  <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                  <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                  <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                  <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  <SelectItem value="Data Engineer">Data Engineer</SelectItem>
                  <SelectItem value="Mobile Developer">Mobile Developer</SelectItem>
                  <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2 text-foreground">
                Experience Level
              </Label>
              <Select
                value={userInfo.skillLevel}
                onValueChange={(value) =>
                  setUserInfo({ ...userInfo, skillLevel: value as UserInfo["skillLevel"] })
                }
              >
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Select an experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                  <SelectItem value="staff">Staff/Principal (8+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-md"
              disabled={!userInfo.name || !userInfo.role || !userInfo.skillLevel || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Start Technical Interview"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By starting the interview, you agree to have your responses analyzed for grammar and
              content quality.
              <br />
              Your data will be used only for interview assessment purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
