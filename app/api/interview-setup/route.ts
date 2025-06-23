import { NextResponse } from "next/server";

// Interview data interface
interface InterviewData {
  candidateName: string;
  role: string;
  skillLevel: string;
  roomName: string;
  participantId?: string;
  predefinedQuestions: string[];
  setupTime: string;
  status: string;
}

// Store interview data in memory (in production, use a database)
const interviewStore = new Map<string, InterviewData>();

// Predefined questions bank for different roles and skill levels
const PREDEFINED_QUESTIONS = {
  "Software Engineer": {
    junior: [
      "Tell me about your experience with programming languages and which ones you're most comfortable with.",
      "How do you approach debugging when your code isn't working as expected?",
      "What's the purpose of version control, and how do you use Git in your workflow?",
      "Describe a challenging project you've worked on and how you overcame obstacles.",
      "How do you stay updated with new technologies and programming trends?",
    ],
    mid: [
      "Explain the SOLID principles and give examples of how you've applied them in your work.",
      "How do you approach testing your code? What types of tests do you write?",
      "Find the second largest element in an array and handle edge cases in your solution.",
      "How would you design a chat application? Consider real-time messaging requirements.",
      "Describe a time when you refactored legacy code. What was your approach and reasoning?",
    ],
    senior: [
      "How do you ensure code quality in a team environment? What processes do you implement?",
      "Design and implement a LRU cache with O(1) operations. Explain your approach.",
      "Design a social media feed system that can handle millions of users efficiently.",
      "How do you approach performance optimization? Give me a specific example from your experience.",
      "Describe a system you designed that had to handle unexpected scale. How did you adapt?",
    ],
    staff: [
      "How do you establish coding standards and practices across multiple teams in an organization?",
      "Design a distributed consistent hashing algorithm for a large-scale system.",
      "Design a global payment processing system with built-in fraud detection mechanisms.",
      "How do you balance innovation with stability in your technical decisions?",
      "Describe how you've influenced technical direction across your organization.",
    ],
  },
  "Frontend Developer": {
    junior: [
      "Explain the difference between var, let, and const in JavaScript.",
      "How do you handle responsive design in your web applications?",
      "What is the virtual DOM and how does it work in React?",
      "How do you optimize website performance for loading speed?",
      "Describe your experience with CSS frameworks and preprocessors.",
    ],
    mid: [
      "Explain the concept of state management in React applications.",
      "How do you handle cross-browser compatibility issues?",
      "What are web accessibility principles and how do you implement them?",
      "Describe your approach to component design and reusability.",
      "How do you optimize bundle size in modern JavaScript applications?",
    ],
    senior: [
      "Design a scalable frontend architecture for a large e-commerce application.",
      "How do you implement efficient data fetching and caching strategies?",
      "Explain micro-frontends architecture and when you would use it.",
      "How do you ensure consistent user experience across different devices and browsers?",
      "Describe your approach to performance monitoring and optimization in production.",
    ],
    staff: [
      "How do you establish frontend development standards across multiple teams?",
      "Design a design system that can be used across different applications and frameworks.",
      "How do you approach progressive web app development for enterprise applications?",
      "Describe your strategy for frontend testing at scale including unit, integration, and e2e tests.",
      "How do you handle internationalization and localization in large applications?",
    ],
  },
  "Backend Developer": {
    junior: [
      "Explain the difference between SQL and NoSQL databases and when to use each.",
      "How do you handle authentication and authorization in web applications?",
      "What is REST and how do you design RESTful APIs?",
      "How do you handle errors and exceptions in your backend code?",
      "Describe your experience with different programming languages for backend development.",
    ],
    mid: [
      "How do you design database schemas for complex business requirements?",
      "Explain caching strategies and when to use different types of caches.",
      "How do you handle database migrations in production environments?",
      "Describe your approach to API versioning and backwards compatibility.",
      "How do you implement rate limiting and prevent API abuse?",
    ],
    senior: [
      "Design a microservices architecture for a large-scale e-commerce platform.",
      "How do you handle distributed transactions and maintain data consistency?",
      "Explain your approach to monitoring and observability in distributed systems.",
      "How do you design for high availability and disaster recovery?",
      "Describe your strategy for handling large-scale data processing and analytics.",
    ],
    staff: [
      "How do you establish backend architecture patterns across an organization?",
      "Design a global content delivery system with multi-region support.",
      "How do you approach database sharding and partitioning strategies?",
      "Describe your approach to building event-driven architectures at scale.",
      "How do you handle technical debt and system migrations in large codebases?",
    ],
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { candidateName, role, skillLevel, roomName, participantId } = body;

    // Validate required fields
    if (!candidateName || !role || !skillLevel || !roomName) {
      return NextResponse.json(
        { error: "Missing required fields: candidateName, role, skillLevel, roomName" },
        { status: 400 }
      );
    }

    // Get predefined questions for the role and skill level
    const questions =
      PREDEFINED_QUESTIONS[role as keyof typeof PREDEFINED_QUESTIONS]?.[
        skillLevel as keyof (typeof PREDEFINED_QUESTIONS)["Software Engineer"]
      ] || PREDEFINED_QUESTIONS["Software Engineer"]["mid"]; // Fallback

    // Select exactly 5 questions
    const selectedQuestions = questions.slice(0, 5);

    // Store interview setup data
    const interviewData = {
      candidateName,
      role,
      skillLevel,
      roomName,
      participantId,
      predefinedQuestions: selectedQuestions,
      setupTime: new Date().toISOString(),
      status: "setup_complete",
    };

    interviewStore.set(roomName, interviewData);

    return NextResponse.json({
      success: true,
      interviewData,
      predefinedQuestions: selectedQuestions,
      message: "Interview setup completed successfully",
    });
  } catch (error) {
    console.error("Interview setup error:", error);
    return NextResponse.json({ error: "Failed to setup interview" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const roomName = url.searchParams.get("roomName");

    if (!roomName) {
      return NextResponse.json({ error: "roomName parameter is required" }, { status: 400 });
    }

    const interviewData = interviewStore.get(roomName);

    if (!interviewData) {
      return NextResponse.json({ error: "Interview data not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      interviewData,
    });
  } catch (error) {
    console.error("Get interview data error:", error);
    return NextResponse.json({ error: "Failed to retrieve interview data" }, { status: 500 });
  }
}

// Export the questions for use in other parts of the application
export { PREDEFINED_QUESTIONS };
