import { create } from "zustand";
import type { GameState, Question, Teams } from "../game.d";
import { todoQuestions } from "../Utils/Questions";
import { useAudio } from "../Hooks/useAudio";

const [playCorrect] = useAudio("audioCorrecto")
const [playIncorrect] = useAudio("audioIncorrecto")
const [playNextRound] = useAudio("nextRound")


type GameStoreProps = {
    gameState: GameState,
    globalScore: number;
    firstTeamScore: number;
    secondTeamScore: number;
    showsingCentralStrikers: boolean,
    currentQuestionIndex: number,
    currentTeam: Teams,
    listQuestions: Question[],
    counterStrikers: number,
    isAnimationSetScore: boolean,
    generateListCuestion: () => void,
    chekingAnswer: (indexAnswer: number) => void,
    checkingWinner: () => void,
    markingStriker: () => void,
    setScoreCurrentTeam: () => void,
    incrementCurrentQuestionIndex: () => void
}

export const useGameStore = create<GameStoreProps>((set, get) => ({
    gameState: "rules",
    globalScore: 0,
    firstTeamScore: 0,
    secondTeamScore: 0,
    showsingCentralStrikers: false,
    currentQuestionIndex: 0,
    currentTeam: "blue",
    listQuestions: [],
    counterStrikers: 0,
    isAnimationSetScore: false,
    generateListCuestion: () => {
        const questionsIndex: number[] = [];
        while (questionsIndex.length < 5) {
            const randomIndex = Math.floor(Math.random() * todoQuestions.length);
            if (!questionsIndex.includes(randomIndex)) {
                questionsIndex.push(randomIndex);
            }
        }
        set({ listQuestions: questionsIndex.map(index => todoQuestions[index]), gameState: "playing" });
    },
    chekingAnswer: (indexAnswer: number) => {
        const { gameState, listQuestions, currentQuestionIndex, globalScore,
            setScoreCurrentTeam, checkingWinner, incrementCurrentQuestionIndex } = get();
        const currentQuestion = listQuestions[currentQuestionIndex];
        if (currentQuestion.answers[indexAnswer].revealed) return;

        currentQuestion.answers[indexAnswer].revealed = true;
        const score = currentQuestion.answers[indexAnswer].score;
        set({ listQuestions: listQuestions.map((question, index) => index === currentQuestionIndex ? currentQuestion : question) })


        playCorrect();
        switch (gameState) {
            case "playing":
                set({ globalScore: globalScore + score })
                checkingWinner();
                break;
            case "steal-turn":
                set({ globalScore: globalScore + score, gameState: "round-finished" })
                setScoreCurrentTeam();
                setTimeout(() => set({ isAnimationSetScore: false }), 5000)
                break;
            case "round-finished":
                const allRevealed = currentQuestion.answers.every(ans => ans.revealed);
                if (allRevealed) incrementCurrentQuestionIndex();
                break;
        }
    },
    checkingWinner: () => {
        const { listQuestions, currentQuestionIndex, setScoreCurrentTeam, incrementCurrentQuestionIndex } = get();

        const currentQuestion = listQuestions[currentQuestionIndex];
        const allRevealed = currentQuestion.answers.every(ans => ans.revealed);

        if (allRevealed) {
            setScoreCurrentTeam();
            incrementCurrentQuestionIndex();
            return;
        }
    },
    markingStriker: () => {
        const { counterStrikers, currentTeam, gameState, setScoreCurrentTeam } = get();

        playIncorrect();
        if (gameState === "steal-turn") {
            const nextTeam = currentTeam === "blue" ? "red" : "blue";
            set({
                currentTeam: nextTeam,
                showsingCentralStrikers: true,
                counterStrikers: 1,
                gameState: "round-finished" // termina la ronda, se muestran las respuestas no adivinadas
            })
            setScoreCurrentTeam();
            setTimeout(() => set({ isAnimationSetScore: false, counterStrikers: 0 }), 5000)
            setTimeout(() => set({ showsingCentralStrikers: false }), 1500);
            return;
        }

        const newCounterStrikers = counterStrikers + 1;
        if (newCounterStrikers === 3) {
            const nextTeam = currentTeam === "blue" ? "red" : "blue";
            set({
                currentTeam: nextTeam,
                showsingCentralStrikers: true,
                counterStrikers: newCounterStrikers,
                gameState: "steal-turn" // ==> se cambia a robo de puntos
            })
            setTimeout(() => set({ showsingCentralStrikers: false }), 1500);
            return;
        }

        if (newCounterStrikers >= 4) return;

        set({ counterStrikers: newCounterStrikers, showsingCentralStrikers: true })
        setTimeout(() => set({ showsingCentralStrikers: false }), 1500);
    },
    setScoreCurrentTeam: () => {
        const { currentTeam, firstTeamScore, secondTeamScore, globalScore } = get();

        if (currentTeam === "blue") {
            set({ firstTeamScore: firstTeamScore + globalScore, globalScore: 0 });
        } else {
            set({ secondTeamScore: secondTeamScore + globalScore, globalScore: 0 });
        }
        set({ isAnimationSetScore: true });
        console.log("Iniciando animación");

    },
    incrementCurrentQuestionIndex: () => {
        const { currentQuestionIndex } = get();

        const newQuestionIndex = currentQuestionIndex + 1;
        if (newQuestionIndex < 5) {
            console.log("Pregunta", currentQuestionIndex + 1);
            setTimeout(() => {
                playNextRound();
                set({ currentQuestionIndex: newQuestionIndex, counterStrikers: 0, gameState: "playing", isAnimationSetScore: false })
            }, 5000)
            return;
        }

        console.log("Juego finalizado");
        setTimeout(() => set({ isAnimationSetScore: false }), 5000)
        set({ gameState: "finishing", counterStrikers: 0 })
    }
}));