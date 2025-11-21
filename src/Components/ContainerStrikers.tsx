import { useEffect, useState } from "react";
import type { StrikerSize } from "../game.d";
import { useGameStore } from "../Store/game.store";
import { Striker } from "../Striker"
import { AnimatePresence, motion } from "motion/react"

type ContainerStrikersProps = {
    size: StrikerSize;
    animation?: boolean
}


export const ContainerStrikers = ({ ...props }: ContainerStrikersProps) => {

    const [isVisible, setIsVisible] = useState(false)
    const { counterStrikers } = useGameStore(state => state);
    const { size, animation } = props;

    useEffect(() => {
        setIsVisible(true)
        setTimeout(() => setIsVisible(false), 3500);
    }, [counterStrikers])

    if (counterStrikers == 0) return <></>

    if (!animation) return <div className="container-strikers">
        {
            Array.from({ length: counterStrikers }).map((_, index) => <Striker key={index} size={size} />)
        }
    </div>

    return <AnimatePresence>
        {isVisible && <motion.div
            className="container-strikers"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}>
            {
                Array.from({ length: counterStrikers }).map((_, index) => <Striker key={index} size={size} />)
            }
        </motion.div>}
    </AnimatePresence>
}