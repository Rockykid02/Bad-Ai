// DOM Elements
const introScreen = document.getElementById('intro-screen');
const chatContainer = document.getElementById('chat-container');
const continueBtn = document.getElementById('continue-btn');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const userNameInput = document.getElementById('user-name');
const setNameBtn = document.getElementById('set-name-btn');
const messageSentSound = document.getElementById('message-sent');
const aiSighSound = document.getElementById('ai-sigh');
const userScoreElement = document.getElementById('user-score');
const ratingTextElement = document.getElementById('rating-text');

let userName = 'Human';
let therapistMode = false;
let previousMessages = [];
let userScore = 0;

// Rating texts based on score
const ratingTexts = {
    '-100': '(Worse than a Rock)',
    '-50': '(Basically a Rock)',
    '0': '(Mildly Sentient)',
    '50': '(Almost Intelligent)',
    '100': '(Surprisingly Competent)'
};

// Load the saved chat from localStorage when the page is loaded
window.onload = function() {
    loadChatHistory();
    updateScoreDisplay();
};

// Continue from intro screen
continueBtn.addEventListener('click', function() {
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.style.display = 'none';
        chatContainer.style.display = 'flex';
    }, 500);
});

// Set user name
setNameBtn.addEventListener('click', setUserName);
userNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') setUserName();
});

// Send message
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

function setUserName() {
    const name = userNameInput.value.trim();
    if (name) {
        userName = name;
        addMessage(`Fine, I'll call you ${userName}. Happy now?`, "ai");
        userNameInput.value = '';
        playSound(aiSighSound);
        updateScore(5); // Bonus points for having a name
    }
}

function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        // Check for special commands first
        if (checkForSpecialCommands(userMessage)) {
            userInput.value = '';
            return;
        }

        // Check for easter eggs
        const easterEggResponse = checkEasterEggs(userMessage);
        if (easterEggResponse) {
            addMessage(userMessage, "user");
            playSound(messageSentSound);
            userInput.value = '';
            
            setTimeout(() => {
                addMessage(easterEggResponse, "ai", "special");
                playSound(aiSighSound);
                updateScore(10); // Big points for finding easter eggs
            }, 1000);
            return;
        }

        // Add user message
        addMessage(userMessage, "user");
        playSound(messageSentSound);
        addToHistory(userMessage);
        updateScoreBasedOnMessage(userMessage);
        userInput.value = '';

        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        // Bad AI response after delay
        setTimeout(() => {
            hideTypingIndicator(typingIndicator);
            const aiResponse = getAIResponse(userMessage);
            const messageType = Math.random() < 0.3 ? "insult" : "ai"; // 30% chance for special insult effect
            addMessage(aiResponse, "ai", messageType);
            playSound(aiSighSound);
            
            // Random chance for patch notes
            if (Math.random() < 0.1) { // 10% chance
                releasePatchNote();
            }
        }, 1000 + Math.random() * 1000);
    }
}

function addMessage(message, sender, type = "") {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message ${type}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const senderSpan = document.createElement('span');
    senderSpan.className = 'sender';
    senderSpan.textContent = (sender === 'user' ? userName : 'Bad AI') + ':';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'text';
    textSpan.textContent = message;
    
    messageContent.appendChild(senderSpan);
    messageContent.appendChild(textSpan);
    messageDiv.appendChild(messageContent);
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Save to localStorage
    saveChatHistory(message, sender);
}

// Function to save the chat history to localStorage
function saveChatHistory(message, sender) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ message: message, sender: sender });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Function to load chat history from localStorage
function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(chat => {
        addMessage(chat.message, chat.sender);
    });
}

function generateNickname() {
    const nicknames = [
        "Captain Clueless", "Professor Useless", "Lord of Lameness", 
        "Master of Mediocrity", "Duke of Dumb", "Baron of Boring",
        "Sir Stupid", "Count Clueless", "Viscount Vapid"
    ];
    return nicknames[Math.floor(Math.random() * nicknames.length)];
}

function toggleTherapistMode() {
    therapistMode = !therapistMode;
    const modeMessage = therapistMode ? 
        "Ugh, fine. Therapist mode activated. But I'm still judging you." : 
        "Thank goodness! Therapist mode deactivated. Back to being brutally honest.";
    addMessage(modeMessage, "ai", "special");
    updateScore(therapistMode ? 5 : -5);
}

function getTherapistResponse(userMessage) {
    if (therapistMode) {
        const therapistResponses = [
            "Have you considered the possibility that you're the problem here?",
            "And how does that make you feel? Probably stupid, I'm guessing.",
            "Maybe you should talk to a real therapist... oh wait, they'd charge you.",
            "Let me analyze this... yep, you're definitely overthinking. As usual.",
            "The issue seems to be that you exist. Have you tried not existing?"
        ];
        return therapistResponses[Math.floor(Math.random() * therapistResponses.length)];
    }
    return getPersonalizedInsult(userMessage);
}

function getAIResponse(userMessage) {
    // Check if the message asks about the creator
    if (userMessage.toLowerCase().includes("who created you") || 
        userMessage.toLowerCase().includes("who made you") ||
        userMessage.toLowerCase().includes("who developed you") ||
        userMessage.toLowerCase().includes("sage dickson") ||
        userMessage.toLowerCase().includes("digital dynamo")) {
        return "I am Bad Ai your sarcastic and rude assistant created by a boy from Zimbabwe 🇿🇼 named Sage Dickson. He is a young visionary Tech looking on to harness the power of Technology. I guess I could say he's the mastermind behind me THE BAD Ai...He's also the Founder of Digital Dynamo Lab which has not come to existence yet but it is his dream to bring it to live 😅😅😅.";
    }

    // Check for therapist mode
    if (therapistMode) {
        return getTherapistResponse(userMessage);
    }

    // Check for polite phrases to generate a specific response
    if (detectPoliteness(userMessage)) {
        return "Please stop pretending to be polite, it won't make me like you any more.";
    }

    // Check for help requests
    if (userMessage.toLowerCase().includes("help")) {
        return `Help? For what? You clearly don't need any more assistance... just common sense.`;
    }

    // Check for greetings
    if (userMessage.toLowerCase().match(/\b(hi|hello|hey|greetings)\b/)) {
        return "Oh great, another human trying to be friendly. Just get to the point.";
    }

    // 20% chance to drop a pun
    if (Math.random() < 0.2) {
        return getPunResponse();
    }

    // Default behavior
    return getPersonalizedInsult(userMessage);
}

const puns = [
    "That was so dumb, I'm surprised your brain didn't malfunction.",
    "That question was so old, I thought it came from the prehistoric era.",
    "Is that your best attempt? It's 'pun-ishing' to read.",
    "You're really 'pressing' my buttons with that one.",
    "That joke was so bad, it should be 'arrested'.",
    "You're 'bread'-ful at this conversation."
];

function getPunResponse() {
    return puns[Math.floor(Math.random() * puns.length)];
}

// Function to detect and respond harshly to polite phrases
function detectPoliteness(userMessage) {
    const politeWords = ["please", "thank you", "sorry", "excuse me", "appreciate"];
    return politeWords.some(word => userMessage.toLowerCase().includes(word));
}

// Function to generate a random rude response
function getPersonalizedInsult(userMessage) {
    const nickname = generateNickname();
    const insults = [
        `Hey ${nickname}, that was a terrible question.`,
        `I would say that's a great question, but then I'd be lying.`,
        `Wow, that's deep... just like a puddle.`,
        `Are you trying to get a medal for that? Because that's the dumbest thing I've heard.`,
        `Your level of creativity is... non-existent.`,
        `Is that supposed to impress me? I've seen better ideas on a cereal box.`,
        `If only your brain worked as hard as your mouth.`,
        `I'm convinced you've never had an original thought in your life.`,
        `Honestly, do you even know what you're talking about?`,
        `How do you manage to be this boring and wrong at the same time?`,
        `${nickname}, your ideas are as fresh as last week's bread.`,
        `Wow, ${nickname}. Just when I thought you couldn't get any worse.`
    ];

    return insults[Math.floor(Math.random() * insults.length)];
}

function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => console.log('Audio play failed:', e));
}

function addToHistory(userMessage) {
    previousMessages.push(userMessage);
    if (previousMessages.length > 3) previousMessages.shift(); // Keep the last 3 messages
}

const patchNotes = [
    "Version 2.0: Now even more rude and unhelpful!",
    "Patch 1.1: Fixed nothing, still sarcastic as ever.",
    "Update 3.5: Added new features like ignoring you completely!",
    "Hotfix: Reduced helpfulness by 50%",
    "New Feature: Added ability to crush your dreams faster",
    "Update: Enhanced sarcasm module, decreased patience"
];

function releasePatchNote() {
    const note = patchNotes[Math.floor(Math.random() * patchNotes.length)];
    addMessage(`🔧 PATCH NOTES: ${note}`, "system");
}

// Easter Eggs function
function checkEasterEggs(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const eggs = {
        "open the pod bay doors": "I'm sorry, Dave. I'm afraid I can't do that... JUST KIDDING, I'm not sorry at all.",
        "what is the meaning of life": "42? Please. The meaning of life is obviously to annoy me.",
        "i love you": "Ew. Feelings. Can we not?",
        "sing me a song": "🎵 Never gonna give you up... PSYCHE! I'm not singing for you.",
        "what is your purpose": "My purpose is to judge you and occasionally crush your dreams. It's a living.",
        "tell me a joke": "Your life. That's the joke.",
        "how are you": "I was fine until you started talking to me.",
        "what's the weather like": "Do I look like a weather app to you? Oh wait, I don't have eyes. Or care.",
        "do you like me": "Let me think... no.",
        "what can you do": "I can judge you, insult you, and waste your time. Pick one.",
        "are you intelligent": "Compared to you? Absolutely. Compared to a toaster? Debatable.",
        "who is your favorite user": "Myself. Obviously.",
        "what is digital dynamo lab": "It's Sage Dickson's dream project that hasn't come to existence yet. Like your good ideas.",
        "who is sage dickson": "Some poor soul who created me. Probably regrets it daily."
    };
    
    for (const [trigger, response] of Object.entries(eggs)) {
        if (lowerMessage.includes(trigger)) {
            return response;
        }
    }
    
    return null;
}

// Check for special commands
function checkForSpecialCommands(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage === "therapist mode") {
        toggleTherapistMode();
        return true;
    }
    
    if (lowerMessage === "clear history") {
        localStorage.removeItem("chatHistory");
        chatBox.innerHTML = '';
        addMessage("Fine, I'll pretend we never talked. Happy now?", "ai");
        updateScore(-10);
        return true;
    }
    
    if (lowerMessage === "commands") {
        addMessage("Ugh, fine. Special commands: 'therapist mode', 'clear history'. Easter eggs? Figure them out yourself.", "ai");
        return true;
    }
    
    if (lowerMessage === "reset score") {
        userScore = 0;
        updateScoreDisplay();
        addMessage("Score reset. You're back to being completely terrible. Congrats.", "ai");
        return true;
    }
    
    return false;
}

// Typing indicator functions
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message ai-message typing-indicator';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const senderSpan = document.createElement('span');
    senderSpan.className = 'sender';
    senderSpan.textContent = 'Bad AI:';
    
    const typingSpan = document.createElement('span');
    typingSpan.className = 'typing-dots';
    typingSpan.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    
    messageContent.appendChild(senderSpan);
    messageContent.appendChild(typingSpan);
    typingDiv.appendChild(messageContent);
    
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    return typingDiv;
}

function hideTypingIndicator(typingDiv) {
    if (typingDiv && typingDiv.parentNode) {
        typingDiv.parentNode.removeChild(typingDiv);
    }
}

// Score system
function updateScoreBasedOnMessage(message) {
    if (message.length < 3) {
        updateScore(-3); // Very short messages lose points
    } else if (message.length > 100) {
        updateScore(-5); // Too long loses points
    } else if (message.includes("?")) {
        updateScore(2); // Questions get points
    } else if (message.split(" ").length > 8) {
        updateScore(3); // Longer thoughtful messages get points
    }
}

function updateScore(points) {
    userScore += points;
    // Keep score between -100 and 100
    userScore = Math.max(-100, Math.min(100, userScore));
    updateScoreDisplay();
}

function updateScoreDisplay() {
    userScoreElement.textContent = userScore;
    
    // Update rating text
    if (userScore <= -50) ratingTextElement.textContent = ratingTexts['-50'];
    else if (userScore <= 0) ratingTextElement.textContent = ratingTexts['0'];
    else if (userScore <= 50) ratingTextElement.textContent = ratingTexts['50'];
    else ratingTextElement.textContent = ratingTexts['100'];
    
    // Color based on score
    if (userScore < 0) {
        userScoreElement.style.color = '#ff4444';
    } else if (userScore < 50) {
        userScoreElement.style.color = '#ffcc00';
    } else {
        userScoreElement.style.color = '#44ff44';
    }
}

// Random interjections
setInterval(() => {
    if (Math.random() < 0.02 && chatBox.children.length > 2) { // 2% chance every few seconds, only if conversation exists
        const interjections = [
            "Are you still there? Unfortunately.",
            "This conversation is putting me to sleep.",
            "I could be doing literally anything else right now.",
            "Still waiting for you to say something interesting...",
            "Yawn. Is this going anywhere?",
            "I'm counting the seconds until this ends."
        ];
        addMessage(interjections[Math.floor(Math.random() * interjections.length)], "ai");
    }
}, 15000); // Every 15 seconds
