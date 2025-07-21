"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, RefreshCw } from "lucide-react";
import type { Difficulty } from "@/app/page";

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: string) => void;
  onNewGame: () => void;
  isThinking: boolean;
}

export function GameControls({ difficulty, onDifficultyChange, onNewGame, isThinking }: GameControlsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="difficulty-select" className="flex items-center gap-2 font-semibold">
          <BarChart className="w-4 h-4" />
          Difficulty
        </Label>
        <Select
          value={difficulty}
          onValueChange={onDifficultyChange}
          disabled={isThinking}
          name="difficulty-select"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
            <SelectItem value="Impossible">Impossible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onNewGame} disabled={isThinking} className="w-full">
        <RefreshCw className="mr-2 h-4 w-4" />
        New Game
      </Button>
    </div>
  );
}
