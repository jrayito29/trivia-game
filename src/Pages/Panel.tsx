import { Link } from "react-router";
import { useGameStore } from "../Store/game.store";
import { BackIcon } from "../Icons/BackIcon";
import { useEffect } from "react";

export const Panel = () => {

    const { listQuestions } = useGameStore(state => state);

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
        generateListCuestion, setCurrentTeam, reset, chekingAnswer } = useGameStore(state => state);

    if (gameState === "init") return <button onClick={generateListCuestion}>Iniciar juego</button>

    return <div style={{ textAlign: "center" }}>
        <span style={{ display: "block" }}>El juego ya ha comenzado</span>
        {currentTeam === "none" && currentQuestionIndex === 0 && <div>
            <span>Seleccione un equipo</span>
            <button onClick={() => setCurrentTeam("blue")}>Equipo Azul</button>
            <button onClick={() => setCurrentTeam("red")}>Equipo Rojo</button>
        </div>}
        <span>{listQuestions[currentQuestionIndex].question}</span>
        {
            listQuestions[currentQuestionIndex].answers.map((answer, index) => <span onClick={() => chekingAnswer(index)} style={{ display: "block" }} key={index}>{answer.answer}</span>)
        }


        <button onClick={reset}>Reiniciar</button>
    </div>
}