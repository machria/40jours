
// lib/translator.ts

export async function translateText(text: string, sourceLang: string = 'auto', targetLang: string = 'fr'): Promise<string> {
    if (!text) return "";

    const translateChunk = async (chunk: string) => {
        if (!chunk.trim()) return chunk;
        // Use the free Google Translate endpoint (gtx)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`GTX Error: ${res.status}`);
            const data = await res.json();
            return data[0].map((part: any) => part[0]).join('');
        } catch (e) {
            console.error("Chunk translation error", e);
            return chunk; // Return original if failed
        }
    };

    const chunks = [];
    let remaining = text;
    const CHUNK_SIZE = 1500;

    while (remaining.length > 0) {
        if (remaining.length <= CHUNK_SIZE) {
            chunks.push(remaining);
            break;
        }

        let splitIndex = remaining.lastIndexOf('.', CHUNK_SIZE);
        if (splitIndex === -1) splitIndex = remaining.lastIndexOf(' ', CHUNK_SIZE);
        if (splitIndex === -1) splitIndex = CHUNK_SIZE;

        chunks.push(remaining.substring(0, splitIndex + 1));
        remaining = remaining.substring(splitIndex + 1);
    }

    // Parallel fetch for speed (Server side typically handles this better than browser rate limits)
    const promises = chunks.map(chunk => translateChunk(chunk));
    const translatedParts = await Promise.all(promises);

    return translatedParts.join('');
}
