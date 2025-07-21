# Grandmaster AI ♟️

Welcome to Grandmaster AI, a sophisticated web-based chess application where you can test your skills against a powerful AI opponent. This project leverages modern web technologies and generative AI to create a rich and educational chess-playing experience. You can find the orignal GitHub repo at [here](https://github.com/Agrannya-Singh/GrandmasterAI)

<img width="1589" height="853" alt="image" src="https://github.com/user-attachments/assets/1cc613da-597d-46b2-911b-9334734c23a1" />


## How to Play

Playing a game is simple and intuitive:

1.  **Start a Game**: When you load the application, a new game starts automatically.
2.  **Choose Your Difficulty**: Select a difficulty level that matches your skill, from "Easy" to "Impossible". The AI's strength is determined by the depth of the Stockfish engine's analysis.
3.  **Make Your Move**: Click on one of your pieces (White) and then click on a legal square to move it.
4.  **AI's Turn**: The AI opponent, powered by Gemini and Stockfish, will analyze the position and make its move.
5.  **Get a Hint**: If you're stuck, click the "Get a Hint" button. Gemini will suggest a strong move for you and highlight it on the board.
6.  **Analyze Your Game**: Once the game is over (checkmate or draw), you can click "Analyze Game". Gemini will provide a detailed breakdown of your strengths, weaknesses, key moments, and an overall assessment of your performance.

## How It's Built

This application combines a modern frontend stack with powerful AI services:

-   **Frontend**: Built with **Next.js**, **React**, and **TypeScript**. Styled with **Tailwind CSS** and **ShadCN UI** for a clean and responsive user interface.
-   **Chess Engine**: The AI opponent uses the **Stockfish API** to determine the best possible move in a given position.
-   **Generative AI**: The "Get a Hint" and "Analyze Game" features are powered by **Google's Gemini API** through **Genkit**. This allows for natural language explanations and deep, insightful game analysis that goes beyond just showing the best move.

## Getting Started

To run this project locally, you'll need Node.js and npm installed. Follow these steps:

1.  **Clone the Repository**
    Open your terminal and run the following command to clone the project to your local machine:
    ```bash
    git clone <repository-url>
    ```
    Navigate into the newly created project directory:
    ```bash
    cd <repository-folder-name>
    ```

2.  **Install Dependencies**
    Install all the necessary project dependencies using npm:
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a new file named `.env` in the root of your project directory. You can do this by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Now, you need to add your Google AI API Key to this file.

4.  **Add Your API Key**
    -   Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   Open the `.env` file you just created and add your key like this:
        ```
        GEMINI_API_KEY="YOUR_API_KEY_HERE"
        ```

5.  **Run the Development Server**
    Start the Next.js development server:
    ```bash
    npm run dev
    ```

You can now open your browser to `http://localhost:9002` and start playing!

## Acknowledgements

This project was made possible by the following amazing technologies and services:

-   **Next.js** - The React Framework for the Web.
-   **ShadCN UI** - Re-usable components built using Radix UI and Tailwind CSS.
-   **Genkit** - An open source framework for building production-ready AI-powered apps.
-   **Google Gemini** - The powerful generative AI model used for hints and analysis.
-   **Stockfish API** - The world's #1 open source chess engine.
-   **Chess.js** - A JavaScript library for chess move generation, validation, and board state management.

A special thank you to the open-source community for providing the tools and libraries that make projects like this possible.
