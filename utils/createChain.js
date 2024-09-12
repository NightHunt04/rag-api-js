import dotenv from 'dotenv'
dotenv.config()

import { ChatGroq } from '@langchain/groq'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'

const createChain = async (vectorStore) => {
    const model = new ChatGroq({
        modelName: 'llama3-8b-8192',
        temperature: 0.7,
        apiKey: process.env.GROQ_API_KEY
    })
    
    const prompt = ChatPromptTemplate.fromTemplate(`
        Answer the user's question from the given context. You can also add your own knowledge but it must be based on the given context. If user asks question which is not connected to the given context, then simply dont respond to that question.    
        Context: {context}
        Chat History: {chat_history}
        Question: {input}
    `)
    
    const chain = await createStuffDocumentsChain({
        llm: model,
        prompt
    })
    const retriever = vectorStore.asRetriever({ k: 8 })
    const retrievalChain = await createRetrievalChain({
        combineDocsChain: chain,
        retriever
    })

    return retrievalChain
}

export { createChain }