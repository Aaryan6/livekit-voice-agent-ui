"use client";

import { CheckCircle, Clock, FileText, Mic, User } from "lucide-react";
import { Badge } from "./ui/badge";

export interface InterviewProgress {
  currentStage: "welcome" | "introduction" | "questions" | "wrap_up" | "completed";
  questionsAsked: number;
  totalQuestions: number; // Always 5
  currentQuestionIndex: number;
  elapsedTime: number; // in seconds
  candidateSpeakingTime: number; // in seconds
}

interface InterviewProgressProps {
  progress: InterviewProgress;
}

export default function InterviewProgress({ progress }: InterviewProgressProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStageDisplay = (stage: string): string => {
    switch (stage) {
      case "welcome":
        return "Welcome";
      case "introduction":
        return "Introduction";
      case "questions":
        return "Technical Questions";
      case "wrap_up":
        return "Wrap-up";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "welcome":
        return <User className="w-4 h-4" />;
      case "introduction":
        return <Mic className="w-4 h-4" />;
      case "questions":
        return <FileText className="w-4 h-4" />;
      case "wrap_up":
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const progressPercentage = Math.round((progress.questionsAsked / progress.totalQuestions) * 100);

  const candidateSpeakingPercentage =
    progress.elapsedTime > 0
      ? Math.round((progress.candidateSpeakingTime / progress.elapsedTime) * 100)
      : 0;

  return (
    <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Interview Progress</h3>
        <Badge
          variant="outline"
          className={
            progress.currentStage === "completed"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }
        >
          {getStageDisplay(progress.currentStage)}
        </Badge>
      </div>

      {/* Current Stage */}
      <div className="flex items-center space-x-2">
        {getStageIcon(progress.currentStage)}
        <span className="text-sm text-muted-foreground">
          Current Stage: {getStageDisplay(progress.currentStage)}
        </span>
      </div>

      {/* Question Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Questions: {progress.questionsAsked} / {progress.totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground">{progressPercentage}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Timing Information */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Total Time</span>
          </div>
          <div className="font-medium text-foreground">{formatTime(progress.elapsedTime)}</div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Mic className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Speaking Time</span>
          </div>
          <div className="font-medium text-foreground">
            {formatTime(progress.candidateSpeakingTime)} ({candidateSpeakingPercentage}%)
          </div>
        </div>
      </div>

      {/* Current Question Indicator */}
      {progress.currentStage === "questions" && (
        <div className="border-t border-border pt-3">
          <div className="text-sm text-muted-foreground">
            Question {progress.currentQuestionIndex + 1} of {progress.totalQuestions}
          </div>
          {progress.currentQuestionIndex < progress.totalQuestions && (
            <div className="text-xs text-muted-foreground mt-1">
              {progress.totalQuestions - progress.currentQuestionIndex - 1} questions remaining
            </div>
          )}
        </div>
      )}
    </div>
  );
}
