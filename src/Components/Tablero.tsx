import { useGameStore } from "../Store/game.store"
import { ItemAnswer } from "./ItemAnswer"
import { motion, AnimatePresence } from "framer-motion";


export const Tablero = () => {

    const { currentQuestion, countRound, isAnimationSetScore } = useGameStore(state => state);

    if (currentQuestion === null) return <div>No hay pregunta seleccionada</div>

    return <div className={isAnimationSetScore ? "rainbow" : ""}>
        <section className="container-questions">
            <span className="question-text">
                <span className="preview-index" style={{ marginRight: "5px" }}>
                    #{countRound + 1}
                </span>
                {currentQuestion.question}
            </span>
            <div style={{ padding: "16px", display: "flex", gap: "16px", flexDirection: "column" }}>

                <AnimatePresence mode="popLayout">
                    {currentQuestion.answers.map((answer, index) => <motion.div
                        key={countRound + "-" + index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50, }}
                        transition={{ duration: 0.7, delay: index * 0.1 }}
                    >
                        <ItemAnswer key={index} answer={answer} index={index + 1} />
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/*listQuestions[currentQuestionIndex].answers.map((answer, index) => <ItemAnswer key={index} answer={answer} index={index + 1} />)*/}
        </section>
    </div>
}