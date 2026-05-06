export async function createChatStream(message: string) {
    const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return res.body
}