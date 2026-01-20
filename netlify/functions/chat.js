// Netlify serverless function for OpenRouter chat
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Import fetch for Node.js (Netlify supports this)
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { messages } = JSON.parse(event.body);

        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid request: messages array required' })
            };
        }

        // Call OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://highproteinbiltong.com', // Optional: your site URL
                'X-Title': 'High Protein Biltong Chat' // Optional: your app name
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenRouter API error:', errorData);
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();

        // Extract the assistant's message
        const assistantMessage = data.choices[0].message.content;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: assistantMessage
            })
        };

    } catch (error) {
        console.error('Chat function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to process chat request',
                details: error.message
            })
        };
    }
};
