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
    // currentQuestionIndex: number,
    currentTeam: Teams,
    // listQuestions: Question[],
    counterStrikers: number,
    isAnimationSetScore: boolean,
    currentIndexQuestionSelected: number | null
    currentQuestion: Question | null
    countRound: number,
}

interface GameStoreProps {
    // generateListCuestion: () => void,
    initGame: () => void
    chekingAnswer: (indexAnswer: number) => void,
    checkingWinner: () => void,
    markingStriker: () => void,
    setScoreCurrentTeam: () => void,
    incrementCurrentQuestionIndex: () => void
    setStateFromStorage: (newState: ValuesGameState) => void,
    setCurrentTeam: (team: Teams) => void,
    reset: () => void,
    setIndexQuestionSelected: (index: number) => void,
    setGameState: (state: GameState) => void,
    stealScore: () => void,
    resetStriker: () => void
}

export const useGameStore = create<ValuesGameState & GameStoreProps>((set, get, store) => ({
    currentIndexQuestionSelected: null,
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
    currentQuestion: null,
    countRound: 0,
    setStateFromStorage: (newState) => set(newState),
    setIndexQuestionSelected: (index: number) => {

        const { gameState, currentQuestion } = get();

        const answers = currentQuestion?.answers ?? [];

        // Verificar respuestas reveladas
        const anyRevealed = answers.some(a => a.revealed);        // Al menos una revelada
        const allRevealed = answers.every(a => a.revealed);

        if (!anyRevealed) {
            set({ currentIndexQuestionSelected: index, gameState: "init" })
            return;
        }

        if (["playing"].includes(gameState)) {
            toast.warning("Termine la ronda actual para seleccionar una nueva pregunta")
            return;
        }

        if (!allRevealed && gameState === "round-finished") {
            toast.warning("No se han revelado todas las respuestas");
            return;
        }

        set({ currentIndexQuestionSelected: index })
    },
    initGame: () => {
        const { currentIndexQuestionSelected } = get();

        if (!localStorage.getItem("questions")) {
            toast.warning("No hay preguntas para jugar");
            return;
        }

        if (currentIndexQuestionSelected === null) {
            toast.warning("Seleccione una pregunta para iniciar el juego");
            return
        }

        // get().reset();

        const todoQuestions: Question[] = JSON.parse(localStorage.getItem("questions") || "[]")

        set({ gameState: "playing", currentQuestion: todoQuestions[currentIndexQuestionSelected] })
    },
    chekingAnswer: (indexAnswer: number) => {
        const { gameState, currentQuestion, countRound, globalScore, checkingWinner } = get();

        // if (currentTeam === "none") {
        //     toast.warning("No hay un equipo seleccionado");
        //     return;
        // }

        if (currentQuestion == null) {
            console.log("No hay una pregunta seleccionada", "chekingAnswer()");
            return
        }

        if (gameState === "init") {
            toast.warning("Inicie el juego para revelar la respuesta");
            return
        }

        // const currentQuestion = listQuestions[currentQuestionIndex];
        if (currentQuestion.answers[indexAnswer].revealed) return;

        currentQuestion.answers[indexAnswer].revealed = true;
        const multiplicador = [1, 1, 2, 2, 3];
        const score = currentQuestion.answers[indexAnswer].score * multiplicador[countRound];
        set({ currentQuestion: currentQuestion })

        playCorrect();
        switch (gameState) {
            case "playing":
                set({ globalScore: globalScore + score })
                checkingWinner();
                break;
            case "steal-turn":
                set({ globalScore: globalScore + score, gameState: "round-finished" })
                // setScoreCurrentTeam();
                setTimeout(() => set({ isAnimationSetScore: false }), 5000)
                break;
            case "round-finished": {
                const allRevealed = currentQuestion.answers.every(ans => ans.revealed);
                if (allRevealed) set({ currentIndexQuestionSelected: null })
                break;
            }
        }
    },
    checkingWinner: () => {
        const { currentQuestion } = get();

        if (currentQuestion === null) {
            console.log("No hay una pregunta seleccionada", "checkingWinner()");
            return
        }

        const allRevealed = currentQuestion.answers.every(ans => ans.revealed);

        if (allRevealed) {
            // setScoreCurrentTeam();
            // incrementCurrentQuestionIndex();
            return;
        }
    },
    markingStriker: () => {
        const { counterStrikers, currentTeam, gameState } = get();

        playIncorrect();
        if (gameState === "steal-turn") {
            // const nextTeam = currentTeam === "blue" ? "red" : "blue";
            set({
                currentTeam: currentTeam,
                showsingCentralStrikers: true,
                counterStrikers: 1,
                gameState: "round-finished" // termina la ronda, se muestran las respuestas no adivinadas
            })
            // setScoreCurrentTeam();
            setTimeout(() => set({ isAnimationSetScore: false, counterStrikers: 0 }), 5000)
            setTimeout(() => set({ showsingCentralStrikers: false }), 1500);
            return;
        }

        const newCounterStrikers = counterStrikers + 1;
        if (newCounterStrikers === 3) {
            // const nextTeam = currentTeam === "blue" ? "red" : "blue";
            set({
                currentTeam: currentTeam,
                showsingCentralStrikers: true,
                counterStrikers: newCounterStrikers,
                gameState: "steal-turn" // ==> se cambia a robo de puntos
            })
            setTimeout(() => set({ showsingCentralStrikers: false }), 1500);
            return;
        }

        if (newCounterStrikers >= 4) {
            console.log("Los strikers son 4, no se hace nada");
            return;
        }

        set({ counterStrikers: newCounterStrikers, showsingCentralStrikers: true })
        setTimeout(() => set({ showsingCentralStrikers: false }), 1500);
    },
    setScoreCurrentTeam: () => {
        const { currentTeam, firstTeamScore, secondTeamScore, globalScore } = get();

        if (currentTeam === "none") {
            toast.warning("No hay un equipo seleccionado");
            return;
        }

        if (currentTeam === "blue") {
            set({ firstTeamScore: firstTeamScore + globalScore, globalScore: 0 });
        } else {
            set({ secondTeamScore: secondTeamScore + globalScore, globalScore: 0 });
        }
        set({ isAnimationSetScore: true });
        console.log("Iniciando animación");

    },
    incrementCurrentQuestionIndex: () => {
        const { countRound, currentQuestion, currentIndexQuestionSelected } = get();

        const allRevealed = currentQuestion?.answers.every(ans => ans.revealed);

        if (!allRevealed) {
            toast.warning("No se han revelado todas las respuestas");
            return
        }

        if (currentIndexQuestionSelected === null) {
            toast.warning("No se ha seleccionado una pregunta");
            return;
        }

        const todoQuestions: Question[] = JSON.parse(localStorage.getItem("questions") || "[]")

        const newQuestionIndex = countRound + 1;
        if (newQuestionIndex < 5) {
            console.log("Pregunta", countRound + 1);
            playNextRound();
            set({
                countRound: newQuestionIndex, counterStrikers: 0, currentQuestion: todoQuestions[currentIndexQuestionSelected],
                gameState: "playing", isAnimationSetScore: false
            })
            setTimeout(() => {
            }, 5000)
            return;
        }

        console.log("Juego finalizado");
        setTimeout(() => set({ isAnimationSetScore: false }), 5000)
        set({ gameState: "finishing", counterStrikers: 0 })
    },
    setCurrentTeam: (team: Teams) => {

        set({ currentTeam: team });
        get().checkingWinner();
    },
    reset: () => set(store.getInitialState()),
    setGameState: (state: GameState) => set({ gameState: state }),
    resetStriker: () => set({ counterStrikers: 0 }),
    stealScore: () => {
        const { currentTeam } = get();

        if (currentTeam === "none") {
            toast.warning("No hay un equipo seleccionado");
            return;
        }

        const nextTeam = currentTeam === "blue" ? "red" : "blue";
        set({ gameState: "steal-turn", currentTeam: nextTeam })
    }
}));


useGameStore.subscribe(
    (state) => {
        const stateToStore = {
            gameState: state.gameState,
            globalScore: state.globalScore,
            firstTeamScore: state.firstTeamScore,
            secondTeamScore: state.secondTeamScore,
            showsingCentralStrikers: state.showsingCentralStrikers,
            // currentQuestionIndex: state.currentQuestionIndex,
            currentTeam: state.currentTeam,
            currentQuestion: state.currentQuestion,
            counterStrikers: state.counterStrikers,
            isAnimationSetScore: state.isAnimationSetScore,
            currentIndexQuestionSelected: state.currentIndexQuestionSelected,
            countRound: state.countRound
        };
        try {
            console.log("Guardando estado en localStorage:");
            localStorage.setItem("game", JSON.stringify(stateToStore));
        } catch (e) {
            console.error("Error al guardar estado en localStorage:", e);
        }
    }
);