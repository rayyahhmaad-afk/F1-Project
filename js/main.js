document.addEventListener("DOMContentLoaded", () => {
    // --- Intersection Observer Logic ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach((el) => {
        observer.observe(el);
    });

    // --- Global Navbar State Integration ---
    const updateNavbarState = () => {
        const mclBtn = Array.from(document.querySelectorAll("nav button, header button")).find(
            btn => btn.textContent.trim() === "McLAREN+" || btn.textContent.trim() === "MEMBER CARD"
        );

        if (mclBtn) {
            const memberDataStr = localStorage.getItem("mclarenPlusMember");
            if (memberDataStr) {
                try {
                    const memberData = JSON.parse(memberDataStr);
                    mclBtn.textContent = "MEMBER CARD";
                } catch (e) {
                    console.error("Error parsing member data in navbar", e);
                    mclBtn.textContent = "McLAREN+";
                }
            } else {
                mclBtn.textContent = "McLAREN+";
            }

            // Click action to navigate to membership portal
            mclBtn.addEventListener("click", () => {
                window.location.href = "mclaren-plus.html";
            });
        }
    };

    updateNavbarState();
    
    // Listen to storage changes to keep states synchronized across tabs
    window.addEventListener("storage", (e) => {
        if (e.key === "mclarenPlusMember") {
            updateNavbarState();
        }
    });
});
