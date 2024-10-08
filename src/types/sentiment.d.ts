// src/types/sentiment.d.ts

declare module 'sentiment' {
  export default class Sentiment {
    constructor(options?: SentimentOptions);
    analyze(text: string): SentimentResult;
  }

  export interface SentimentOptions {
    extras?: { [word: string]: number };
  }

  export interface SentimentResult {
    score: number;
    comparative: number;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  }
}
