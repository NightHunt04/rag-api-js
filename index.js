import express from 'express'
import cors from 'cors'

import { createChain } from './utils/createChain.js'
import { createVectorStore } from './utils/createVectoreStore.js'

const app = express()
const PORT = process.env.PORT || 8000

let vectorStore, chain

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Server is running....'))

app.post('/set-url', async (req, res) => {
    const url = req.body?.url
    
    if (!url) return res.status(400).json({ response: 'Missing url' })
    else {
        vectorStore = await createVectorStore(url)
        chain = await createChain(vectorStore)

        return res.status(200).json({ response: 'URL set successfully' })
    }
})

app.post('/get-answer', async (req, res) => {
    const question = req.body?.question 

    if (!question) return res.status(400).json({ response: 'Missing question' })
    else {
        if (!chain) return res.status(400).json({ response: 'Set the URL first and then ask question' })
        else {
            const response = await chain.invoke({
                input: question
            })

            return res.status(200).json({ response: response.answer })
        }
    }
})

app.listen(PORT, () => console.log(`Server is running on : http://localhost:${PORT}`))

export { app }