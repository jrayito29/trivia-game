import { ContainerStrikers } from "./Components/ContainerStrikers"
import { Scoreboard } from "./Components/Scoreboard"
import { Tablero } from "./Components/Tablero"
import { useGameStore } from "./Store/game.store"
import { Button } from "./Components/Button";
import { Rules } from "./Components/Rules";

function App() {

  const { globalScore, currentTeam, firstTeamScore, secondTeamScore, gameState, markingStriker } = useGameStore(state => state);

  if (gameState === "rules") return <Rules />

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

export default App
