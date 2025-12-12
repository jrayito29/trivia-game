import { useEffect } from "react";
import { ContainerStrikers } from "../Components/ContainerStrikers";
import { Scoreboard } from "../Components/Scoreboard";
import { Tablero } from "../Components/Tablero";
import { useGameStore } from "../Store/game.store";
import { Link } from "react-router";
import { GameAnimations } from "../Components/GameAnimations";
import { BackIcon } from "../Icons/BackIcon";

export const Game = () => {

    // gameState, markingStriker, generateListCuestion
    const { globalScore, currentTeam, firstTeamScore, secondTeamScore, currentQuestion, gameState,
        setStateFromStorage } = useGameStore(state => state);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "game" && event.newValue) {
                try {
                    const newState = JSON.parse(event.newValue);
                    setStateFromStorage(newState);
                    console.log(`Estado sincronizado desde otra pestaña.`);
                } catch (e) {
                    console.error("Error al parsear estado de storage event:", e);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [setStateFromStorage]);


    if (!localStorage.getItem("questions")) {
        return <section className="main-container-menu">
            <section className="container-name-game-section">
                <h1 className="container-name-game">
                    <div className="neon">Trivia</div>
                    <div className="flux">Game</div>
                </h1>
                <span className="text-muted" style={{ display: "block", textAlign: "center", marginTop: "20px", fontSize: "1em" }}>
                    No hay preguntas registradas para jugar.
                    <Link to="/questions" style={{ textDecoration: "none", color: "white", marginLeft: "5px" }}>Registrar Preguntas</Link>
                </span>
            </section>
        </section>
    }

    const countPreguntas = JSON.parse(localStorage.getItem("questions") || "[]");
    if (countPreguntas.length < 5) {
        return <section className="main-container-menu">
            <section className="container-name-game-section">
                <h1 className="container-name-game">
                    <div className="neon">Trivia</div>
                    <div className="flux">Game</div>
                </h1>
                <span className="text-muted" style={{ display: "block", textAlign: "center", marginTop: "20px", fontSize: "1em" }}>
                    Registra {(5 - countPreguntas.length)} pregunta(s) para jugar.
                    <Link to="/questions" style={{ textDecoration: "none", color: "white", marginLeft: "5px" }}>Registrar Preguntas</Link>
                </span>
            </section>
        </section>
    }


    if (currentQuestion === null && gameState == "init") {
        return <section className="main-container-menu">
            <section className="container-name-game-section">
                <h1 className="container-name-game">
                    <div className="neon">Trivia</div>
                    <div className="flux">Game</div>
                </h1>
                <span className="text-muted" style={{ display: "block", textAlign: "center", fontSize: "1em" }}>
                    Inicia el juego desde el panel de control
                    <Link to="/" style={{ textDecoration: "none", color: "white", marginLeft: "5px" }}>Regresar Inicio</Link>
                </span>
            </section>
        </section>
    }

    return (<>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Link to="/" className="back-btn"> <BackIcon /></Link>
            </div>
        </div >
        <GameAnimations />
        <div className="game-container">
            <div className="game-header">
                <Scoreboard score={globalScore} isActive={false} currentScoreboard="main" />
            </div>
            <div className="game-body">
                <ContainerStrikers size="large" animation />
                <Scoreboard score={firstTeamScore} isActive={currentTeam === "blue"} currentScoreboard="blue" />
                <Tablero />
                <Scoreboard score={secondTeamScore} isActive={currentTeam === "red"} currentScoreboard="red" />
            </div>
            <div className="game-footer">
                <ContainerStrikers size="small" />
            </div>
        </div>

        {/* <section className="container-actions">
            {(gameState == "steal-turn" || gameState == "playing") && <Button action={markingStriker} label="Marcar Striker" />}
            <Button action={() => { window.location.reload() }} label="Reiniciar" />
        </section> */}
    </>
    )
}