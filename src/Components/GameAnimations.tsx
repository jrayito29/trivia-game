import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react";
import { useGameStore } from "../Store/game.store";


export const GameAnimations = () => {
    const [visible, setVisible] = useState(true);

    const { currentQuestionIndex, gameState } = useGameStore(state => state);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 2000);
        return () => clearTimeout(timer);
    }, [currentQuestionIndex, gameState]);

    return <section className="container-game-animations">
        {gameState === "playing" && <AnimatePresence>
            {visible && currentQuestionIndex === 0 && <motion.div
                key="key-ronda-1"
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 500, opacity: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="neon" style={{ textAlign: "center" }}>Ronda Uno</div>
            </motion.div>}

            {visible && currentQuestionIndex === 1 && <motion.div
                key="key-ronda-2"
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 500, opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="neon" style={{ textAlign: "center" }}>Ronda Dos</div>
            </motion.div>}

            {visible && currentQuestionIndex === 2 && <motion.div
                key="key-ronda-3"
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 500, opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="neon" style={{ textAlign: "center" }}>Ronda Tres</div>
                <div className="flux" style={{ textAlign: "center" }}>Puntos Dobles</div>
            </motion.div>}

            {visible && currentQuestionIndex === 3 && <motion.div
                key="key-ronda-4"
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 500, opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="neon" style={{ textAlign: "center" }}>Ronda Cuatro</div>
                <div className="flux" style={{ textAlign: "center" }}>Puntos Dobles</div>
            </motion.div>}

            {visible && currentQuestionIndex === 4 && <motion.div
                key="key-ronda-5"
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 500, opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="neon" style={{ textAlign: "center" }}>Ronda Cinco</div>
                <div className="flux" style={{ textAlign: "center" }}>Puntos Triples</div>
            </motion.div>}
        </AnimatePresence>}
    </section>
}