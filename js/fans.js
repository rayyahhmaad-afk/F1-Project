/**
 * McLaren Fans Page Interactive Logic
 * Handles Fan Poll, Trivia Quiz, Papaya Moments Lightbox, and Digital Download Center
 */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize components
    initPoll();
    initQuiz();
    initMomentsGrid();
    initKeyboardEvents();
    checkMembershipState();
});

function checkMembershipState() {
    const memberDataStr = localStorage.getItem("mclarenPlusMember");
    const joinBtn = document.getElementById("fans-join-btn");
    if (joinBtn && memberDataStr) {
        joinBtn.textContent = "Access Member Dashboard";
    }
}

// ==========================================
// 1. INTERACTIVE FAN POLL WIDGET
// ==========================================

const POLL_DATA = {
    question: "Favorite McLaren Livery of the Modern Era?",
    options: [
        "Classic Papaya & Blue (MCL38/MCL40)",
        "Stealth Mode (Singapore Special)",
        "Triple Crown Tribute (Monaco '23)",
        "Chrome Legacy (British GP '23)"
    ],
    // Initial vote baseline counts
    votes: [342, 154, 248, 110]
};

function initPoll() {
    const userVote = localStorage.getItem("mclaren_fan_poll_vote");
    if (userVote !== null) {
        showPollResults(parseInt(userVote));
    }
}

window.votePoll = function(selectedIndex) {
    // Save vote to localStorage
    localStorage.setItem("mclaren_fan_poll_vote", selectedIndex);
    
    // Animate and show results
    showPollResults(selectedIndex);
};

function showPollResults(userVoteIndex) {
    const pollOptionsEl = document.getElementById("poll-options");
    const pollResultsEl = document.getElementById("poll-results");
    const pollStatusEl = document.getElementById("poll-status");
    const resetPollBtn = document.getElementById("reset-poll-btn");

    if (!pollOptionsEl || !pollResultsEl) return;

    // Toggle view states
    pollOptionsEl.classList.add("hidden");
    pollResultsEl.classList.remove("hidden");
    resetPollBtn.classList.remove("hidden");

    // Calculate total votes (including user's vote)
    const votesCopy = [...POLL_DATA.votes];
    if (userVoteIndex >= 0 && userVoteIndex < votesCopy.length) {
        votesCopy[userVoteIndex] += 1;
    }
    
    const totalVotes = votesCopy.reduce((a, b) => a + b, 0);

    // Update status text
    pollStatusEl.textContent = "Thank you for voting! You chose option #" + (userVoteIndex + 1) + ".";
    pollStatusEl.classList.remove("text-gray-400");
    pollStatusEl.classList.add("text-papaya", "font-bold");

    // Populate and animate bars
    votesCopy.forEach((count, idx) => {
        const pct = Math.round((count / totalVotes) * 100);
        const pctEl = document.getElementById(`poll-pct-${idx}`);
        const barEl = document.getElementById(`poll-bar-${idx}`);

        if (pctEl && barEl) {
            pctEl.textContent = `${pct}% (${count} votes)`;
            
            // Highlight user selected bar with papaya, make others grey
            if (idx === userVoteIndex) {
                barEl.className = "bg-papaya h-full w-0 transition-all duration-1000 ease-out";
                pctEl.className = "text-papaya font-bold";
            } else {
                barEl.className = "bg-white/35 h-full w-0 transition-all duration-1000 ease-out";
                pctEl.className = "text-gray-400";
            }

            // Trigger reflow for animation transition to work
            setTimeout(() => {
                barEl.style.width = `${pct}%`;
            }, 50);
        }
    });
}

window.resetPoll = function() {
    localStorage.removeItem("mclaren_fan_poll_vote");

    const pollOptionsEl = document.getElementById("poll-options");
    const pollResultsEl = document.getElementById("poll-results");
    const pollStatusEl = document.getElementById("poll-status");
    const resetPollBtn = document.getElementById("reset-poll-btn");

    if (!pollOptionsEl || !pollResultsEl) return;

    // Reset views
    pollOptionsEl.classList.remove("hidden");
    pollResultsEl.classList.add("hidden");
    resetPollBtn.classList.add("hidden");

    pollStatusEl.textContent = "Cast your vote to see results!";
    pollStatusEl.className = "text-xs font-bold text-gray-400";

    // Reset bar styles
    for (let i = 0; i < POLL_DATA.options.length; i++) {
        const barEl = document.getElementById(`poll-bar-${i}`);
        if (barEl) barEl.style.width = "0%";
    }
};

// ==========================================
// 2. "McLAREN IQ" TRIVIA QUIZ WIDGET
// ==========================================

const QUIZ_QUESTIONS = [
    {
        question: "In what year did Bruce McLaren found the legendary team?",
        options: ["1963", "1966", "1970", "1981"],
        correct: 0,
        explanation: "Bruce McLaren founded Bruce McLaren Motor Racing in 1963."
    },
    {
        question: "Which legendary driver won 3 World Championships with McLaren in the late 80s and early 90s?",
        options: ["Alain Prost", "Ayrton Senna", "Mika Häkkinen", "Lewis Hamilton"],
        correct: 1,
        explanation: "Ayrton Senna won his championships in 1988, 1990, and 1991 with McLaren."
    },
    {
        question: "How many Constructors' Championships has McLaren won in total?",
        options: ["6", "8", "10", "12"],
        correct: 2, // Matches PRD assertion of 10 Constructors' World Championships
        explanation: "McLaren has secured 10 Constructors' World Championships in its illustrious history."
    }
];

let currentQuestionIndex = 0;
let quizScore = 0;
let selectedOptionIndex = null;

function initQuiz() {
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const qNumEl = document.getElementById("quiz-question-number");
    const qTitleEl = document.getElementById("quiz-question");
    const qOptionsEl = document.getElementById("quiz-options");
    const qNextBtn = document.getElementById("quiz-next-btn");
    const qFeedbackEl = document.getElementById("quiz-feedback");
    const scoreBadge = document.getElementById("quiz-score-badge");
    const scoreNum = document.getElementById("quiz-score-num");

    if (!qNumEl || !qTitleEl || !qOptionsEl) return;

    // Reset status
    selectedOptionIndex = null;
    qNextBtn.classList.add("hidden");
    qFeedbackEl.textContent = "Select an answer to progress.";
    qFeedbackEl.className = "text-xs font-bold text-gray-400";

    const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
    qNumEl.textContent = `Question ${currentQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}`;
    qTitleEl.textContent = currentQ.question;
    
    // Show current score badge if active
    if (currentQuestionIndex > 0) {
        scoreBadge.classList.remove("hidden");
        scoreNum.textContent = quizScore;
    } else {
        scoreBadge.classList.add("hidden");
    }

    // Generate options HTML
    qOptionsEl.innerHTML = "";
    currentQ.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "w-full text-left border border-white/10 hover:border-papaya hover:bg-white/5 bg-white/5 transition-all duration-300 rounded-sm px-6 py-4 font-bold flex justify-between items-center group cursor-pointer";
        btn.innerHTML = `
            <span>${opt}</span>
            <span class="icon-indicator flex items-center justify-center w-5 h-5 border border-white/20 rounded-full group-hover:border-papaya transition-all text-xs font-black">
                ${String.fromCharCode(65 + idx)}
            </span>
        `;
        btn.onclick = () => selectQuizOption(idx, btn);
        qOptionsEl.appendChild(btn);
    });
}

window.selectQuizOption = function(optionIndex, selectedBtn) {
    if (selectedOptionIndex !== null) return; // Answer locked
    
    selectedOptionIndex = optionIndex;
    const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
    const optionsContainer = document.getElementById("quiz-options");
    const optionButtons = optionsContainer.getElementsByTagName("button");
    const qFeedbackEl = document.getElementById("quiz-feedback");
    const qNextBtn = document.getElementById("quiz-next-btn");

    const isCorrect = optionIndex === currentQ.correct;

    if (isCorrect) {
        quizScore++;
        // Style selected option as correct (green)
        selectedBtn.className = "w-full text-left border border-emerald-500 bg-emerald-500/20 text-white transition-all duration-300 rounded-sm px-6 py-4 font-bold flex justify-between items-center";
        selectedBtn.querySelector(".icon-indicator").outerHTML = `
            <span class="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
        `;
        
        qFeedbackEl.textContent = `Correct! ${currentQ.explanation}`;
        qFeedbackEl.className = "text-xs font-bold text-emerald-400";
    } else {
        // Style selected option as incorrect (red)
        selectedBtn.className = "w-full text-left border border-rose-500 bg-rose-500/20 text-white transition-all duration-300 rounded-sm px-6 py-4 font-bold flex justify-between items-center";
        selectedBtn.querySelector(".icon-indicator").outerHTML = `
            <span class="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px]">✕</span>
        `;

        // Highlight correct option in green
        const correctBtn = optionButtons[currentQ.correct];
        correctBtn.className = "w-full text-left border border-emerald-500 bg-emerald-500/20 text-white transition-all duration-300 rounded-sm px-6 py-4 font-bold flex justify-between items-center";
        correctBtn.querySelector(".icon-indicator").outerHTML = `
            <span class="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</span>
        `;

        qFeedbackEl.textContent = `Incorrect. ${currentQ.explanation}`;
        qFeedbackEl.className = "text-xs font-bold text-rose-400";
    }

    // Disable all options (remove cursors and hover pointers)
    for (let btn of optionButtons) {
        btn.classList.remove("hover:border-papaya", "hover:bg-white/5", "cursor-pointer");
        btn.classList.add("cursor-default");
    }

    // Show Next button
    qNextBtn.classList.remove("hidden");
    if (currentQuestionIndex === QUIZ_QUESTIONS.length - 1) {
        qNextBtn.textContent = "See Scorecard";
    } else {
        qNextBtn.textContent = "Next Question";
    }
};

window.nextQuizQuestion = function() {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        currentQuestionIndex++;
        renderQuizQuestion();
    } else {
        showQuizScorecard();
    }
};

function showQuizScorecard() {
    const qNumEl = document.getElementById("quiz-question-number");
    const qContainer = document.getElementById("quiz-container");
    const qNextBtn = document.getElementById("quiz-next-btn");
    const qFeedbackEl = document.getElementById("quiz-feedback");
    const scoreBadge = document.getElementById("quiz-score-badge");

    scoreBadge.classList.add("hidden");
    qNumEl.textContent = "Trivia Complete";
    qNextBtn.classList.add("hidden");
    
    // Evaluate driver rank
    let rankTitle = "";
    let rankColor = "";
    let rankDesc = "";

    if (quizScore === 3) {
        rankTitle = "Championship Winner 🏆";
        rankColor = "text-papaya";
        rankDesc = "Incredible! You have supreme knowledge of McLaren Racing history. You're fit for the driver's seat!";
    } else if (quizScore === 2) {
        rankTitle = "Podium Finisher 🥈";
        rankColor = "text-white";
        rankDesc = "Excellent effort! You clearly know your history. Just a few details off from the top step.";
    } else if (quizScore === 1) {
        rankTitle = "Rookie Driver 🏎️";
        rankColor = "text-gray-300";
        rankDesc = "Good try! You've got the speed, but need more laps to master the historical details.";
    } else {
        rankTitle = "DNF (Did Not Finish) 🛑";
        rankColor = "text-rose-500";
        rankDesc = "Engine failure! Hit the simulators and study room before the next race.";
    }

    qFeedbackEl.textContent = "Quiz complete! Share your score with the Papaya Army.";
    qFeedbackEl.className = "text-xs font-bold text-gray-400";

    qContainer.innerHTML = `
        <div class="text-center py-6 fade-in-up">
            <h4 class="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Your Rating</h4>
            <h3 class="text-3xl font-black uppercase mb-4 ${rankColor}">${rankTitle}</h3>
            
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-papaya bg-neutral-900 mb-6 shadow-lg">
                <span class="text-3xl font-black text-white">${quizScore}<span class="text-xs text-gray-500 font-normal">/3</span></span>
            </div>
            
            <p class="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm mx-auto font-medium">${rankDesc}</p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button onclick="shareQuizScore()" id="quiz-share-btn" class="bg-papaya text-white hover:bg-orange-600 transition-colors font-bold px-6 py-3 text-xs uppercase tracking-widest clip-slanted-button flex items-center justify-center gap-2">
                    Share Score
                </button>
                <button onclick="resetQuiz()" class="border border-white/20 text-white hover:bg-white/5 transition-all font-bold px-6 py-3 text-xs uppercase tracking-widest clip-slanted-button">
                    Try Again
                </button>
            </div>
        </div>
    `;
}

window.shareQuizScore = function() {
    const text = `I scored ${quizScore}/3 on the McLaren IQ Trivia Quiz! 🏎️ Can you beat me? Test your knowledge at McLaren Racing Fans! #FansLikeNoOther`;
    
    navigator.clipboard.writeText(text).then(() => {
        const shareBtn = document.getElementById("quiz-share-btn");
        if (shareBtn) {
            const originalHTML = shareBtn.innerHTML;
            shareBtn.innerHTML = `Copied to Clipboard! ✓`;
            shareBtn.className = "bg-emerald-600 text-white font-bold px-6 py-3 text-xs uppercase tracking-widest clip-slanted-button flex items-center justify-center gap-2";
            
            setTimeout(() => {
                shareBtn.innerHTML = originalHTML;
                shareBtn.className = "bg-papaya text-white hover:bg-orange-600 transition-colors font-bold px-6 py-3 text-xs uppercase tracking-widest clip-slanted-button flex items-center justify-center gap-2";
            }, 2000);
        }
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
};

window.resetQuiz = function() {
    currentQuestionIndex = 0;
    quizScore = 0;
    selectedOptionIndex = null;
    
    // Restore question container structure
    const qContainer = document.getElementById("quiz-container");
    if (qContainer) {
        qContainer.innerHTML = `
            <div id="quiz-question-box">
                <h3 id="quiz-question" class="text-xl md:text-2xl font-bold uppercase mb-6 tracking-tight leading-snug"></h3>
                <div id="quiz-options" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
            </div>
        `;
    }
    
    renderQuizQuestion();
};

// ==========================================
// 3. ENHANCED "PAPAYA MOMENTS" WALL & LIGHTBOX
// ==========================================

const MOMENTS_DATA = [
    {
        id: "moment0",
        image: "https://images.unsplash.com/photo-1540039155732-d6741b6877b0?q=80&w=1000",
        author: "@papaya_army_uk",
        caption: "Silverstone was absolutely electric this weekend! Chants of Lando all day long! 🏎️🇬🇧 #FansLikeNoOther #SilverstoneGP",
        likes: 124
    },
    {
        id: "moment1",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000",
        author: "@lando_4_life",
        caption: "Finally got my hands on the 2026 driver cap. Ready for the next race! 🧡 #FansLikeNoOther #LandoNorris",
        likes: 89
    },
    {
        id: "moment2",
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1000",
        author: "@oscar_fan_au",
        caption: "Waking up at 4 AM in Australia to watch Oscar take the podium! Worth every second! 🇦🇺🏆 #FansLikeNoOther #Piastri",
        likes: 215
    },
    {
        id: "moment3",
        image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000",
        author: "@mclaren_garage",
        caption: "Wallpaper engine looking clean with the new MCL40 render. Papaya looks amazing under these lights! 💻🔥 #FansLikeNoOther",
        likes: 76
    },
    {
        id: "moment4",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000",
        author: "@sim_racer_orange",
        caption: "Practicing my hot laps on Spa in the virtual McLaren 720S GT3. Virtual papaya army! 🎮🧡 #FansLikeNoOther",
        likes: 143
    },
    {
        id: "moment5",
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000",
        author: "@classic_mcl",
        caption: "Spotted this beautiful MP4/4 replica at the local car show. A piece of motorsport history. 🏁🏆 #FansLikeNoOther #Senna",
        likes: 312
    }
];

let activeLightboxPostId = null;

function initMomentsGrid() {
    const gridEl = document.getElementById("moments-grid");
    if (!gridEl) return;

    gridEl.innerHTML = "";

    // Load liked moments array from localStorage
    const likedMoments = getLikedMoments();

    MOMENTS_DATA.forEach(moment => {
        const isLiked = likedMoments.includes(moment.id);
        const displayLikes = moment.likes + (isLiked ? 1 : 0);

        const card = document.createElement("div");
        card.className = "aspect-square rounded-sm overflow-hidden group cursor-pointer relative shadow-lg bg-neutral-900 border border-white/5";
        card.onclick = () => openLightbox(moment.id);

        card.innerHTML = `
            <img src="${moment.image}" class="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Fan photo by ${moment.author}">
            <!-- Overlay and Details -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-20">
                <p class="text-papaya font-bold text-sm mb-1">${moment.author}</p>
                <p class="text-white text-xs line-clamp-2 leading-relaxed mb-3 font-medium">${moment.caption}</p>
                <div class="flex items-center gap-2 text-white">
                    <svg class="w-4 h-4 ${isLiked ? 'text-papaya fill-current' : 'text-gray-400 fill-none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    <span class="text-xs font-bold">${displayLikes} likes</span>
                </div>
            </div>
            <!-- Standard hover interaction layer for accessibility -->
            <div class="absolute inset-0 bg-papaya/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                <svg class="w-8 h-8 text-white scale-90 group-hover:scale-100 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
        `;
        gridEl.appendChild(card);
    });
}

function getLikedMoments() {
    const list = localStorage.getItem("mclaren_liked_moments");
    return list ? JSON.parse(list) : [];
}

function saveLikedMoments(list) {
    localStorage.setItem("mclaren_liked_moments", JSON.stringify(list));
}

window.openLightbox = function(postId) {
    const post = MOMENTS_DATA.find(m => m.id === postId);
    if (!post) return;

    activeLightboxPostId = postId;

    const modal = document.getElementById("lightbox-modal");
    const img = document.getElementById("lightbox-img");
    const author = document.getElementById("lightbox-author");
    const caption = document.getElementById("lightbox-caption");
    const likeCount = document.getElementById("lightbox-like-count");
    const likeIcon = document.getElementById("lightbox-like-icon");

    img.src = post.image;
    author.textContent = post.author;
    caption.textContent = post.caption;

    const likedMoments = getLikedMoments();
    const isLiked = likedMoments.includes(postId);
    const displayLikes = post.likes + (isLiked ? 1 : 0);

    likeCount.textContent = displayLikes;
    
    // Set heart fill based on liked state
    if (isLiked) {
        likeIcon.setAttribute("fill", "currentColor");
        likeIcon.setAttribute("class", "w-6 h-6 text-papaya");
    } else {
        likeIcon.setAttribute("fill", "none");
        likeIcon.setAttribute("class", "w-6 h-6 text-gray-400 group-hover:text-papaya transition-colors");
    }

    // Animate open
    modal.classList.remove("opacity-0", "pointer-events-none");
    document.body.style.overflow = "hidden"; // Prevent body scroll
};

window.closeLightbox = function() {
    const modal = document.getElementById("lightbox-modal");
    if (modal) {
        modal.classList.add("opacity-0", "pointer-events-none");
    }
    document.body.style.overflow = ""; // Re-enable body scroll
    activeLightboxPostId = null;
};

window.toggleLikeCurrentPost = function() {
    if (!activeLightboxPostId) return;

    const postIndex = MOMENTS_DATA.findIndex(m => m.id === activeLightboxPostId);
    if (postIndex === -1) return;

    const post = MOMENTS_DATA[postIndex];
    let likedMoments = getLikedMoments();
    const hasLiked = likedMoments.includes(activeLightboxPostId);

    const likeIcon = document.getElementById("lightbox-like-icon");
    const likeCount = document.getElementById("lightbox-like-count");

    if (hasLiked) {
        // Unlike post
        likedMoments = likedMoments.filter(id => id !== activeLightboxPostId);
        likeIcon.setAttribute("fill", "none");
        likeIcon.setAttribute("class", "w-6 h-6 text-gray-400 group-hover:text-papaya transition-colors");
        
        post.likes--; // Local memory update
        likeCount.textContent = post.likes;
    } else {
        // Like post
        likedMoments.push(activeLightboxPostId);
        likeIcon.setAttribute("fill", "currentColor");
        likeIcon.setAttribute("class", "w-6 h-6 text-papaya");
        
        post.likes++; // Local memory update
        likeCount.textContent = post.likes;
    }

    saveLikedMoments(likedMoments);
    
    // Refresh grid representations in the background
    initMomentsGrid();
};

window.shareMoment = function() {
    if (!activeLightboxPostId) return;
    const post = MOMENTS_DATA.find(m => m.id === activeLightboxPostId);
    if (!post) return;

    const shareText = `Check out this amazing Papaya Moment from ${post.author} on McLaren Racing: "${post.caption}" #FansLikeNoOther`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        // Show temporary modal alert or message
        const originalCaption = post.caption;
        const captionEl = document.getElementById("lightbox-caption");
        
        captionEl.textContent = "✓ Share link copied to clipboard!";
        captionEl.className = "text-emerald-400 text-sm md:text-base leading-relaxed mb-6 font-bold";
        
        setTimeout(() => {
            captionEl.textContent = originalCaption;
            captionEl.className = "text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-medium";
        }, 2000);
    });
};

function initKeyboardEvents() {
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeLightbox();
        }
    });
}

// ==========================================
// 4. DIGITAL DOWNLOAD CENTER
// ==========================================

const WALLPAPERS = [
    {
        title: "MCL40 Track Debut",
        url: "https://images.unsplash.com/photo-1540039155732-d6741b6877b0?q=80&w=3840"
    },
    {
        title: "Lando Norris Monaco Victory",
        url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=3840"
    },
    {
        title: "Classic Heritage MP4/4",
        url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=3840"
    }
];

window.startDownload = function(idx) {
    const dlBtn = document.getElementById(`dl-btn-${idx}`);
    const progressContainer = document.getElementById(`dl-progress-container-${idx}`);
    const progressBar = document.getElementById(`dl-progress-bar-${idx}`);
    const progressPct = document.getElementById(`dl-progress-pct-${idx}`);
    const resolutionSelect = document.getElementById(`res-select-${idx}`);

    if (!progressContainer || !progressBar || !progressPct) return;

    // Show progress overlay
    progressContainer.classList.remove("hidden");

    let progress = 0;
    progressBar.style.width = "0%";
    progressPct.textContent = "0%";

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            progressBar.style.width = "100%";
            progressPct.textContent = "100%";
            
            // Trigger actual download (opens photo in new window/tab, simulating download)
            setTimeout(() => {
                const resolution = resolutionSelect ? resolutionSelect.value : "desktop";
                const baseImg = WALLPAPERS[idx].url;
                
                // Add query parameter to fit dimension depending on selection
                let downloadUrl = baseImg;
                if (resolution === "mobile") {
                    downloadUrl = baseImg.replace("w=3840", "w=1080&h=1920&fit=crop");
                }
                
                // Trigger download
                triggerFileDownload(downloadUrl, `${WALLPAPERS[idx].title.replace(/\s+/g, "_")}_${resolution}.jpg`);
                
                // Show completion indicator
                progressContainer.innerHTML = `
                    <span class="relative z-10 flex items-center gap-2 text-emerald-400">
                        ✓ Download Completed
                    </span>
                `;
                
                // Hide progress overlay after 2 seconds and restore original button
                setTimeout(() => {
                    progressContainer.classList.add("hidden");
                    // Restore original HTML layout inside container
                    progressContainer.innerHTML = `
                        <div id="dl-progress-bar-${idx}" class="absolute left-0 top-0 bottom-0 bg-papaya/30 w-0 transition-all duration-300"></div>
                        <span class="relative z-10 flex items-center gap-2">
                            <svg class="animate-spin h-3.5 w-3.5 text-papaya" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Downloading...
                        </span>
                        <span id="dl-progress-pct-${idx}" class="relative z-10 text-papaya">0%</span>
                    `;
                }, 2000);

            }, 500);
        } else {
            progressBar.style.width = `${progress}%`;
            progressPct.textContent = `${progress}%`;
        }
    }, 150);
};

function triggerFileDownload(url, filename) {
    // Attempt download using virtual anchor
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
