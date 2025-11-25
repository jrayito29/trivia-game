import { Link } from "react-router"
import { GameIcon } from "../Icons/GameIcon"
import { QuestionIcon } from "../Icons/QuestionIcon"
import { SettingsIcon } from "../Icons/SettingsIcon"
import { RulesIcon } from "../Icons/RulesIcons"


export const Menu = () => {
    return <section className="main-container-menu">
        <section className="container-name-game-section">
            <h1 className="container-name-game">
                <div className="neon">Trivia</div>
                <div className="flux">Game</div>
            </h1>
        </section>
        <section className="container-menu-options">
            <Link to="/game" className="links-menu-options pink">
                <GameIcon />
                <h4>Iniciar</h4>
            </Link>
            <Link to="/questions" className="links-menu-options purple">
                <QuestionIcon />
                <h4>Preguntas</h4>
            </Link>
            <Link to="/panel" target="_blank" className="links-menu-options yellow">
                <SettingsIcon />
                <h4>Panel</h4>
            </Link>
            <Link to="/rules" className="links-menu-options red">
                <RulesIcon />
                <h4>Reglas</h4>
            </Link>
        </section>
    </section>
}