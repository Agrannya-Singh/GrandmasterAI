"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Chess, type Square } from 'chess.js';
import { Chessboard } from '@/components/game/Chessboard';
import { GameControls } from '@/components/game/GameControls';
import { MoveHistory } from '@/components/game/MoveHistory';
import { GameAnalysis } from '@/components/game/GameAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeGame, type AnalyzeGameOutput } from '@/ai/flows/analyze-game';
import { suggestMove } from '@/ai/flows/suggest-move';
import { MoveList } from '@/lib/move-list';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Impossible';

const getStockfishDepth = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'Easy':
      return 2;
    case 'Medium':
      return 5;
    case 'Hard':
      return 8;
    case 'Impossible':
      return 15;
    default:
      return 5;
  }
};


export default function Home() {
  const [game, setGame] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState(() => new MoveList());
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [isThinking, setIsThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState('');
  const [lastMove, setLastMove] = useState<[Square, Square] | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeGameOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedMove, setSuggestedMove] = useState<[Square, Square] | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const { toast } = useToast();

  const handleNewGame = useCallback((newDifficulty: Difficulty = difficulty) => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setMoveHistory(new MoveList());
    setLastMove(null);
    setSuggestedMove(null);
    setDifficulty(newDifficulty);
    setAnalysis(null);
    setIsAnalyzing(false);
    updateGameStatus(newGame);
    toast({
      title: "New Game Started",
      description: `Difficulty set to ${newDifficulty}. Good luck!`,
    });
  }, [difficulty, toast]);

  const updateGameStatus = useCallback((currentGame: Chess) => {
    let status = '';
    if (currentGame.isCheckmate()) {
      status = `Checkmate! ${currentGame.turn() === 'w' ? 'Black' : 'White'} wins.`;
    } else if (currentGame.isDraw()) {
      status = 'Draw!';
    } else if (currentGame.isStalemate()) {
      status = 'Stalemate!';
    } else if (currentGame.isThreefoldRepetition()) {
      status = 'Draw by threefold repetition!';
    } else if (currentGame.isInsufficientMaterial()) {
      status = 'Draw by insufficient material!';
    } else {
      status = `${currentGame.turn() === 'w' ? 'White' : 'Black'} to move.`;
      if (currentGame.inCheck()) {
        status += ' (in Check)';
      }
    }
    setGameStatus(status);
  }, []);

  const handleMove = useCallback((from: Square, to: Square): boolean => {
    if (game.turn() !== 'w' || isThinking) return false;

    const gameCopy = new Chess(game.fen());
    
    const piece = gameCopy.get(from);
    const isPromotion =
      piece?.type === 'p' &&
      ((piece.color === 'w' && from[1] === '7' && to[1] === '8') ||
       (piece.color === 'b' && from[1] === '2' && to[1] === '1'));
    
    const move = gameCopy.move({
      from,
      to,
      promotion: isPromotion ? 'q' : undefined,
    });

    if (move === null) {
      return false;
    }

    setMoveHistory(currentHistory => currentHistory.append(move.san));
    
    setGame(gameCopy);
    setFen(gameCopy.fen());
    setLastMove([move.from, move.to]);
    setSuggestedMove(null); // Clear hint after move
    updateGameStatus(gameCopy);
    return true;
  }, [game, isThinking, updateGameStatus]);
  
  const handleAnalyzeGame = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const historyString = moveHistory.toString();
      const result = await analyzeGame({ gameHistory: historyString });
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing game:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing the game.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSuggestMove = async () => {
    if (game.turn() !== 'w' || isThinking || isSuggesting) return;
    setIsSuggesting(true);
    setSuggestedMove(null);
    try {
      const result = await suggestMove({ fen: game.fen() });
      const from = result.move.substring(0, 2) as Square;
      const to = result.move.substring(2, 4) as Square;
      
      const gameCopy = new Chess(game.fen());
      const legalMoves = gameCopy.moves({verbose: true}).map(m => m.from + m.to);

      if (legalMoves.includes(from + to)) {
        setSuggestedMove([from, to]);
        toast({
          title: "AI Suggestion",
          description: result.reasoning,
        });
      } else {
        throw new Error("AI suggested an illegal move.");
      }

    } catch (error) {
      console.error("Error suggesting move:", error);
      toast({
        variant: "destructive",
        title: "Hint Failed",
        description: "There was an error getting a move suggestion.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };


  useEffect(() => {
    const makeAiMove = async () => {
      if (game.turn() !== 'b' || game.isGameOver()) return;

      setIsThinking(true);
      
      let moveResult = null;
      const gameCopy = new Chess(game.fen());

      const availableMoves = gameCopy.moves({ verbose: true });
      if (availableMoves.length === 0) {
        setIsThinking(false);
        return;
      }
      
      try {
        const depth = getStockfishDepth(difficulty);
        const fen = gameCopy.fen();
        const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=${depth}`);
        if (!response.ok) {
          throw new Error(`Stockfish API returned status ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success && data.bestmove) {
          const bestMove = data.bestmove.split(' ')[1];
          moveResult = gameCopy.move(bestMove, {sloppy: true});
        } else {
          throw new Error(data.data || "Stockfish API returned success: false or no bestmove");
        }
        
        if (!moveResult) {
          console.warn("Stockfish suggested an invalid move:", data.bestmove, ". Falling back to a valid move.");
          const fallbackMove = availableMoves[0];
          moveResult = gameCopy.move(fallbackMove);
        }
      } catch (error) {
        console.error("Error getting Stockfish move:", error);
        const fallbackMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        moveResult = gameCopy.move(fallbackMove);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "The AI failed to make a move. A random move was made instead.",
        });
      }

      if (moveResult) {
        setMoveHistory(currentHistory => currentHistory.append(moveResult!.san));

        setGame(gameCopy);
        setFen(gameCopy.fen());
        setLastMove([moveResult.from, moveResult.to]);
        updateGameStatus(gameCopy);
      }
      setIsThinking(false);
    };

    if (game.turn() === 'b' && !game.isGameOver()) {
      const timer = setTimeout(makeAiMove, 500);
      return () => clearTimeout(timer);
    }
  }, [fen, game, difficulty, updateGameStatus, toast]);

  useEffect(() => {
    handleNewGame('Medium');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const board = useMemo(() => game.board(), [fen]);

  const isGameOver = useMemo(() => game.isGameOver(), [game]);

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        <div className="flex-grow flex flex-col items-center gap-4">
          <h1 className="text-4xl font-headline font-bold text-center text-primary-foreground bg-primary py-2 px-6 rounded-lg shadow-md">
            Grandmaster AI
          </h1>
          <Chessboard
            board={board}
            onMove={handleMove}
            isPlayerTurn={game.turn() === 'w' && !isThinking}
            lastMove={lastMove}
            suggestedMove={suggestedMove}
          />
           {analysis && !isAnalyzing && (
            <div className="w-full mt-4">
              <GameAnalysis analysis={analysis} />
            </div>
          )}
        </div>

        <aside className="w-full lg:w-80 flex-shrink-0">
          <Card className="shadow-lg sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                <Bot /> Game Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-lg font-semibold p-4 bg-secondary rounded-md">
                {isThinking ? 'AI is thinking...' : gameStatus}
              </div>

              <Separator />

              <GameControls
                difficulty={difficulty}
                onDifficultyChange={(newDiff) => handleNewGame(newDiff as Difficulty)}
                onNewGame={() => handleNewGame()}
                isThinking={isThinking}
                isGameOver={isGameOver}
                onAnalyze={handleAnalyzeGame}
                isAnalyzing={isAnalyzing}
                onSuggestMove={handleSuggestMove}
                isSuggesting={isSuggesting}
                isPlayerTurn={game.turn() === 'w'}
              />

              <Separator />

              <MoveHistory history={moveHistory} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
