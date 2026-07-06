document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    // Registration Form Elements
    const regContainer = document.getElementById('registration-container');
    const memberCardContainer = document.getElementById('member-card-container');
    
    const form = document.getElementById('registration-form');
    const step1 = document.getElementById('form-step-1');
    const step2 = document.getElementById('form-step-2');
    const stepIndicator = document.getElementById('step-indicator');
    
    const btnNext = document.getElementById('btn-next-step');
    const btnPrev = document.getElementById('btn-prev-step');
    const btnSignOut = document.getElementById('btn-sign-out');
    
    // Inputs
    const fNameInput = document.getElementById('reg-fname');
    const lNameInput = document.getElementById('reg-lname');
    const emailInput = document.getElementById('reg-email');
    const emailError = document.getElementById('email-error');
    
    const passwordInput = document.getElementById('reg-password');
    const termsInput = document.getElementById('reg-terms');
    
    // Password Strength
    const strength1 = document.getElementById('strength-1');
    const strength2 = document.getElementById('strength-2');
    const strength3 = document.getElementById('strength-3');
    const strengthText = document.getElementById('strength-text');
    
    // Member Card Elements
    const cardName = document.getElementById('card-name');
    const cardId = document.getElementById('card-id');
    const cardDate = document.getElementById('card-date');

    // === INITIALIZATION ===
    checkMembershipStatus();

    // === MULTI-STEP LOGIC ===
    btnNext.addEventListener('click', () => {
        // Validate Step 1
        let isValid = true;
        
        // Basic HTML5 Validation for Step 1 fields
        if (!fNameInput.checkValidity()) { fNameInput.reportValidity(); isValid = false; }
        else if (!lNameInput.checkValidity()) { lNameInput.reportValidity(); isValid = false; }
        else if (!emailInput.checkValidity()) { emailInput.reportValidity(); isValid = false; }
        
        // Custom Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (isValid && !emailRegex.test(emailInput.value)) {
            emailError.classList.remove('hidden');
            isValid = false;
        } else {
            emailError.classList.add('hidden');
        }

        if (isValid) {
            // Transition to Step 2
            step1.classList.add('opacity-0');
            setTimeout(() => {
                step1.classList.add('hidden');
                step2.classList.remove('hidden');
                // trigger reflow
                void step2.offsetWidth; 
                step2.classList.remove('opacity-0');
                step2.classList.add('opacity-100');
                
                stepIndicator.textContent = "Step 2 of 2";
                
                // Reset password input so strength is recalculated
                updatePasswordStrength(passwordInput.value);
            }, 300);
        }
    });

    btnPrev.addEventListener('click', () => {
        // Transition back to Step 1
        step2.classList.remove('opacity-100');
        step2.classList.add('opacity-0');
        setTimeout(() => {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
            void step1.offsetWidth;
            step1.classList.remove('opacity-0');
            step1.classList.add('opacity-100');
            
            stepIndicator.textContent = "Step 1 of 2";
        }, 300);
    });

    // === PASSWORD STRENGTH ===
    passwordInput.addEventListener('input', (e) => {
        updatePasswordStrength(e.target.value);
    });

    function updatePasswordStrength(password) {
        let score = 0;
        
        if (password.length > 0) score += 1;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        // Reset colors
        strength1.className = "flex-1 rounded-full transition-colors bg-white/10";
        strength2.className = "flex-1 rounded-full transition-colors bg-white/10";
        strength3.className = "flex-1 rounded-full transition-colors bg-white/10";

        if (score === 0) {
            strengthText.textContent = "Enter at least 8 characters";
            strengthText.className = "text-xs mt-2 font-medium text-gray-500";
        } else if (score <= 2) {
            strength1.classList.replace('bg-white/10', 'bg-red-500');
            strengthText.textContent = "Weak";
            strengthText.className = "text-xs mt-2 font-medium text-red-500";
        } else if (score === 3) {
            strength1.classList.replace('bg-white/10', 'bg-yellow-500');
            strength2.classList.replace('bg-white/10', 'bg-yellow-500');
            strengthText.textContent = "Medium";
            strengthText.className = "text-xs mt-2 font-medium text-yellow-500";
        } else if (score >= 4) {
            strength1.classList.replace('bg-white/10', 'bg-green-500');
            strength2.classList.replace('bg-white/10', 'bg-green-500');
            strength3.classList.replace('bg-white/10', 'bg-green-500');
            strengthText.textContent = "Strong";
            strengthText.className = "text-xs mt-2 font-medium text-green-500";
        }
    }

    // === REGISTRATION SUBMISSION ===
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload

        if (!termsInput.checked) {
            alert("Please agree to the Terms of Use.");
            return;
        }

        // Generate ID and Date
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const memberIdStr = `#MCL-2026-${randomNum}`;
        
        const dateOptions = { month: 'short', year: 'numeric' };
        const joinDateStr = new Date().toLocaleDateString('en-US', dateOptions).toUpperCase();

        const memberData = {
            firstName: fNameInput.value.trim(),
            lastName: lNameInput.value.trim(),
            email: emailInput.value.trim(),
            memberId: memberIdStr,
            joinDate: joinDateStr
        };

        // Save to localStorage
        localStorage.setItem('mclarenPlusMember', JSON.stringify(memberData));

        // Update UI
        checkMembershipStatus();
    });

    // === SIGN OUT ===
    btnSignOut.addEventListener('click', () => {
        localStorage.removeItem('mclarenPlusMember');
        
        // Reset form
        form.reset();
        step2.classList.add('hidden');
        step2.classList.add('opacity-0');
        step1.classList.remove('hidden');
        step1.classList.remove('opacity-0');
        stepIndicator.textContent = "Step 1 of 2";
        updatePasswordStrength('');
        
        checkMembershipStatus();
    });

    // === CHECK MEMBERSHIP STATUS ===
    function checkMembershipStatus() {
        const memberDataStr = localStorage.getItem('mclarenPlusMember');
        
        if (memberDataStr) {
            try {
                const memberData = JSON.parse(memberDataStr);
                
                // Populate Card
                cardName.textContent = `${memberData.firstName} ${memberData.lastName}`;
                cardId.textContent = memberData.memberId;
                cardDate.textContent = memberData.joinDate;

                // Toggle visibility
                regContainer.classList.add('hidden');
                memberCardContainer.classList.remove('hidden');
            } catch(e) {
                console.error("Error parsing member data", e);
                localStorage.removeItem('mclarenPlusMember');
                showForm();
            }
        } else {
            showForm();
        }
    }

    function showForm() {
        regContainer.classList.remove('hidden');
        memberCardContainer.classList.add('hidden');
    }

    // === FAQ ACCORDION ===
    const faqHeaders = document.querySelectorAll('.faq-header');
    
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const icon = header.querySelector('.faq-icon');
            const content = header.nextElementSibling;
            
            // Toggle open state
            const isOpen = content.style.maxHeight;

            // Close all other accordions (Optional, standard accordion behavior)
            document.querySelectorAll('.faq-content').forEach(c => {
                c.style.maxHeight = null;
            });
            document.querySelectorAll('.faq-icon').forEach(i => {
                i.classList.remove('rotate-180');
            });

            if (!isOpen) {
                // Open this one
                content.style.maxHeight = content.scrollHeight + "px";
                icon.classList.add('rotate-180');
            }
        });
    });
});
