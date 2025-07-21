
"use client";

import { useState, useMemo } from 'react';
import { Chess, type Piece, type Square } from 'chess.js';
import { cn } from '@/lib/utils';

interface ChessboardProps {
  board: ReturnType<Chess['board']>;
  onMove: (from: Square, to: Square) => boolean;
  isPlayerTurn: boolean;
  lastMove: [Square, Square] | null;
}

const UNICODE_PIECES: { [key: string]: string } = {
  p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔',
  P: '♟', R: '♜', N: '♞', B: '♝', Q: '♛', K: '♚'
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export function Chessboard({ board, onMove, isPlayerTurn, lastMove }: ChessboardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  
  // A simplified way to get legal moves for UI highlights
  // NOTE: This doesn't account for castling, en passant, etc.
  // A full FEN from the main game state would be needed for perfect accuracy.
  const legalMovesForSelectedPiece = useMemo(() => {
    if (!selectedSquare) return [];
    
    const tempGame = new Chess();
    // This is a simplified reconstruction of the game state. It has limitations.
    tempGame.clear();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        if (board[r][f]) {
          tempGame.put(board[r][f]!, (FILES[f] + RANKS[7 - r]) as Square);
        }
      }
    }
    // Assume it's always white's turn for client-side move validation.
    // The actual turn is managed in the parent component.
    tempGame.load(tempGame.fen().replace(' b ', ' w '));
    
    try {
      const moves = tempGame.moves({ square: selectedSquare, verbose: true });
      return moves.map(move => move.to);
    } catch (e) {
      return [];
    }

  }, [selectedSquare, board]);

  const handleSquareClick = (square: Square) => {
    if (!isPlayerTurn) return;

    const pieceOnSquare = board[7 - RANKS.indexOf(square[1])][FILES.indexOf(square[0])];

    if (selectedSquare) {
      if (square === selectedSquare) {
        // Deselect
        setSelectedSquare(null);
      } else {
        // Try to move
        const moveSuccessful = onMove(selectedSquare, square);
        if (moveSuccessful) {
          setSelectedSquare(null);
        } else if (pieceOnSquare && pieceOnSquare.color === 'w') {
          // Select another white piece
          setSelectedSquare(square);
        } else {
          // Clicked an empty or opponent square that isn't a valid move
          setSelectedSquare(null);
        }
      }
    } else if (pieceOnSquare && pieceOnSquare.color === 'w') {
      // Select a white piece
      setSelectedSquare(square);
    }
  };


  return (
    <div className="grid grid-cols-8 grid-rows-8 aspect-square w-full max-w-[calc(100vh-12rem)] shadow-2xl rounded-md overflow-hidden border-4 border-primary/50">
      {RANKS.slice().reverse().map((rank, rowIndex) =>
        FILES.map((file, colIndex) => {
          const square = `${file}${rank}` as Square;
          const piece = board[rowIndex][colIndex];
          const isLightSquare = (rowIndex + colIndex) % 2 !== 0;
          const isSelected = square === selectedSquare;
          const isLegalMove = legalMovesForSelectedPiece.includes(square);
          const isLastMove = lastMove?.includes(square);

          return (
            <div
              key={square}
              onClick={() => handleSquareClick(square)}
              className={cn(
                'flex items-center justify-center relative',
                isLightSquare ? 'bg-background' : 'bg-primary/20',
                isPlayerTurn && 'cursor-pointer',
              )}
            >
              {piece && (
                <span
                  className={cn(
                    "text-5xl md:text-6xl lg:text-7xl drop-shadow-md transition-transform duration-100 ease-in-out",
                    piece.color === 'w' ? 'text-white' : 'text-foreground',
                    isSelected && "scale-110",
                  )}
                  style={{
                    textShadow: piece.color === 'w' ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(255,255,255,0.2)'
                  }}
                >
                  {UNICODE_PIECES[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]}
                </span>
              )}
              {isSelected && !isLastMove && (
                <div className="absolute inset-0 bg-accent/50" />
              )}
              {isLegalMove && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/4 h-1/4 bg-accent/70 rounded-full" />
                </div>
              )}
              {isLastMove && (
                <div className="absolute inset-0 bg-primary/30" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
