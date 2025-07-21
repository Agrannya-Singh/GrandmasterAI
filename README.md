# Grandmaster AI ♟️

Welcome to Grandmaster AI, a sophisticated web-based chess application where you can test your skills against a powerful AI opponent. This project leverages modern web technologies and generative AI to create a rich and educational chess-playing experience.

![Grandmaster AI Screenshot](https://placehold.co/800x500.png?text=Grandmaster+AI+Screenshot)

## How to Play

Playing a game is simple and intuitive:

1.  **Start a Game**: When you load the application, a new game starts automatically.
2.  **Choose Your Difficulty**: Select a difficulty level that matches your skill, from "Easy" to "Impossible". The AI's strength is determined by the depth of the Stockfish engine's analysis.
3.  **Make Your Move**: Click on one of your pieces (White) and then click on a legal square to move it.
4.  **AI's Turn**: The AI (Black) will analyze the position and make its move.
5.  **Get a Hint**: If you're stuck, click the "Get a Hint" button. Gemini will suggest a strong move for you and highlight it on the board.
6.  **Analyze Your Game**: Once the game is over (checkmate or draw), you can click "Analyze Game". Gemini will provide a detailed breakdown of your strengths, weaknesses, key moments, and an overall assessment of your performance.

## How It's Built

This application combines a modern frontend stack with powerful AI services:

-   **Frontend**: Built with **Next.js**, **React**, and **TypeScript**. Styled with **Tailwind CSS** and **ShadCN UI** for a clean and responsive user interface.
-   **Chess Engine**: The core AI opponent is powered by the **Stockfish API**. The AI's moves are fetched directly from the engine, providing a formidable challenge at any difficulty level.
-   **Generative AI**: The "Get a Hint" and "Analyze Game" features are powered by **Google's Gemini API** through **Genkit**. This allows for natural language explanations and deep, insightful game analysis that goes beyond just showing the best move.

## Getting Started

To run this project locally, you'll need to set up your environment variables:

1.  **Clone the repository.**
2.  **Install dependencies**: `npm install`
3.  **Create a `.env` file** in the root directory by copying the existing `src/.env` file.
4.  **Add your API Keys**:
    -   `GEMINI_API_KEY`: Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
5.  **Run the development server**: `npm run dev`

Now you can open your browser to `http://localhost:9002` and start playing!
