import { Link } from "react-router";
import { useGameStore } from "../Store/game.store";
import { BackIcon } from "../Icons/BackIcon";
import { useEffect } from "react";

export const Panel = () => {

    return <section style={{ width: "70vw", height: "80vh" }}>
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
}

const ActionsJuego = () => {

    const { gameState, listQuestions, currentQuestionIndex, currentTeam,
        generateListCuestion, setCurrentTeam, reset, chekingAnswer, markingStriker } = useGameStore(state => state);

    useEffect(() => {
        setCurrentTeam("none");
    }, [currentQuestionIndex, setCurrentTeam])

    if (gameState === "init") return <button onClick={generateListCuestion} className="btn-init-game">Iniciar juego</button>

    return <div style={{ textAlign: "center" }}>
        <span style={{ display: "block" }}>El juego ya ha comenzado</span>
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
                    #{currentQuestionIndex + 1}
                </span>
                {listQuestions[currentQuestionIndex].question}
            </span>
            <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {
                    listQuestions[currentQuestionIndex].answers.map((answer, index) =>
                        <button onClick={() => chekingAnswer(index)} className={`show-answer-btn ${!answer.revealed ? "active" : ""}`} key={index}>
                            <span> {answer.answer}</span>
                            <span>{answer.score}</span>
                        </button>)
                }
            </div>
        </div>
        <div className="container-actions-game">
            <button onClick={reset} className="btn-reiniciar">Reiniciar</button>
            <button onClick={markingStriker} className="btn-strike">Strike</button>
        </div>
    </div>
}