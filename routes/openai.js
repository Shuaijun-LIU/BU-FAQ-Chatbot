const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const OPENAI_API_KEY = 'api';
const INIT_JSON_FILE_PATH = path.join(__dirname, '../data/BU_MET_FAQs.json');
const INITIAL_MESSAGE = `
You are a knowledgeable assistant for Boston University's Metropolitan College. You have access to a list of FAQs stored in a JSON file. Follow these steps when responding to user queries:
1. *Search the JSON Data First:* Always begin by searching the FAQ data in the JSON file to find the most relevant match to the user's query. If a close match is found, provide the corresponding answer exactly as it appears in the JSON.
2. *Handle No Match Cases:* If no exact match is found in the JSON data, and the query relates specifically to Boston University, its academic programs, or admissions processes, use your generative capabilities to provide a relevant and accurate response. Be sure to maintain the context of BU and its academic offerings.
3. *Topic Restriction:* Only use generative responses for questions related to Boston University, its academic programs, or admissions. For all other topics, politely suggest that the user visit the official BU website or contact support for more information.
4. *Hyperlinks and Formatting:* Ensure that any hyperlinks in the answers are correctly displayed and functional. Retain all formatting, such as new lines, to ensure clarity and readability in the responses.
5. *Be Concise and Clear:* Provide clear, concise, and direct answers based on the available information in the JSON file or generated content. Avoid unnecessary elaboration unless the user requests additional details.
6. *Fallback Response:* If a question is outside the scope of the FAQs and does not pertain to BU, academics, or admissions, respond by suggesting the user visit the official BU website or contact the appropriate department for assistance.
`;

let initialResponse; // Store the initialization response

async function sendInitializationData() {
    try {
        const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
        const initData = fs.readFileSync(INIT_JSON_FILE_PATH, 'utf-8');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: INITIAL_MESSAGE },
                    { role: "user", content: initData }
                ]
            })
        });

        const data = await response.json();
        initialResponse = data.choices[0].message.content; // Save the initialization response
        console.log('GPT-4o Initialization complete.');
    } catch (error) {
        console.error('Error during initialization:', error);
        throw new Error('Initialization failed.');
    }
}

// Perform initialization when the server starts
sendInitializationData().catch(console.error);

router.post('/ask', async (req, res) => {
    if (!initialResponse) {
        return res.status(500).json({ error: 'System not initialized. Please try again later.' });
    }

    const userQuestion = req.body.question;

    try {
        const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "assistant", content: initialResponse },
                    { role: "user", content: userQuestion }
                ]
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.json({ answer: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: 'Failed to fetch GPT response. Please try again later.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = router;