
export type StrikerSize = "small" | "large";
export type Teams = "blue" | "red";
export type GameState = "playing" | "finishing" | "round-finished" | "steal-turn" | "rules"

export type Answer = {
    answer: string;
    score: number;
    revealed: boolean;
}

export type Question = {
    question: string;
    answers: Answer[];
}