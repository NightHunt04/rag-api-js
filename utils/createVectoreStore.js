import dotenv from 'dotenv'
dotenv.config()

import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { TaskType } from '@google/generative-ai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

const createVectorStore = async (url) => {
    const loader = new CheerioWebBaseLoader(url)
    const docs = await loader.load()
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    })
    const splitDocs = await splitter.splitDocuments(docs)
    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY, model: 'text-embedding-004', taskType: TaskType.RETRIEVAL_DOCUMENT })
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings)

    return vectorStore
} 

export { createVectorStore }