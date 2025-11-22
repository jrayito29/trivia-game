import { useGameStore } from "../Store/game.store";
import { AnimatedScore } from "./AnimateScore";

type ScoreboardProps = {
    score: number,
    isActive: boolean
}

export const Scoreboard = ({ ...props }: ScoreboardProps) => {

    const { isAnimationSetScore } = useGameStore(state => state);
    const { score, isActive } = props;

    // const formattedScore = score.toString().padStart(3, "0");

    // ${isAnimationSetScore ? "rainbow" : isActive ? "active": ""} 
    return <div className={`container-scoreboard neon-soft`}>
        <AnimatedScore value={score} />
        {/*formattedScore.split("").map((num, index) => <span key={index}>{num}</span>) */}
    </div>
}