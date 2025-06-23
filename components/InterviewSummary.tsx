"use client";

import { CheckCircle, Clock, FileText, MessageCircle, User, XCircle } from "lucide-react";
import { OverallGrammarSummary } from "./GrammarFeedback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export interface InterviewSummary {
  interview_metadata: {
    candidate_name: string;
    role: string;
    skill_level: string;
    interview_date: string;
    total_duration_minutes: number;
    candidate_speaking_time_minutes: number;
    interviewer_time_percentage: number;
  };
  questions_coverage: {
    total_predefined_questions: number;
    questions_asked_count: number;
    questions_missed_count: number;
    all_mandatory_questions_asked: boolean;
    questions_asked: string[];
    questions_missed: string[];
  };
  grammar_assessment: {
    overall_feedback: {
      average_accuracy_percentage: number;
      meets_70_percent_threshold: boolean;
      assessment: "Yes" | "No";
    };
    qa_section_feedback: {
      total_answers_assessed: number;
      answers_below_70_percent: number;
      answers_with_poor_grammar_count: number;
    };
  };
}

interface InterviewSummaryProps {
  summary: InterviewSummary;
  onExport?: () => void;
  onRetake?: () => void;
}

export function InterviewSummary({ summary, onExport, onRetake }: InterviewSummaryProps) {
  const formatTime = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSkillLevelDisplay = (level: string): string => {
    switch (level) {
      case "junior":
        return "Junior (0-2 years)";
      case "mid":
        return "Mid-level (2-5 years)";
      case "senior":
        return "Senior (5-8 years)";
      case "staff":
        return "Staff/Principal (8+ years)";
      default:
        return level;
    }
  };

  const responsesAboveThreshold =
    summary.grammar_assessment.qa_section_feedback.total_answers_assessed -
    summary.grammar_assessment.qa_section_feedback.answers_with_poor_grammar_count;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Interview Summary</h1>
        <p className="text-muted-foreground">
          Complete analysis of your technical interview performance
        </p>
      </div>

      {/* Candidate Information */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Candidate Information</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Name</div>
            <div className="font-medium text-foreground">
              {summary.interview_metadata.candidate_name}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Role</div>
            <div className="font-medium text-foreground">{summary.interview_metadata.role}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Experience Level</div>
            <div className="font-medium text-foreground">
              {getSkillLevelDisplay(summary.interview_metadata.skill_level)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Interview Date</div>
            <div className="font-medium text-foreground">
              {formatDate(summary.interview_metadata.interview_date)}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timing Metrics */}
        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Timing Analysis</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Duration</span>
              <span className="font-medium text-foreground">
                {formatTime(summary.interview_metadata.total_duration_minutes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Speaking Time</span>
              <span className="font-medium text-foreground">
                {formatTime(summary.interview_metadata.candidate_speaking_time_minutes)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Speaking Ratio</span>
              <span className="font-medium text-foreground">
                {Math.round(
                  (summary.interview_metadata.candidate_speaking_time_minutes /
                    summary.interview_metadata.total_duration_minutes) *
                    100
                )}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Questions Coverage */}
        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Questions Coverage</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Questions Asked</span>
              <span className="font-medium text-foreground">
                {summary.questions_coverage.questions_asked_count}/
                {summary.questions_coverage.total_predefined_questions}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">All Mandatory Asked</span>
              <Badge
                variant="outline"
                className={
                  summary.questions_coverage.all_mandatory_questions_asked
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {summary.questions_coverage.all_mandatory_questions_asked ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Questions Missed</span>
              <span className="font-medium text-foreground">
                {summary.questions_coverage.questions_missed_count}
              </span>
            </div>
          </div>
        </div>

        {/* Grammar Score */}
        <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Grammar Score</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Overall Accuracy</span>
              <span className="font-medium text-foreground">
                {summary.grammar_assessment.overall_feedback.average_accuracy_percentage.toFixed(1)}
                %
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Meets Threshold</span>
              <Badge
                variant="outline"
                className={
                  summary.grammar_assessment.overall_feedback.meets_70_percent_threshold
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {summary.grammar_assessment.overall_feedback.assessment}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Poor Grammar Answers</span>
              <span className="font-medium text-foreground">
                {summary.grammar_assessment.qa_section_feedback.answers_with_poor_grammar_count}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Grammar Performance */}
      <OverallGrammarSummary
        overallAccuracy={summary.grammar_assessment.overall_feedback.average_accuracy_percentage}
        totalResponses={summary.grammar_assessment.qa_section_feedback.total_answers_assessed}
        responsesAboveThreshold={responsesAboveThreshold}
      />

      {/* Questions Asked */}
      <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Questions Asked During Interview
        </h3>
        <div className="space-y-3">
          {summary.questions_coverage.questions_asked.map((question, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-muted-foreground">Q{index + 1}:</span>
                <span className="text-sm text-foreground ml-2">{question}</span>
              </div>
            </div>
          ))}
          {summary.questions_coverage.questions_missed.map((question, index) => (
            <div key={`missed-${index}`} className="flex items-start space-x-3">
              <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-muted-foreground">Missed:</span>
                <span className="text-sm text-muted-foreground ml-2">{question}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            Export Summary
          </Button>
        )}
        {onRetake && (
          <Button onClick={onRetake} className="bg-teal-600 hover:bg-teal-700">
            Retake Interview
          </Button>
        )}
      </div>
    </div>
  );
}
