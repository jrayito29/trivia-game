import type { Answer } from "../game.d";
import { useGameStore } from "../Store/game.store";

type ItemAnswerProp = {
    index: number,
    answer: Answer
}

export const ItemAnswer = ({ ...props }: ItemAnswerProp) => {

    const { chekingAnswer } = useGameStore(state => state);
    const { answer: { answer, score, revealed }, index } = props;

    return <div className="container-answer">
        <div className="item-answer">{index}.</div>
        <button className="label-answer" onClick={() => chekingAnswer(index - 1)}>
            <span className={`animation-answer ${revealed ? "showing" : ""}`}></span>
            <div className="container-label-answer">
                <span>{answer}</span>
                <span className="answer-score">{score}</span>
            </div>
        </button>
    </div>
}