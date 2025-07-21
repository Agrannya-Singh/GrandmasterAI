
"use client";

import type { AnalyzeGameOutput } from "@/ai/flows/analyze-game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trophy, ShieldAlert, Zap, BarChartBig, BrainCircuit, Activity } from 'lucide-react';

interface GameAnalysisProps {
  analysis: AnalyzeGameOutput;
}

export function GameAnalysis({ analysis }: GameAnalysisProps) {
  if (!analysis) return null;

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-headline text-primary">
          <BrainCircuit className="w-8 h-8"/> AI Game Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                        <BarChartBig className="w-5 h-5" />
                        Overall Assessment
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80 pl-2">
                    {analysis.overallAssessment}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-green-500" />
                        Strengths
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80 pl-2">
                    {analysis.strengths}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        Weaknesses
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80 pl-2">
                    {analysis.weaknesses}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Key Moments
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80 pl-2">
                    {analysis.keyMoments}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
