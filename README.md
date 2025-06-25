<img src="./.github/assets/app-icon.png" alt="Voice Assistant App Icon" width="100" height="100">

# Voice Agent Bot - UI Frontend

This is a Next.js application that provides a web interface for the voice agent bot, featuring real-time conversation and code editing capabilities.

## Features

- **Real-time Voice Interaction**: Connect with AI agents for voice-based conversations
- **Code Editor Integration**: Interactive code editor with syntax highlighting for multiple languages
- **Live Transcription**: Real-time display of conversation transcripts
- **User Authentication**: User info collection and session management

## Pages

### Main Interview Page (`/`)

The main interface for conducting AI-powered interview sessions with voice interaction and code editing capabilities.

### Code Interpreter Test Page (`/code-interpreter-test`)

A dedicated testing page for the code editor component that includes:

- **Sample Questions**: Pre-defined programming questions across different categories:

  - Data Structures (linked lists, binary trees, hash tables)
  - Algorithms (binary search, sorting, graph algorithms)
  - String Manipulation (anagrams, compression, permutations)
  - Dynamic Programming (coin change, LCS, knapsack)

- **Custom Questions**: Input your own programming challenges
- **Multi-language Support**: JavaScript, TypeScript, Python, Java, C++, Go, Rust
- **Submission History**: Track and review all code submissions
- **Code Templates**: Auto-generated starter code for each language

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing the Code Interpreter

To test the code interpreter functionality:

1. Navigate to `/code-interpreter-test` in your browser
2. Either select a pre-defined question or enter a custom one
3. Choose your preferred programming language
4. Click "Open Editor" to launch the code editor
5. Write your solution and optionally add an explanation
6. Submit your code and view it in the submissions history

## Project Structure

```
├── app/
│   ├── page.tsx                    # Main interview interface
│   ├── code-interpreter-test/
│   │   └── page.tsx               # Code interpreter test page
│   └── api/
│       └── connection-details/
├── components/
│   ├── CodeEditor.tsx             # Monaco-based code editor
│   ├── TranscriptionView.tsx      # Real-time transcription display
│   ├── UserInfoForm.tsx           # User information collection
│   └── ui/                        # Reusable UI components
└── hooks/
    └── ...                        # Custom React hooks
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **LiveKit** - Real-time communication platform
- **Monaco Editor** - VS Code editor in the browser
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_CONN_DETAILS_ENDPOINT=/api/connection-details
```

## Contributing

This template is open source and we welcome contributions! Please open a PR or issue through GitHub, and don't forget to join us in the [LiveKit Community Slack](https://livekit.io/join-slack)!
