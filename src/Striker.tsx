import type { StrikerSize } from "./game.d";

type StrikerProps = {
    size: StrikerSize;
}


export const Striker = ({ ...props }: StrikerProps) => {
    const { size } = props;
    return <div className={`item-striker ${size}`}>
        <span><svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </svg></span>
    </div>
}