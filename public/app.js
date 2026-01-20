// VAPI Configuration
const VAPI_PUBLIC_KEY = '56dd4525-81a8-4624-9780-a81878a89c55';
const VAPI_ASSISTANT_ID = '6262199c-f7a6-4b98-99e9-4ff96db9d37f';

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
                firstMessage: "Hello! I'm here to help you with our High Protein Biltong. What would you like to know?",
                model: {
                    provider: "openai",
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a friendly customer support agent for High Protein Biltong. Help customers learn about health benefits, flavours, and products."
                        }
                    ]
                },
                voice: {
                    provider: "11labs",
                    voiceId: "21m00Tcm4TlvDq8ikWAM"
                }
            }
        });

        if (!vapiInstance) {
            console.error('VAPI instance is null');
            updateVAPIStatus('Initialization failed', 'error');
            return;
        }

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

// Initialize VAPI when page loads
window.addEventListener('load', () => {
    initializeVAPI();
});
