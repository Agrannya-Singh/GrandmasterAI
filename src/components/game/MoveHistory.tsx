"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { History } from "lucide-react";

interface MoveHistoryProps {
  history: string[];
}

export function MoveHistory({ history }: MoveHistoryProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold flex items-center gap-2">
        <History className="w-4 h-4" />
        Move History
      </h3>
      <ScrollArea className="h-48 w-full rounded-md border bg-secondary/50 p-2">
        {history.length === 0 ? (
          <p className="text-muted-foreground text-center p-4">No moves yet.</p>
        ) : (
          <ol className="text-sm">
            {history.reduce((acc, move, index) => {
              if (index % 2 === 0) {
                acc.push([move]);
              } else {
                acc[acc.length - 1].push(move);
              }
              return acc;
            }, [] as string[][]).map((pair, index) => (
              <li key={index} className="flex items-center gap-4 p-1 rounded-md hover:bg-accent/50">
                <span className="font-mono text-muted-foreground">{index + 1}.</span>
                <span className="w-16 font-semibold">{pair[0]}</span>
                {pair[1] && <span className="w-16 font-semibold text-muted-foreground">{pair[1]}</span>}
              </li>
            ))}
          </ol>
        )}
      </ScrollArea>
    </div>
  );
}
