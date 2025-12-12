import { Link } from "react-router";
import { useGameStore } from "../Store/game.store";
import { BackIcon } from "../Icons/BackIcon";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import type { Question } from "../game.d";

export const Panel = () => {

    return <>
        <Toaster expand visibleToasts={9} />
        <section style={{ width: "70vw", height: "80vh" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Link to="/" className="back-btn"> <BackIcon /></Link>
                    <h4 className="flux section-title">Panel Control</h4>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", justifyContent: "center" }}>
                <ActionsJuego />
            </div>
        </section >
    </>
}

const ActionsJuego = () => {

    const [listQuestion, setListQuestion] = useState<Question[]>([]);
    const { gameState, currentQuestion, currentIndexQuestionSelected, countRound, currentTeam,
        setCurrentTeam, reset, chekingAnswer, markingStriker, initGame, setIndexQuestionSelected, incrementCurrentQuestionIndex } = useGameStore(state => state);

    useEffect(() => {
        setCurrentTeam("none");
    }, [countRound, setCurrentTeam])

    useEffect(() => {
        const arrQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
        setListQuestion(arrQuestions);
    }, [])

    // if (gameState === "init") return <button onClick={initGame} className="btn-init-game">Iniciar juego</button>

    // className={`show-answer-btn ${!answer.revealed ? "active" : ""}`}
    return <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <section style={{ width: "400px", minWidth: "400px", maxWidth: "550px" }}>
            <span> Selecione una pregunta</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "60vh", overflowY: "scroll" }}>
                {listQuestion.map((question, index) => <button onClick={() => setIndexQuestionSelected(index)} key={index}
                    className={`show-answer-btn ${index === currentIndexQuestionSelected ? "active" : ""}`}>
                    <span> {question.question}</span>
                </button>)
                }
            </div>
        </section>
        <section style={{ textAlign: "center" }}>
            {currentTeam === "none" && <div className="container-select-team">
                <span>Seleccione un equipo</span>
                <div className="container-buttons-select-team">
                    <button onClick={() => setCurrentTeam("blue")}>Equipo Azul</button>
                    <button onClick={() => setCurrentTeam("red")}>Equipo Rojo</button>
                </div>
            </div>}
            <div className="tablero-mediador">
                <span>
                    <span className="preview-index" style={{ marginRight: "5px" }}>
                        #{countRound + 1}
                    </span>
                    {currentQuestion?.question}
                </span>
                <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {
                        currentQuestion?.answers.map((answer, index) =>
                            <button onClick={() => chekingAnswer(index)} className={`show-answer-btn ${!answer.revealed ? "active" : ""}`} key={index}>
                                <span> {answer.answer}</span>
                                <span>{answer.score}</span>
                            </button>)
                    }
                </div>
            </div>
            <div className="container-actions-game">
                <button onClick={reset} className="btn-reiniciar">Reiniciar</button>
                {gameState === "init" && <button onClick={initGame} className="btn-init-game">Iniciar juego</button>}
                <button onClick={markingStriker} className="btn-strike">Strike</button>
                <button onClick={incrementCurrentQuestionIndex} className="btn-reiniciar">Siguiente Ronda</button>
            </div>
        </section>
    </div>
}