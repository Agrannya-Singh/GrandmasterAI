
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import type { MoveList } from "@/lib/move-list";

interface MoveHistoryProps {
  history: MoveList;
}

export function MoveHistory({ history }: MoveHistoryProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const moves = useMemo(() => history.toArray(), [history]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [moves]);

  return (
    <div className="space-y-2">
      <h3 className="font-semibold flex items-center gap-2">
        <History className="w-4 h-4" />
        Move History
      </h3>
      <ScrollArea className="h-48 w-full rounded-md border bg-secondary/50 p-2" ref={scrollAreaRef}>
        {moves.length === 0 ? (
          <p className="text-muted-foreground text-center p-4">No moves yet.</p>
        ) : (
          <ol className="text-sm font-mono">
            {moves.reduce((acc, move, index) => {
              if (index % 2 === 0) {
                acc.push([move]);
              } else {
                acc[acc.length - 1].push(move);
              }
              return acc;
            }, [] as string[][]).map((pair, index) => (
              <li key={index} className="grid grid-cols-[auto_1fr_1fr] items-center gap-4 p-1 rounded-md hover:bg-accent/50">
                <span className="text-muted-foreground">{index + 1}.</span>
                <span className="font-semibold">{pair[0]}</span>
                {pair[1] && <span className="font-semibold text-muted-foreground">{pair[1]}</span>}
              </li>
            ))}
          </ol>
        )}
      </ScrollArea>
    </div>
  );
}
