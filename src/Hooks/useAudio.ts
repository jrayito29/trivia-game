

export const useAudio = (element: string) => {

    const elementAudio: HTMLAudioElement | null = document.getElementById(element) as HTMLAudioElement | null

    const playSound = () => {
        if (!elementAudio) return;
        elementAudio.currentTime = 0;
        elementAudio.play()
    }

    return [playSound] as const
}