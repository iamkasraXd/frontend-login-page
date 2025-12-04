// Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 123, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Typing Animation
function typeWriter(element, text, speed = 100) {
    element.innerHTML = '';
    element.classList.add('typing-cursor');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing-cursor');
        }
    }
    type();
}

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.trail.push({ x: e.clientX, y: e.clientY, life: this.maxTrail });
            if (this.trail.length > this.maxTrail) {
                this.trail.shift();
            }
            this.draw();
        });
    }
    
    draw() {
        const existing = document.querySelectorAll('.mouse-trail');
        existing.forEach(el => el.remove());
        
        this.trail.forEach((point, index) => {
            const dot = document.createElement('div');
            dot.className = 'mouse-trail';
            dot.style.cssText = `
                position: fixed;
                left: ${point.x}px;
                top: ${point.y}px;
                width: ${point.life / 2}px;
                height: ${point.life / 2}px;
                background: rgba(0, 123, 255, ${point.life / this.maxTrail});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transform: translate(-50%, -50%);
            `;
            document.body.appendChild(dot);
            
            point.life--;
            if (point.life <= 0) {
                this.trail.splice(index, 1);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const togglePasswordButton = document.getElementById('togglePassword');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btnText = document.querySelector('.btn-text');

    // Check for remembered email on page load
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Password toggle functionality
    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePasswordButton.classList.toggle('fa-eye');
            togglePasswordButton.classList.toggle('fa-eye-slash');
        });
    }

    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function showError(inputId, message) {
        const inputGroup = document.getElementById(inputId).parentElement;
        const errorElement = document.getElementById(inputId + 'Error');
        inputGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function clearError(inputId) {
        const inputGroup = document.getElementById(inputId).parentElement;
        const errorElement = document.getElementById(inputId + 'Error');
        inputGroup.classList.remove('error');
        errorElement.classList.remove('show');
    }

    function showMessage(message, type = 'success') {
        const messageContainer = document.getElementById('messageContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageContainer.appendChild(messageDiv);
        
        setTimeout(() => messageDiv.classList.add('show'), 100);
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageContainer.removeChild(messageDiv), 300);
        }, 3000);
    }

    function setLoading(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            btnText.style.opacity = '0';
            loadingSpinner.style.display = 'block';
        } else {
            loginBtn.disabled = false;
            btnText.style.opacity = '1';
            loadingSpinner.style.display = 'none';
        }
    }

    // Real-time validation
    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            showError('email', 'Please enter a valid email address');
        } else {
            clearError('email');
        }
    });

    passwordInput.addEventListener('blur', () => {
        if (passwordInput.value && !validatePassword(passwordInput.value)) {
            showError('password', 'Password must be at least 6 characters');
        } else {
            clearError('password');
        }
    });

    // Clear errors on input
    emailInput.addEventListener('input', () => clearError('email'));
    passwordInput.addEventListener('input', () => clearError('password'));

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            let isValid = true;

            // Clear previous errors
            clearError('email');
            clearError('password');

            // Validate email
            if (!email) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            // Validate password
            if (!password) {
                showError('password', 'Password is required');
                isValid = false;
            } else if (!validatePassword(password)) {
                showError('password', 'Password must be at least 6 characters');
                isValid = false;
            }

            if (!isValid) return;

            // Simulate login process
            setLoading(true);
            showLoadingOverlay();
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Handle remember me
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Simulate successful login
                if (email === 'demo@example.com' && password === 'password') {
                    hideLoadingOverlay();
                    addCelebrationEffect();
                    showMessage('Login successful! Welcome back.', 'success');
                    setTimeout(() => {
                        window.location.href = '#dashboard'; // Redirect to dashboard
                    }, 2000);
                } else {
                    hideLoadingOverlay();
                    addGlitchEffect(loginForm);
                    showMessage('Invalid email or password. Try demo@example.com / password', 'error');
                }
            } catch (error) {
                hideLoadingOverlay();
                addGlitchEffect(loginForm);
                showMessage('Login failed. Please try again.', 'error');
            } finally {
                setLoading(false);
            }
        });
    }

    // Forgot password functionality
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (!email) {
            showMessage('Please enter your email first', 'error');
            emailInput.focus();
            return;
        }
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        showMessage(`Password reset link sent to ${email}`, 'success');
    });

    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.classList.contains('google') ? 'Google' : 'GitHub';
            showMessage(`${provider} login is not implemented yet`, 'error');
        });
    });

    // Initialize particle system
    const canvas = document.getElementById('particleCanvas');
    new ParticleSystem(canvas);
    
    // Initialize mouse trail
    new MouseTrail();
    
    // Typing animations for title and subtitle
    setTimeout(() => {
        typeWriter(document.getElementById('animatedTitle'), 'Welcome Back', 80);
    }, 500);
    
    setTimeout(() => {
        typeWriter(document.getElementById('animatedSubtitle'), 'Please sign in to your account', 60);
    }, 2000);
    
    // Animate input groups on scroll into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInLeft 0.6s ease-out';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.input-group').forEach(group => {
        observer.observe(group);
    });
    
    // Add floating animation to social buttons
    document.querySelectorAll('.social-btn').forEach((btn, index) => {
        btn.style.animation = `slideInUp 0.6s ease-out ${0.8 + index * 0.2}s both`;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.animation = 'buttonPulse 0.6s ease-in-out';
        });
    });
    
    // Enhanced loading overlay
    function showLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'flex';
        overlay.style.animation = 'fadeIn 0.3s ease-in';
    }
    
    function hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
    
    // Add glitch effect for errors
    function addGlitchEffect(element) {
        element.classList.add('glitch');
        setTimeout(() => {
            element.classList.remove('glitch');
        }, 300);
    }
    
    // Add celebration effect for success
    function addCelebrationEffect() {
        const form = document.querySelector('.login-form');
        form.classList.add('celebrate');
        
        // Create confetti effect
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                createConfetti();
            }, i * 50);
        }
        
        setTimeout(() => {
            form.classList.remove('celebrate');
        }, 600);
    }
    
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: -10px;
            width: 10px;
            height: 10px;
            background: ${['#007bff', '#28a745', '#ffc107', '#dc3545'][Math.floor(Math.random() * 4)]};
            z-index: 9999;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Interactive input animations
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
            input.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
        
        // Add typing sound effect (visual)
        input.addEventListener('input', () => {
            input.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.4), 0 0 20px rgba(0, 123, 255, 0.2)';
            setTimeout(() => {
                input.style.boxShadow = '';
            }, 200);
        });
    });
});

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
