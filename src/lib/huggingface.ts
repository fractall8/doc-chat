import { InferenceClient } from "@huggingface/inference"

const HfClient = new InferenceClient(process.env.HF_API_KEY);

export async function getHuggingFaceEmbeddings(texts: string[]) {
    const embeddings = await HfClient.featureExtraction({
        model: "sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
        inputs: texts,
    });

    return embeddings.map((item) => {
        if (Array.isArray(item) && typeof item[0] === "number") {
            return item as number[];
        }
        if (Array.isArray(item) && Array.isArray(item[0])) {
            return (item as number[][]).flat();
        }
        throw new Error("Invalid embedding format");
    });
}