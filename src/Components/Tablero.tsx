import { useGameStore } from "../Store/game.store"
import { ItemAnswer } from "./ItemAnswer"
import { motion, AnimatePresence } from "framer-motion";


export const Tablero = () => {

    const { listQuestions, currentQuestionIndex, isAnimationSetScore } = useGameStore(state => state);

    if (listQuestions.length === 0) return <div>Cargando preguntas</div>

    return <div className={isAnimationSetScore ? "rainbow" : ""}>
    <section className="container-questions">
        <span>
            {listQuestions[currentQuestionIndex].question}
        </span>
        <AnimatePresence mode="popLayout">
            {listQuestions[currentQuestionIndex].answers.map((answer, index) => <motion.div
                key={currentQuestionIndex + "-" + index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50, }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                >
                <ItemAnswer key={index} answer={answer} index={index + 1} />
            </motion.div>
            )}
        </AnimatePresence>
        {/*listQuestions[currentQuestionIndex].answers.map((answer, index) => <ItemAnswer key={index} answer={answer} index={index + 1} />)*/}
    </section>
            </div>
}