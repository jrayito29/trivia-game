import type { Answer } from "../game.d";
// import { useGameStore } from "../Store/game.store";

type ItemAnswerProp = {
    index: number,
    answer: Answer
    handleClick?: () => void
}

export const ItemAnswer = ({ ...props }: ItemAnswerProp) => {

    // const { chekingAnswer } = useGameStore(state => state);
    const { answer: { answer, score, revealed }, handleClick } = props;

    return <div className="container-answer">
        {/* <div className="item-answer">{index}.</div> */}
        {/* onClick={() => chekingAnswer(index - 1)} */}
        <button className="label-answer" onClick={handleClick}>
            <span className={`animation-answer ${revealed ? "showing" : ""}`}></span>
            <div className="container-label-answer">
                <span>{answer}</span>
                <span className="answer-score">{score}</span>
            </div>
        </button>
    </div>
}