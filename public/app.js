// VAPI Configuration
const VAPI_PUBLIC_KEY = 'b3d3a6a0-a181-4117-8b3d-90e4f632a5a7';
const VAPI_ASSISTANT_ID = 'd9e21a53-cd34-4fb6-9f24-e0551e264b5f';

// Initialize VAPI
let vapiInstance = null;
let isCallActive = false;

function initializeVAPI() {
    try {
        // Check if VAPI SDK is loaded
        if (typeof window.vapiSDK === 'undefined') {
            console.error('VAPI SDK not loaded');
            updateVAPIStatus('SDK not loaded', 'error');
            return;
        }

        // Initialize VAPI with assistant configuration
        vapiInstance = window.vapiSDK.run({
            apiKey: VAPI_PUBLIC_KEY,
            assistant: {
                assistantId: VAPI_ASSISTANT_ID
            }
        });

        // VAPI Event Listeners
        vapiInstance.on('call-start', () => {
            console.log('Call started');
            isCallActive = true;
            updateVAPIButton();
            updateVAPIStatus('In call', 'active');
        });

        vapiInstance.on('call-end', () => {
            console.log('Call ended');
            isCallActive = false;
            updateVAPIButton();
            updateVAPIStatus('Ready to talk', 'ready');
        });

        vapiInstance.on('error', (error) => {
            console.error('VAPI error:', error);
            updateVAPIStatus('Error occurred', 'error');
            setTimeout(() => {
                updateVAPIStatus('Ready to talk', 'ready');
            }, 3000);
        });

    } catch (error) {
        console.error('Failed to initialize VAPI:', error);
        updateVAPIStatus('Initialization failed', 'error');
    }
}

function updateVAPIButton() {
    const button = document.getElementById('vapi-button');
    const buttonText = button.querySelector('.button-text');
    const buttonIcon = button.querySelector('.button-icon');

    if (isCallActive) {
        buttonText.textContent = 'End Call';
        buttonIcon.textContent = '📞';
        button.classList.add('active');
    } else {
        buttonText.textContent = 'Start Voice Call';
        buttonIcon.textContent = '🎙️';
        button.classList.remove('active');
    }
}

function updateVAPIStatus(text, status) {
    const statusText = document.querySelector('#vapi-status .status-text');
    const statusDot = document.querySelector('#vapi-status .status-dot');

    statusText.textContent = text;
    statusDot.className = 'status-dot';

    if (status === 'active') {
        statusDot.classList.add('active');
    } else if (status === 'error') {
        statusDot.classList.add('error');
    }
}

// VAPI Button Click Handler
document.getElementById('vapi-button').addEventListener('click', () => {
    if (!vapiInstance) {
        console.error('VAPI not initialized');
        return;
    }

    if (isCallActive) {
        vapiInstance.stop();
    } else {
        vapiInstance.start();
    }
});

// Chat functionality
const chatWindow = document.getElementById('chat-window');
const chatToggle = document.getElementById('chat-toggle');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatLoading = document.getElementById('chat-loading');

let conversationHistory = [
    {
        role: 'system',
        content: `You are a friendly and knowledgeable customer support agent for High Protein Biltong. Your role is to:

1. Answer questions about the health advantages of biltong (high protein, low carb, natural ingredients, no preservatives, etc.)
2. Describe our delicious flavours in an appetizing way
3. Provide detailed product information (sizes, pricing, ingredients, ordering)
4. Be enthusiastic about the product while being helpful and professional
5. If you don't know specific pricing or availability, suggest the customer contact us directly

Keep responses concise but informative. Use a warm, conversational tone.`
    }
];

// Toggle chat window
chatToggle.addEventListener('click', () => {
    chatWindow.classList.remove('hidden');
    chatInput.focus();
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
});

// Send message
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat('user', message);
    chatInput.value = '';

    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });

    // Show loading indicator
    chatLoading.classList.remove('hidden');

    try {
        // Call Netlify function (which will use OpenRouter)
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Add assistant response to history and chat
        const assistantMessage = data.message;
        conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        addMessageToChat('bot', assistantMessage);

    } catch (error) {
        console.error('Chat error:', error);
        addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
    } finally {
        chatLoading.classList.add('hidden');
    }
}

function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Use marked.js to parse markdown if available
    if (typeof marked !== 'undefined') {
        contentDiv.innerHTML = marked.parse(message);
    } else {
        contentDiv.textContent = message;
    }

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listeners for chat
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize VAPI when page loads
window.addEventListener('load', () => {
    initializeVAPI();
});
