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

// Initialize VAPI when page loads
window.addEventListener('load', () => {
    initializeVAPI();
});
