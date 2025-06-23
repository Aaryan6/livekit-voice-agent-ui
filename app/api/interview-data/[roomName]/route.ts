import { NextResponse } from "next/server";

// Mock interview summary data for testing
// In production, this would fetch from the backend agent or database
const generateMockSummary = () => {
  return {
    interview_metadata: {
      candidate_name: "John Doe",
      role: "Software Engineer",
      skill_level: "mid",
      interview_date: new Date().toISOString(),
      total_duration_minutes: 18.7,
      candidate_speaking_time_minutes: 12.25,
      interviewer_time_percentage: 34.5,
    },
    questions_coverage: {
      total_predefined_questions: 5,
      questions_asked_count: 4,
      questions_missed_count: 1,
      all_mandatory_questions_asked: false,
      questions_asked: [
        "Explain the SOLID principles and give examples of how you've applied them in your work.",
        "How do you approach testing your code? What types of tests do you write?",
        "Find the second largest element in an array and handle edge cases in your solution.",
        "How would you design a chat application? Consider real-time messaging requirements.",
      ],
      questions_missed: [
        "Describe a time when you refactored legacy code. What was your approach and reasoning?",
      ],
    },
    grammar_assessment: {
      overall_feedback: {
        average_accuracy_percentage: 86.0,
        meets_70_percent_threshold: true,
        assessment: "Yes" as const,
      },
      qa_section_feedback: {
        total_answers_assessed: 5,
        answers_below_70_percent: 0,
        answers_with_poor_grammar_count: 0,
      },
    },
  };
};

export async function GET(request: Request, { params }: { params: { roomName: string } }) {
  try {
    const { roomName } = params;

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 });
    }

    // In production, fetch real data from the backend agent
    // For now, return mock data for testing
    const interviewSummary = generateMockSummary();

    return NextResponse.json({
      success: true,
      summary: interviewSummary,
      roomName,
    });
  } catch (error) {
    console.error("Failed to fetch interview data:", error);
    return NextResponse.json({ error: "Failed to fetch interview data" }, { status: 500 });
  }
}

// POST endpoint to update interview data from backend agent
export async function POST(request: Request, { params }: { params: { roomName: string } }) {
  try {
    const { roomName } = params;
    const summary = await request.json();

    if (!roomName) {
      return NextResponse.json({ error: "Room name is required" }, { status: 400 });
    }

    // In production, store this in a database
    // For now, just log it
    console.log(`Interview summary for room ${roomName}:`, JSON.stringify(summary, null, 2));

    return NextResponse.json({
      success: true,
      message: "Interview summary stored successfully",
      roomName,
    });
  } catch (error) {
    console.error("Failed to store interview summary:", error);
    return NextResponse.json({ error: "Failed to store interview summary" }, { status: 500 });
  }
}
