"use client";

import { useState, useMemo } from 'react';
import { Chess, type Piece, type Square } from 'chess.js';
import { cn } from '@/lib/utils';

interface ChessboardProps {
  board: (Piece | null)[][];
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
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);

  const handleSquareClick = (square: Square, piece: Piece | null) => {
    if (!isPlayerTurn) return;

    if (selectedSquare) {
      if (square === selectedSquare) {
        // Deselect
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        // Try to move
        const moveSuccessful = onMove(selectedSquare, square);
        if (moveSuccessful) {
          setSelectedSquare(null);
          setLegalMoves([]);
        } else if (piece && piece.color === 'w') {
          // Select another white piece
          selectPiece(square);
        } else {
          // Clicked an empty or opponent square not a valid move
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    } else if (piece && piece.color === 'w') {
      selectPiece(square);
    }
  };

  const selectPiece = (square: Square) => {
    setSelectedSquare(square);
    // This is a bit of a hack to get legal moves without the full game state.
    // It's not perfect but works for UI feedback.
    const tempChess = new Chess();
    try {
      // This part is tricky as we only have the board, not the full FEN.
      // A full FEN is needed for perfect legal move calculation (castling rights, en passant).
      // We'll make a simplified FEN. This is a known limitation for this component.
      const simpleFen = tempChess.boardToFen(board);
      tempChess.load(simpleFen);
      const moves = tempChess.moves({ square, verbose: true });
      setLegalMoves(moves.map((move: any) => move.to));
    } catch (e) {
      console.error("Could not determine legal moves:", e);
      setLegalMoves([]);
    }
  }

  const boardWithCoords = useMemo(() => {
    return board.map((row, rowIndex) =>
      row.map((piece, colIndex) => {
        const rank = RANKS[7 - rowIndex];
        const file = FILES[colIndex];
        const square = `${file}${rank}` as Square;
        return { piece, square, rowIndex, colIndex };
      })
    ).flat();
  }, [board]);

  return (
    <div className="grid grid-cols-8 grid-rows-8 aspect-square w-full max-w-[calc(100vh-12rem)] shadow-2xl rounded-md overflow-hidden border-4 border-primary/50">
      {boardWithCoords.map(({ piece, square, rowIndex, colIndex }) => {
        const isLightSquare = (rowIndex + colIndex) % 2 !== 0;
        const isSelected = square === selectedSquare;
        const isLegalMove = legalMoves.includes(square);
        const isLastMove = lastMove?.includes(square);

        return (
          <div
            key={square}
            onClick={() => handleSquareClick(square, piece)}
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
            {isSelected && (
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
      })}
    </div>
  );
}
