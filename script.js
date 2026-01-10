const firebaseConfig = {
    apiKey: "AIzaSyC71ejjCauI7QnNHLxN-b1ywYtDp4SNhkA",
    authDomain: "website-xova.firebaseapp.com",
    projectId: "website-xova",
    storageBucket: "website-xova.firebasestorage.app",
    messagingSenderId: "627000594596",
    appId: "1:627000594596:web:6231b7419caebd6fab5631"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const authScreen = document.getElementById("auth-screen");
const loginBtns = document.querySelectorAll(".btn-login");
const signupBtns = document.querySelectorAll(".btn-signup");
const closeAuth = document.getElementById("auth-close");
const authToggle = document.getElementById("auth-toggle-text");
const authTitle = document.getElementById("auth-title");
const authBtn = document.getElementById("auth-button");

let toastTimeout;
let animationTriggered = false;

/**
 * Shows a toast notification.
 * @param {string} message The message to display.
 * @param {boolean} isError If true, shows an error-styled toast.
 */
function showToast(message, isError = false) {
    clearTimeout(toastTimeout);
    const toast = document.createElement('div');
    toast.className = `toast-notification show ${isError ? 'error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    toastTimeout = setTimeout(() => {
        toast.remove();
    }, 3000);
}

let mode = "login";

function openAuth(type) {
    mode = type;
    authTitle.innerText = type === "login" ? "Login" : "Sign Up";
    authBtn.innerText = type === "login" ? "Login" : "Create Account";
    authScreen.classList.remove("hidden");
}

/**
 * Hides the auth screen and clears the input fields.
 */
function closeAndResetAuth() {
    authScreen.classList.add("hidden");
    document.getElementById("auth-email").value = "";
    document.getElementById("auth-password").value = "";
}

loginBtns.forEach(btn => btn.onclick = () => openAuth("login"));
signupBtns.forEach(btn => btn.onclick = () => openAuth("signup"));
closeAuth.onclick = closeAndResetAuth;

authToggle.onclick = () => {
    openAuth(mode === "login" ? "signup" : "login");
};

authBtn.onclick = async () => {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    try {
        if (mode === "login") {
            await auth.signInWithEmailAndPassword(email, password);
            showToast("Welcome back!");
            console.log("Welcome back!");
        } else {
            await auth.createUserWithEmailAndPassword(email, password);
            showToast("Account created! Welcome!");
            console.log("Account created! Welcome!");
        }
        closeAndResetAuth();
    } catch (err) {
        showToast(err.message, true);
        alert(err.message);
    }
};

document.getElementById("google-signin").onclick = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        showToast("Logged in with Google!");
        console.log("Logged in with Google!");
        closeAndResetAuth();
    } catch (err) {
        showToast(err.message, true);
        alert(err.message);
    }
};

// --- AUTH STATE OBSERVER ---
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User is logged in:", user.email);
        document.body.classList.add("logged-in");
    } else {
        console.log("User is logged out.");
        document.body.classList.remove("logged-in");
    }
});

// --- LOGOUT BUTTON ---
const logoutBtn = document.getElementById("btn-logout");
const mobileLogoutBtn = document.getElementById("mobile-btn-logout");

const handleLogout = () => {
    auth.signOut().then(() => {
        showToast("You have been logged out.");
        console.log("You have been logged out.");
    }).catch(err => {
        showToast(err.message, true);
        alert(err.message);
    });
};

if (logoutBtn) logoutBtn.onclick = handleLogout;
if (mobileLogoutBtn) mobileLogoutBtn.onclick = handleLogout;

// --- PRELOADER FADE OUT & FAVICON ANIMATION (ONLY ONCE) ---
window.addEventListener('load', () => {
    if (animationTriggered) return; // Prevent double trigger
    animationTriggered = true;

    const preloader = document.getElementById('preloader');
    const faviconIcon = document.getElementById('favicon-icon');
    
    setTimeout(() => {
        // Hide preloader
        preloader.classList.add('hidden');
        
        // Start favicon animation AFTER preloader hides
        if (faviconIcon) {
            faviconIcon.classList.add('animate');
        }
    }, 1500);
});

// --- SCROLL ANIMATIONS ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// --- CAROUSEL NAVIGATION ---
const scrollRightBtn = document.getElementById('scroll-right');
const scrollLeftBtn = document.getElementById('scroll-left');
const gamesCarousel = document.getElementById('games-carousel');

if (scrollRightBtn && scrollLeftBtn && gamesCarousel) {
    scrollRightBtn.addEventListener('click', () => {
        const cardWidth = gamesCarousel.querySelector('.game-card')?.offsetWidth || 280;
        const gap = 30;
        gamesCarousel.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    });
    scrollLeftBtn.addEventListener('click', () => {
        const cardWidth = gamesCarousel.querySelector('.game-card')?.offsetWidth || 280;
        const gap = 30;
        gamesCarousel.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    });
}

// --- MOBILE HAMBURGER MENU ---
const hamburgerMenu = document.getElementById('hamburger-menu');
const mobileNav = document.getElementById('mobile-nav');
const navLinks = mobileNav.querySelectorAll('a');

if (hamburgerMenu && mobileNav) {
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('is-active');
        mobileNav.classList.toggle('is-open');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('is-active');
        mobileNav.classList.remove('is-open');
    });
});

// --- ALL GAMES SCREEN LOGIC ---
const allGamesScreen = document.getElementById('all-games-screen');
const exploreGamesBtn = document.getElementById('explore-games-btn');
const allGamesCloseBtn = document.getElementById('all-games-close');

if (exploreGamesBtn && allGamesScreen && allGamesCloseBtn) {
    exploreGamesBtn.addEventListener('click', () => {
        renderGames();
        allGamesScreen.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    allGamesCloseBtn.addEventListener('click', () => {
        allGamesScreen.classList.add('hidden');
        document.body.style.overflow = '';
    });
}
// ... existing code ...

// --- DYNAMIC GAME CARDS GENERATION ---
const gamesData = [
    {
        title: "Encrypt File Maker",
        category: "Tools",
        image: "Encrypt_Text_Maker.webp"
    }
];

function renderGames() {
    const carousel = document.getElementById('games-carousel');
    const allGamesGrid = document.querySelector('.all-games-grid');

    const createCard = (game) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="game-image-wrapper">
                <img src="${game.image}" alt="${game.title}" class="game-icon">
            </div>
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>${game.category}</p>
            </div>
        `;
        return card;
    };

    if (carousel) {
        carousel.innerHTML = '';
        gamesData.forEach(game => carousel.appendChild(createCard(game)));
    }

    if (allGamesGrid) {
        allGamesGrid.innerHTML = '';
        gamesData.forEach(game => allGamesGrid.appendChild(createCard(game)));
    }
}

// Render games on load
document.addEventListener('DOMContentLoaded', () => {
    renderGames();
});

// ... rest of existing code ...