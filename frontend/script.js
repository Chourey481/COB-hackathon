// Global variables
let isLearningMode = window.location.pathname.includes('learn.html');
let currentLetter = 'A';
let completedLetters = new Set();
let correctCount = 0;
let totalAttempts = 0;

// DOM Elements
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const targetLetterElement = document.getElementById('targetLetter');
const predictedLetterElement = document.getElementById('predictedLetter');
const clearBtn = document.getElementById('clearBtn');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');

// Initialize webcam
async function initializeWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        webcamElement.srcObject = stream;
        return true;
    } catch (error) {
        console.error('Error accessing webcam:', error);
        alert('Unable to access webcam. Please ensure you have granted camera permissions.');
        return false;
    }
}

// Capture frame from webcam
function captureFrame() {
    const context = canvasElement.getContext('2d');
    canvasElement.width = webcamElement.videoWidth;
    canvasElement.height = webcamElement.videoHeight;
    context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);
    
    return new Promise((resolve) => {
        canvasElement.toBlob(resolve, 'image/jpeg');
    });
}

// Send frame to backend for prediction
async function getPrediction() {
    try {
        const imageBlob = await captureFrame();
        const formData = new FormData();
        formData.append('file', imageBlob);

        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        return data.predicted_letter;
    } catch (error) {
        console.error('Error getting prediction:', error);
        return null;
    }
}

// Update prediction display
async function updatePrediction() {
    const prediction = await getPrediction();
    if (prediction) {
        predictedLetterElement.textContent = prediction;
    }
}

// Initialize learning mode
function initLearningMode() {
    currentLetter = 'A';
    targetLetterElement.textContent = currentLetter;
    if (document.getElementById('signImage')) {
        document.getElementById('signImage').src = `../static/signs/${currentLetter}.jpg`;
    }
    loadProgress();
}

// Initialize testing mode
function initTestingMode() {
    currentLetter = getRandomLetter();
    targetLetterElement.textContent = currentLetter;
    loadTestStats();
}

// Get random letter for testing mode
function getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('completedLetters', JSON.stringify(Array.from(completedLetters)));
    localStorage.setItem('correctCount', correctCount);
    localStorage.setItem('totalAttempts', totalAttempts);
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('completedLetters');
    if (saved) {
        completedLetters = new Set(JSON.parse(saved));
        updateProgressDisplay();
    }
}

// Load test statistics
function loadTestStats() {
    correctCount = parseInt(localStorage.getItem('correctCount')) || 0;
    totalAttempts = parseInt(localStorage.getItem('totalAttempts')) || 0;
    updateScoreDisplay();
}

// Update progress display
function updateProgressDisplay() {
    if (document.getElementById('completedLetters')) {
        document.getElementById('completedLetters').textContent = completedLetters.size;
    }
}

// Update score display
function updateScoreDisplay() {
    if (document.getElementById('correctCount')) {
        document.getElementById('correctCount').textContent = correctCount;
        document.getElementById('totalAttempts').textContent = totalAttempts;
        document.getElementById('accuracy').textContent = 
            totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;
    }
}

// Handle submit button click
async function handleSubmit() {
    const prediction = predictedLetterElement.textContent;
    if (prediction === currentLetter) {
        if (isLearningMode) {
            completedLetters.add(currentLetter);
            saveProgress();
            updateProgressDisplay();
            
            if (currentLetter < 'Z') {
                currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
                targetLetterElement.textContent = currentLetter;
                if (document.getElementById('signImage')) {
                    document.getElementById('signImage').src = `../static/signs/${currentLetter}.jpg`;
                }
            } else {
                alert('Congratulations! You have completed all letters!');
            }
        } else {
            correctCount++;
            alert('Correct! Try another letter.');
            currentLetter = getRandomLetter();
            targetLetterElement.textContent = currentLetter;
        }
    } else {
        alert('Not quite right. Try again!');
    }
    
    if (!isLearningMode) {
        totalAttempts++;
        saveProgress();
        updateScoreDisplay();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    if (await initializeWebcam()) {
        // Start prediction loop
        setInterval(updatePrediction, 1000);

        // Initialize appropriate mode
        if (isLearningMode) {
            initLearningMode();
        } else {
            initTestingMode();
        }

        // Button event listeners
        clearBtn.addEventListener('click', () => {
            predictedLetterElement.textContent = '-';
        });

        submitBtn.addEventListener('click', handleSubmit);

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentLetter = getRandomLetter();
                targetLetterElement.textContent = currentLetter;
            });
        }
    }
});