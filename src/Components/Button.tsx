
type ButtonProps = {
    action: () => void,
    label: string
}

export const Button = ({ ...props }: ButtonProps) => {

    const { action, label } = props;

    return <button onClick={action}>
        <span className="button_top"> {label} </span>
    </button>
}