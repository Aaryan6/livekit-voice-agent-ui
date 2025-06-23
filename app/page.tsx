"use client";

import InterviewProgress, {
  InterviewProgress as IInterviewProgress,
} from "@/components/InterviewProgress";
import { InterviewSummary as IInterviewSummary } from "@/components/InterviewSummary";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import TranscriptionView from "@/components/TranscriptionView";
import UserInfoForm, { UserInfo } from "@/components/UserInfoForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { Room, RoomEvent } from "livekit-client";
import { Clock, FileText, Mic, MicOff, X } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import type { ConnectionDetails } from "./api/connection-details/route";

export default function Page() {
  const [room] = useState(new Room());
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [interviewSummary, setInterviewSummary] = useState<IInterviewSummary | null>(null);

  const onConnectButtonClicked = useCallback(
    async (userData: UserInfo) => {
      const url = new URL(
        process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
        window.location.origin
      );

      // Add user info as query parameters
      url.searchParams.set("name", userData.name);
      url.searchParams.set("skillLevel", userData.skillLevel);
      url.searchParams.set("role", userData.role);
      if (userData.experience) {
        url.searchParams.set("experience", userData.experience);
      }

      const response = await fetch(url.toString());
      const connectionDetailsData: ConnectionDetails = await response.json();

      // Store interview setup data
      await fetch("/api/interview-setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateName: userData.name,
          role: userData.role,
          skillLevel: userData.skillLevel,
          roomName: connectionDetailsData.roomName,
          participantId: connectionDetailsData.participantName,
        }),
      });

      await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
      await room.localParticipant.setMicrophoneEnabled(true);
      setUserInfo(userData);
    },
    [room]
  );

  const handleInterviewComplete = useCallback(async (roomName: string) => {
    try {
      // Fetch interview summary
      const response = await fetch(`/api/interview-data/${roomName}`);
      const data = await response.json();

      if (data.success) {
        setInterviewSummary(data.summary);
        setInterviewCompleted(true);
      }
    } catch (error) {
      console.error("Failed to fetch interview summary:", error);
    }
  }, []);

  const handleRetakeInterview = useCallback(() => {
    setInterviewCompleted(false);
    setInterviewSummary(null);
    setUserInfo(null);
    room.disconnect();
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    // Listen for interview updates and completion
    room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        if (data.type === "interview_complete") {
          setInterviewSummary(data.summary);
          setInterviewCompleted(true);
        }
      } catch (error) {
        // Ignore parsing errors for non-JSON data
      }
    });

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room, handleInterviewComplete]);

  // Show interview summary if completed
  if (interviewCompleted && interviewSummary) {
    return (
      <div data-lk-theme="default" className="min-h-screen bg-background">
        <IInterviewSummary
          summary={interviewSummary}
          onRetake={handleRetakeInterview}
          onExport={() => {
            // Export functionality
            const dataStr = JSON.stringify(interviewSummary, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `interview-summary-${new Date().toISOString().split("T")[0]}.json`;
            link.click();
          }}
        />
      </div>
    );
  }

  return (
    <div data-lk-theme="default" className="flex h-screen bg-background">
      {!userInfo ? (
        <UserInfoForm onSubmit={onConnectButtonClicked} />
      ) : (
        <RoomContext.Provider value={room}>
          <AIInterviewInterface />
          <RoomAudioRenderer />
        </RoomContext.Provider>
      )}
    </div>
  );
}

function AIInterviewInterface() {
  const { state: agentState, audioTrack } = useVoiceAssistant();
  const room = useContext(RoomContext);
  const [interviewProgress, setInterviewProgress] = useState<IInterviewProgress>({
    currentStage: "welcome",
    questionsAsked: 0,
    totalQuestions: 5,
    currentQuestionIndex: 0,
    elapsedTime: 0,
    candidateSpeakingTime: 0,
  });

  const [startTime] = useState(Date.now());
  const [isInterviewActive, setIsInterviewActive] = useState(true);

  const isRecording = agentState === "listening";
  const isConnected = agentState !== "disconnected";

  // Listen for progress updates from agent
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        if (data.type === "progress_update") {
          setInterviewProgress({
            currentStage: data.current_stage,
            questionsAsked: data.questions_asked,
            totalQuestions: data.total_questions,
            currentQuestionIndex: data.current_question_index,
            elapsedTime: data.elapsed_time,
            candidateSpeakingTime: data.candidate_speaking_time,
          });

          if (data.current_stage === "completed") {
            setIsInterviewActive(false);
          }
        }
      } catch (error) {
        // Ignore parsing errors for non-JSON data
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  // Update elapsed time (fallback for when no agent updates are received)
  useEffect(() => {
    if (!isInterviewActive) return;

    const interval = setInterval(() => {
      setInterviewProgress((prev) => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isInterviewActive]);

  return (
    <>
      {/* Left Sidebar */}
      <div className="w-full max-w-sm bg-slate-900 border-r border-slate-800 flex flex-col">
        {/* Audio Visualizer */}
        <div className="p-6">
          <h2 className="text-white text-lg font-semibold mb-4">Audio Activity</h2>
          <div className="h-[200px] w-full flex items-center justify-center">
            <BarVisualizer
              state={agentState}
              barCount={5}
              trackRef={audioTrack}
              color="white"
              className="w-full h-full bg-transparent"
              options={{
                minHeight: 24,
                maxHeight: 60,
              }}
            />
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex-1 p-6 flex flex-col justify-center items-center space-y-6">
          <AnimatePresence mode="wait">
            {!isConnected ? (
              <motion.div
                key="disconnected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                  <Mic className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-gray-400 text-sm font-medium">Interview Starting...</span>
              </motion.div>
            ) : (
              <motion.div
                key="connected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-4"
              >
                {/* Microphone Button */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-teal-600 hover:bg-teal-700 transition-all duration-200 flex items-center justify-center">
                    {isRecording ? (
                      <MicOff className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </div>
                  {isRecording && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>

                <span className="text-white text-sm font-medium">
                  {isRecording ? "Listening..." : "Speak clearly"}
                </span>

                {/* Voice Assistant Controls */}
                <div className="flex items-center space-x-2">
                  <VoiceAssistantControlBar controls={{ leave: false }} />
                  <DisconnectButton className="!bg-transparent !border-none">
                    <Button variant="outline" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </DisconnectButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
            />
            <span className="text-slate-400 text-xs">
              {isConnected ? "AI Agent Active" : "AI Agent Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Center Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Technical Interview Session</h1>
              <p className="text-muted-foreground text-sm">AI-powered structured interview</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {Math.floor(interviewProgress.elapsedTime / 60)}:
                  {(interviewProgress.elapsedTime % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{interviewProgress.questionsAsked}/5</span>
              </div>
              <Badge
                variant="outline"
                className={
                  isConnected
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }
              >
                {isConnected ? "Live Session" : "Disconnected"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {isConnected ? (
              <TranscriptionView />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center">
                  Connect to start your interview session and see the conversation here.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Progress & Feedback */}
      <div className="w-80 bg-muted border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Interview Dashboard</h2>
        </div>

        <ScrollArea className="flex-1 p-4 space-y-4">
          {/* Interview Progress */}
          <InterviewProgress progress={interviewProgress} />

          {/* Interview Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Interview Tips
            </h3>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Take time to think before answering</li>
              <li>• Use proper grammar and full sentences</li>
              <li>• Be specific with examples</li>
              <li>• Ask for clarification if needed</li>
            </ul>
          </div>
        </ScrollArea>
      </div>

      <NoAgentNotification state={agentState} />
    </>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}
