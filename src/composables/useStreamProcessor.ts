export function createStreamProcessor(onUpdate: (chunk: string) => void) {
    let buffer = ''
    let scheduled = false

    function push(chunk: string) {
        buffer += chunk
        if (!scheduled) {
            scheduled = true
            requestAnimationFrame(() => {
                onUpdate(buffer)
                buffer = ''
                scheduled = false
            })
        }
    }

    return { push }
}