"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "./ui/badge";

export interface GrammarAssessment {
  accuracy_percentage: number;
  meets_threshold: boolean;
  issues: string[];
  word_count: number;
}

interface GrammarFeedbackProps {
  assessment: GrammarAssessment;
  showDetails?: boolean;
}

export function GrammarFeedback({ assessment, showDetails = true }: GrammarFeedbackProps) {
  const getAccuracyColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyBadgeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-50 text-green-700 border-green-200";
    if (percentage >= 70) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {assessment.meets_threshold ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <h4 className="font-medium text-foreground">Grammar Assessment</h4>
        </div>
        <Badge variant="outline" className={getAccuracyBadgeColor(assessment.accuracy_percentage)}>
          {assessment.accuracy_percentage}%
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Accuracy Score</span>
          <span className={`font-medium ${getAccuracyColor(assessment.accuracy_percentage)}`}>
            {assessment.accuracy_percentage}%
            {assessment.meets_threshold ? " (Meets Threshold)" : " (Below Threshold)"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Word Count</span>
          <span className="font-medium text-foreground">{assessment.word_count}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              assessment.accuracy_percentage >= 90
                ? "bg-green-600"
                : assessment.accuracy_percentage >= 70
                  ? "bg-yellow-600"
                  : "bg-red-600"
            }`}
            style={{ width: `${assessment.accuracy_percentage}%` }}
          />
        </div>
      </div>

      {/* Grammar Issues */}
      {showDetails && assessment.issues.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h5 className="text-sm font-medium text-foreground">Suggestions for Improvement</h5>
          </div>
          <ul className="space-y-1">
            {assessment.issues.map((issue, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Threshold Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-2">
        <div className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> A minimum accuracy of 70% is required to meet the threshold. Focus
          on proper capitalization, punctuation, and grammar usage.
        </div>
      </div>
    </div>
  );
}

interface OverallGrammarSummaryProps {
  overallAccuracy: number;
  totalResponses: number;
  responsesAboveThreshold: number;
}

export function OverallGrammarSummary({
  overallAccuracy,
  totalResponses,
  responsesAboveThreshold,
}: OverallGrammarSummaryProps) {
  const thresholdPercentage =
    totalResponses > 0 ? Math.round((responsesAboveThreshold / totalResponses) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-800 border border-border rounded-lg p-4 space-y-3">
      <h4 className="font-medium text-foreground flex items-center space-x-2">
        <CheckCircle2 className="w-5 h-5 text-blue-600" />
        <span>Overall Grammar Performance</span>
      </h4>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">{overallAccuracy.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Overall Accuracy</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">
            {responsesAboveThreshold}/{totalResponses}
          </div>
          <div className="text-xs text-muted-foreground">Above Threshold</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground">{thresholdPercentage}%</div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <Badge
          variant="outline"
          className={
            overallAccuracy >= 70
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }
        >
          {overallAccuracy >= 70 ? "✓ Meets Requirements" : "✗ Below Requirements"}
        </Badge>
      </div>
    </div>
  );
}
