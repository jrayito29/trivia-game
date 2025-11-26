
import { useEffect, useMemo, useRef, useState } from "react";
import type { Answer, Question } from "../game.d"
import { BackIcon } from "../Icons/BackIcon";
import { Link } from "react-router";

export const Topics = () => {

    const dialogRef = useRef<HTMLDialogElement>(null);
    const iptQuestionRef = useRef<HTMLInputElement>(null);
    const [iptQuestion, setIptQuestion] = useState("");
    const [listAnswers, setListAnswers] = useState<Answer[]>([
        { answer: "", score: 0, revealed: false, },
        { answer: "", score: 0, revealed: false, },
        { answer: "", score: 0, revealed: false, },
        { answer: "", score: 0, revealed: false, },
        { answer: "", score: 0, revealed: false, }
    ]);

    const [listQuestions, setListQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const existingQuestions: Question[] = JSON.parse(localStorage.getItem("questions") || "[]");
        setListQuestions(existingQuestions);
    }, []);

    const validateSave = useMemo(() => {
        if (iptQuestion.trim() === "") return false;

        const totalScore = listAnswers.reduce((acc, answer) => acc + answer.score, 0);
        if (totalScore !== 100) return false;

        return true;

    }, [iptQuestion, listAnswers])

    const open = () => {
        dialogRef.current?.showModal();
    };

    const onHandleSave = () => {

        if (!localStorage.getItem("questions")) {
            localStorage.setItem("questions", JSON.stringify([]));
        }

        const existingQuestions: Question[] = JSON.parse(localStorage.getItem("questions") || "[]");
        const cleanerAnswer = listAnswers.filter(a => a.answer.trim() !== "" && a.score > 0)

        const newQuestion: Question = {
            question: iptQuestion,
            answers: cleanerAnswer
        }

        existingQuestions.push(newQuestion);
        localStorage.setItem("questions", JSON.stringify(existingQuestions));

        setIptQuestion("");
        setListAnswers(listAnswers.map(() => ({ answer: "", score: 0, revealed: false })))
        setListQuestions(existingQuestions);
        dialogRef.current?.close();
    };

    const dismiss = () => {
        dialogRef.current?.close();
        setIptQuestion("");
    };

    const onBackdropClick = (e: React.MouseEvent) => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const rect = dialog.getBoundingClientRect();

        if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        ) {
            setIptQuestion("");
            setListAnswers(listAnswers.map(() => ({ answer: "", score: 0, revealed: false })))
            dismiss();
        }
    };

    const onHandleAnswerChange = (index: number, value: string) => {
        const uptAnswer = [...listAnswers];
        uptAnswer[index].answer = value;
        setListAnswers(uptAnswer);
    }

    const onHandleScoreChange = (index: number, value: number) => {
        const uptAnswer = [...listAnswers];
        uptAnswer[index].score = value;
        setListAnswers(uptAnswer)
    }

    const deleteQuestion = (questionId: number) => {
        const existingQuestions: Question[] = JSON.parse(localStorage.getItem("questions") || "[]");
        existingQuestions.splice(questionId, 1);
        setListQuestions(existingQuestions);
        localStorage.setItem("questions", JSON.stringify(existingQuestions));
    }

    return <section style={{ width: "70vw", height: "80vh" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Link to="/" className="back-btn"> <BackIcon /></Link>
                <h4 className="flux section-title">
                    Preguntas</h4>
            </div>
            <button className="neon-button" onClick={open}>
                <span className="flux">Agregar</span>
            </button>
        </div >
        <TopicList listQuestions={listQuestions} hadleDeleteQuestion={deleteQuestion} />
        <dialog ref={dialogRef} onClick={onBackdropClick}>
            <p>Escribe tu pregunta</p>
            <input type="text" placeholder="Cultura general..." ref={iptQuestionRef}
                value={iptQuestion}
                onChange={(e) => setIptQuestion(e.target.value)} />
            <p style={{ marginTop: "10px" }}>Escribe tus respuestas:</p>
            <span className="text-muted">Los puntos deben tener un valor entre 1 y 100, y entre todos sumar 100 puntos</span>
            {listAnswers.map((answer, index) => <InputQuestions
                key={index}
                index={index}
                currentAnswer={answer}
                onSetAnswerValue={(idx, value) => onHandleAnswerChange(idx, value)}
                onSetScoreValue={(idx, value) => onHandleScoreChange(idx, value)}
            />
            )}
            <div className="btns">
                <button onClick={dismiss}>Cancelar</button>
                <button onClick={onHandleSave} disabled={!validateSave}>Guardar</button>
            </div>
        </dialog>
    </section >
}


const TopicList = ({ listQuestions, hadleDeleteQuestion }: { listQuestions: Question[], hadleDeleteQuestion: (i: number) => void }) => {

    if (listQuestions.length === 0) return <div style={{ textAlign: "center", fontSize: "18px", fontWeight: 500 }}>Aún no hay preguntas registradas</div>;

    return <div className="container-questions-cards-preview">
        {listQuestions.map((question: Question, i: number) => <div key={i} className="preview-card">
            <div className="preview-header">
                <span className="preview-index">#{i + 1}</span>
                <h3 className="preview-question">{question.question}</h3>
            </div>
            <ul className="preview-answers">
                {question.answers.map((answer, idx) => <li key={idx}>{answer.answer}</li>)}
            </ul>
            <button className="btn-delete-question" onClick={() => hadleDeleteQuestion(i)}>Eliminar</button>
        </div>)}
    </div>
}

type InputQuestionsProps = {
    index: number,
    currentAnswer: Answer
    onSetAnswerValue: (index: number, value: string) => void,
    onSetScoreValue: (index: number, value: number) => void
}

const InputQuestions = ({ index, currentAnswer, onSetAnswerValue, onSetScoreValue }: InputQuestionsProps) => {

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const onlyNums = input.value.replace(/\D/g, "");
        onSetScoreValue(index, isNaN(parseInt(onlyNums)) ? 0 : parseInt(onlyNums));
    };

    return <div className="input-question-container">
        <input type="text" placeholder={`Pregunta ${index + 1}`}
            onChange={(e) => onSetAnswerValue(index, e.target.value)}
            value={currentAnswer.answer}
        />
        <input type="text" placeholder="10"
            onInput={handleInput}
            value={currentAnswer.score}
        />
    </div>
}