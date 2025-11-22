
import { useRef, useState } from "react";
import type { Topic } from "../game.d"


export const Topics = () => {

    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState("");

    const open = () => {
        dialogRef.current?.showModal();
    };

    const confirm = () => {
        dialogRef.current?.close();
        setInput("");
    };

    const dismiss = () => {
        dialogRef.current?.close();
        setInput("");
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
            dismiss();
        }
    };

    return <section style={{ width: "70vw", height: "80vh" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <h4 className="flux section-title">Temas</h4>
            <button className="neon-button" onClick={open}>
                <span className="flux">Agregar</span>
            </button>
        </div>
        <TopicList />
        <dialog ref={dialogRef} onClick={onBackdropClick}>
            <p>Escribe el nombre del tema:</p>
            <input type="text" placeholder="Cultura general..." ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)} />
            <div className="btns">
                <button id="dismiss" onClick={dismiss}>Cancelar</button>
                <button id="confirm" onClick={confirm} disabled={!input.trim()}>Guardar</button>
            </div>
        </dialog>
    </section>
}


const TopicList = () => {

    if (!localStorage.getItem("topics")) return <div style={{ textAlign: "center", fontSize: "18px", fontWeight: 500 }}>No hay temas aún</div>;

    const topics = JSON.parse(localStorage.getItem("topics") || "{}");

    return <div>
        {topics.map((topic: Topic, index: number) => <span key={index}>{topic.name}</span>)}
    </div>
}