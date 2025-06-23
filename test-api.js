// Simple test script for API endpoints
const BASE_URL = "http://localhost:3000";

async function testInterviewSetup() {
  try {
    console.log("Testing interview setup...");

    const response = await fetch(`${BASE_URL}/api/interview-setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        candidateName: "Test User",
        role: "Software Engineer",
        skillLevel: "mid",
        roomName: "test-room-123",
        participantId: "test-participant",
      }),
    });

    const data = await response.json();
    console.log("Setup response:", data);

    if (data.success) {
      console.log("✅ Interview setup successful");
      console.log("📝 Questions:", data.predefinedQuestions);
    } else {
      console.log("❌ Interview setup failed:", data.error);
    }

    return data;
  } catch (error) {
    console.error("❌ Setup error:", error);
  }
}

async function testInterviewData(roomName) {
  try {
    console.log("\nTesting interview data fetch...");

    const response = await fetch(`${BASE_URL}/api/interview-data/${roomName}`);
    const data = await response.json();

    console.log("Data response:", data);

    if (data.success) {
      console.log("✅ Interview data fetch successful");
      console.log("📊 Summary:", JSON.stringify(data.summary, null, 2));
    } else {
      console.log("❌ Interview data fetch failed:", data.error);
    }

    return data;
  } catch (error) {
    console.error("❌ Data fetch error:", error);
  }
}

async function runTests() {
  console.log("🚀 Starting API tests...\n");

  // Test setup
  const setupData = await testInterviewSetup();

  if (setupData?.success) {
    // Test data fetch
    await testInterviewData("test-room-123");
  }

  console.log("\n✨ Tests completed!");
}

// Run tests if this script is executed directly
if (typeof window === "undefined") {
  runTests();
}

// Export for use in browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = { testInterviewSetup, testInterviewData, runTests };
}
