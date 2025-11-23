import { useEffect } from "react";
import { Button } from "../Components/Button";
import { ContainerStrikers } from "../Components/ContainerStrikers";
import { Scoreboard } from "../Components/Scoreboard";
import { Tablero } from "../Components/Tablero";
import { useGameStore } from "../Store/game.store";
import { Link } from "react-router";

export const Game = () => {

    const { globalScore, currentTeam, firstTeamScore, secondTeamScore, gameState, markingStriker, generateListCuestion } = useGameStore(state => state);

    useEffect(() => {
        generateListCuestion();
    }, [])

    if (!localStorage.getItem("questions")) {
        return <section className="main-container-menu">
            <section className="container-name-game-section">
                <h1 className="container-name-game">
                    <div className="neon">Trivia</div>
                    <div className="flux">Game</div>
                </h1>
                <span className="text-muted" style={{ display: "block", textAlign: "center", marginTop: "20px", fontSize: "1em" }}>
                    No hay preguntas registradas para jugar
                    <Link to="/questions" style={{ textDecoration: "none", color: "white", marginLeft: "5px" }}>Registrar Preguntas</Link>
                </span>
            </section>
        </section>
    }

    return (<>
        <div className="game-container">
            <div className="game-header">
                <Scoreboard score={globalScore} isActive={false} />
            </div>
            <div className="game-body">
                <ContainerStrikers size="large" animation />
                <Scoreboard score={firstTeamScore} isActive={currentTeam === "blue"} />
                <Tablero />
                <Scoreboard score={secondTeamScore} isActive={currentTeam === "red"} />
            </div>
            <div className="game-footer">
                <ContainerStrikers size="small" />
            </div>
        </div>

        <section className="container-actions">
            {(gameState == "steal-turn" || gameState == "playing") && <Button action={markingStriker} label="Marcar Striker" />}
            <Button action={() => { window.location.reload() }} label="Reiniciar" />
        </section>
    </>
    )
}