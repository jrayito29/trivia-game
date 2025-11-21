import { useGameStore } from "../Store/game.store"
import { Button } from "./Button"

export const Rules = () => {

    const { generateListCuestion } = useGameStore(state => state);

    return <>
        <div className="rules-game">
            <h2>¡Adivínalo Ya!</h2>
            <p>
                Bienvenidos a un reto donde <strong> el conocimiento, la estrategia y la suerte </strong>se mezclan para decidir quién es el verdadero campeón de las 5 rondas.
            </p>
            <p>
                El juego tiene un objetivo simple: <strong>acumular más puntos que el equipo rival… </strong>aunque llegar ahí no será tan sencillo.
            </p>
            <h2>🔹 ¿Cómo se juega?</h2>
            <ul>
                <li>El juego se compone de <strong>5 rondas.</strong></li>
                <li> En cada ronda aparece <strong>una pregunta con 5 respuestas ocultas.</strong> Cada respuesta tiene un puntaje que se suma al <strong>marcador global.</strong></li>
            </ul>
            <h2>🟢 Turno del equipo en juego:</h2>
            <ul>
                <li>El equipo trata de descubrir todas las respuestas.</li>
                <li> Si logra <strong>acertarlas todas</strong>, ¡genial! Los puntos van directo al marcador global y también a su marcador de equipo.</li>
                <li> Pero cuidado… si se acumulan <strong>3 errores</strong>, el turno se acaba y la oportunidad pasa al equipo contrario.</li>
            </ul>
            <h2> 🔄 Oportunidad del equipo rival:</h2>
            <ul>
                <li> El rival tiene <strong>un solo intento </strong> para adivinar entre las posibles respuestas ocultas.</li>
                <li>Si aciertan al menos una, ¡zas! Se llevan todos los puntos del marcador global.</li>
                <li>Si fallan, el equipo inicial se queda con los puntos.</li>
            </ul>
            <h2>  🏆 ¿Quién gana?</h2>
            <p> Después de 5 rondas, el equipo con más puntos en su marcador se convierte en el <strong>campeón absoluto.</strong></p>

        </div>
        <Button action={generateListCuestion} label="Iniciar Juego" />
    </>
}