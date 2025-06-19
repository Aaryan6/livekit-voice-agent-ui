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
    role: "software-engineer",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (userInfo.name.trim()) {
        onSubmit(userInfo);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted w-full p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">AI Interview</h1>
          <p className="text-muted-foreground mt-2">
            Please provide your information to start the interview
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1 text-foreground">Full Name</Label>
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
            <Label className="block text-sm font-medium mb-1 text-foreground">
              Position Applied For
            </Label>
            <Select
              value={userInfo.role}
              defaultValue="software-engineer"
              onValueChange={(value) => setUserInfo({ ...userInfo, role: value })}
            >
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software-engineer">Software Engineer</SelectItem>
                <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                <SelectItem value="backend-developer">Backend Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1 text-foreground">
              Experience Level
            </Label>
            <Select
              value={userInfo.skillLevel}
              defaultValue="mid"
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
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md"
            disabled={!userInfo.name || !userInfo.role || !userInfo.skillLevel || isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2" /> : "Start Interview"}
          </Button>
        </form>
      </div>
    </div>
  );
}
