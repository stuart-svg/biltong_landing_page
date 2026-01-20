// Netlify serverless function for OpenRouter chat
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

exports.handler = async function(event, context) {
    // Add CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { messages } = JSON.parse(event.body);

        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid request: messages array required' })
            };
        }

        // Call OpenRouter API using native https module (no dependencies needed)
        const https = require('https');
        const apiData = JSON.stringify({
            model: 'openai/gpt-4o',
            messages: messages,
            temperature: 0.7,
            max_tokens: 500
        });

        const response = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'openrouter.ai',
                port: 443,
                path: '/api/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Content-Length': apiData.length,
                    'HTTP-Referer': 'https://highproteinbiltong.com',
                    'X-Title': 'High Protein Biltong Chat'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    resolve({
                        ok: res.statusCode === 200,
                        status: res.statusCode,
                        data: data
                    });
                });
            });

            req.on('error', reject);
            req.write(apiData);
            req.end();
        });

        if (!response.ok) {
            console.error('OpenRouter API error:', response.data);
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = JSON.parse(response.data);

        // Extract the assistant's message
        const assistantMessage = data.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: assistantMessage
            })
        };

    } catch (error) {
        console.error('Chat function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to process chat request',
                details: error.message
            })
        };
    }
};
