import { create } from "zustand";
import type { GameState, Question, Teams } from "../game.d";
// import { todoQuestions } from "../Utils/Questions";
import { useAudio } from "../Hooks/useAudio";
import { toast } from "sonner";

const [playCorrect] = useAudio("audioCorrecto")
const [playIncorrect] = useAudio("audioIncorrecto")
const [playNextRound] = useAudio("nextRound")

interface ValuesGameState {
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
}

interface GameStoreProps {
    generateListCuestion: () => void,
    chekingAnswer: (indexAnswer: number) => void,
    checkingWinner: () => void,
    markingStriker: () => void,
    setScoreCurrentTeam: () => void,
    incrementCurrentQuestionIndex: () => void
    setStateFromStorage: (newState: ValuesGameState) => void,
    setCurrentTeam: (team: Teams) => void,
    reset: () => void
}

export const useGameStore = create<ValuesGameState & GameStoreProps>((set, get, store) => ({
    gameState: "init",
    globalScore: 0,
    firstTeamScore: 0,
    secondTeamScore: 0,
    showsingCentralStrikers: false,
    currentQuestionIndex: 0,
    currentTeam: "none",
    listQuestions: [],
    counterStrikers: 0,
    isAnimationSetScore: false,
    setStateFromStorage: (newState) => set(newState),
    generateListCuestion: () => {

        if (!localStorage.getItem("questions")) {
            toast.warning("No hay preguntas para jugar");
            return;
        }

        const todoQuestions: Question[] = JSON.parse(localStorage.getItem("questions") || "[]")

        if (todoQuestions.length < 5) {
            toast.warning("No hay suficiente preguntas para iniciar el juego");
            return;
        }

        const questionsIndex: number[] = [];
        while (questionsIndex.length < 5) {
            const randomIndex = Math.floor(Math.random() * todoQuestions.length);
            if (!questionsIndex.includes(randomIndex)) {
                questionsIndex.push(randomIndex);
            }
        }
        get().reset();
        set({
            listQuestions: questionsIndex.map(index => {
                const { question, answers } = todoQuestions[index];
                return {
                    question,
                    answers: answers.map(a => ({ ...a, revealed: false }))
                }
            }),
            gameState: "playing",
        });

    },
    chekingAnswer: (indexAnswer: number) => {
        const { gameState, listQuestions, currentQuestionIndex, globalScore, currentTeam,
            setScoreCurrentTeam, checkingWinner, incrementCurrentQuestionIndex } = get();

        if (currentTeam === "none") {
            console.log("No hay un team seleccionado");
            return;
        }

        const currentQuestion = listQuestions[currentQuestionIndex];
        if (currentQuestion.answers[indexAnswer].revealed) return;

        currentQuestion.answers[indexAnswer].revealed = true;
        const multiplicador = [1, 1, 2, 2, 3];
        const score = currentQuestion.answers[indexAnswer].score * multiplicador[currentQuestionIndex];
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
            case "round-finished": {
                const allRevealed = currentQuestion.answers.every(ans => ans.revealed);
                if (allRevealed) incrementCurrentQuestionIndex();
                break;
            }
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
    },
    setCurrentTeam: (team: Teams) => set({ currentTeam: team }),
    reset: () => set(store.getInitialState())
}));


useGameStore.subscribe(
    (state) => {
        const stateToStore = {
            gameState: state.gameState,
            globalScore: state.globalScore,
            firstTeamScore: state.firstTeamScore,
            secondTeamScore: state.secondTeamScore,
            showsingCentralStrikers: state.showsingCentralStrikers,
            currentQuestionIndex: state.currentQuestionIndex,
            currentTeam: state.currentTeam,
            listQuestions: state.listQuestions,
            counterStrikers: state.counterStrikers,
            isAnimationSetScore: state.isAnimationSetScore,
        };
        try {
            console.log("Guardando estado en localStorage:");
            localStorage.setItem("game", JSON.stringify(stateToStore));
        } catch (e) {
            console.error("Error al guardar estado en localStorage:", e);
        }
    }
);