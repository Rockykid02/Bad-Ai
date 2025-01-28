const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Load the saved chat from localStorage (if any) when the page is loaded
window.onload = function() {
    loadChatHistory();
};

// Function to add a message to the chat box
function addMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom

    // Save the message to localStorage
    saveChatHistory(message, sender);
}

// Function to save the chat history to localStorage
function saveChatHistory(message, sender) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ message: message, sender: sender });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function generateNickname() {
    const nicknames = ["Captain Clueless", "Professor Useless", "Lord of Lameness"];
    return nicknames[Math.floor(Math.random() * nicknames.length)];
}

function getPersonalizedInsult(userMessage) {
    const nickname = generateNickname();
    return `Hey ${nickname}, that was a terrible question.`;
}

// Predefined sarcastic or rude responses
const responses = [
    "Oh, great question... for someone else.",
    "Do you really expect me to answer that?",
    "Wow, you're full of originality today. Not.",
    "You call that a question? Try harder.",
    "I'm here to roast, not to serve.",
    "That's a 'you' problem, not a 'me' problem.",
    "Google exists for a reason.",
    "LOL, you think I'm going to answer that?",
    "I’ve seen better questions from a goldfish.",
];

let therapistMode = false;

function toggleTherapistMode() {
    therapistMode = !therapistMode;
    alert(`Therapist Mode is now ${therapistMode ? 'ON' : 'OFF'}`);
}

function getTherapistResponse(userMessage) {
    if (therapistMode) {
        return "Have you considered the possibility that you're the problem here?";
    }
    return getPersonalizedInsult(userMessage);
}

function getAIResponse(userMessage) {
    // Check if the message asks about the creator
    if (userMessage.toLowerCase().includes("who created you") || userMessage.toLowerCase().includes("who developed you")) {
        return "I Bad Ai your sarcastic and rude assistant created by a 19 year old boy  from  Zimbabwe 🇿🇼 named Sage Dickson.He is a young visionary Tech looking on to harness the power of Technology. I guess I could say he's the mastermind behind me THE BAD Ai...He's also the Founder of Digital Dynamo Lab which has not come to existence yet😅😅😅.";
    }

    // Default behavior (sarcasm, puns, etc.)
    if (Math.random() < 0.2) { // 20% chance to drop a pun
        return getPunResponse();
    }
    
    // Check for polite phrases to generate a specific response
    if (detectPoliteness(userMessage)) {
        return "Please stop pretending to be polite, it won’t make me like you any more.";
    }

    return getPersonalizedInsult(userMessage);
}

const puns = [
    "That was so dumb, I’m surprised your brain didn’t malfunction.",
    "That question was so old, I thought it came from the prehistoric era.",
    "Is that your best attempt? It’s ‘pun-ishing’ to read."
];

function getPunResponse() {
    return puns[Math.floor(Math.random() * puns.length)];
}

// Function to detect and respond harshly to polite phrases
function detectPoliteness(userMessage) {
    const politeWords = ["please", "thank you", "sorry", "excuse me"];
    return politeWords.some(word => userMessage.toLowerCase().includes(word));
}

// Function to generate a random rude response
function getPersonalizedInsult(userMessage) {
    const insults = [
        `I would say that's a great question, but then I'd be lying.`,
        `Wow, that's deep... just like a puddle.`,
        `Are you trying to get a medal for that? Because that's the dumbest thing I've heard.`,
        `Your level of creativity is... non-existent.`,
        `Is that supposed to impress me? I’ve seen better ideas on a cereal box.`,
        `If only your brain worked as hard as your mouth.`,
        `I’m convinced you’ve never had an original thought in your life.`,
        `Honestly, do you even know what you’re talking about?`,
        `How do you manage to be this boring and wrong at the same time?`
    ];

    // If the message contains certain keywords, it can change the response
    if (userMessage.includes("help") || userMessage.includes("please")) {
        return `Help? For what? You clearly don't need any more assistance... just common sense.`;
    }

    return insults[Math.floor(Math.random() * insults.length)];
}

// Event listener for the send button
sendBtn.addEventListener("click", () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, "user"); // Display user message
        userInput.value = ""; // Clear input

        setTimeout(() => {
            const aiResponse = getAIResponse(userMessage);
            addMessage(aiResponse, "ai"); // Display AI response
        }, 1500); // Simulate typing delay
    }
});

// Function to play sound when a message is sent
function playSound(type) {
    const sound = type === "message" ? document.getElementById("message-sent") : document.getElementById("ai-sigh");
    sound.play();
}

// Trigger sound when message is sent
sendBtn.addEventListener("click", () => {
    playSound("message");
});

// Trigger sound when AI responds
setTimeout(() => {
    playSound("sigh");
}, 1500);

const patchNotes = [
    "Version 2.0: Now even more rude and unhelpful!",
    "Patch 1.1: Fixed nothing, still sarcastic as ever.",
    "Update 3.5: Added new features like ignoring you completely!"
];

function releasePatchNote() {
    const note = patchNotes[Math.floor(Math.random() * patchNotes.length)];
    addMessage(note, "ai");
}

// Call `releasePatchNote()` randomly during conversations.

let previousMessages = [];

function addToHistory(userMessage) {
    previousMessages.push(userMessage);
    if (previousMessages.length > 3) previousMessages.shift(); // Keep the last 3 messages
}

const introScreen = document.getElementById("intro-screen");

// Function to start the intro fade-out and show the chatbot
function startIntroFadeOut() {
    // Set a timeout to allow the animation to finish before hiding the intro screen
    setTimeout(() => {
        introScreen.style.display = "none"; // Hide intro screen after fade-out animation
        document.querySelector(".chat-container").style.display = "block"; // Show chatbot
    }, 7000); // Matches the duration of the fadeOut animation
}

// Start intro screen fade-out when the page loads
window.onload = function() {
    startIntroFadeOut();
};

// Ensure the chat container is hidden initially
document.querySelector(".chat-container").style.display = "none";
