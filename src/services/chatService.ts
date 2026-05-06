export async function createStreamRequest({
                                              signal,
                                              onChunk
                                          }: {
    signal: AbortSignal,
    onChunk: (chunk: string) => void
}) {
    const chunks = ['Hello', ' ', 'world', '!', ' This', ' is', ' a', ' test.']

    for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 100)) // 模拟延迟
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
        onChunk(chunk)
    }
}