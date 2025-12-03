document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Check for remembered email on page load
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }

    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');

    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            togglePasswordButton.classList.toggle('fa-eye');
            togglePasswordButton.classList.toggle('fa-eye-slash');
        });
    }

    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = emailInput.value;

            if (rememberMeCheckbox.checked) {
                // Store email in local storage
                localStorage.setItem('rememberedEmail', email);
            } else {
                // Remove email from local storage
                localStorage.removeItem('rememberedEmail');
            }

            if (email) {
                console.log(`Login attempt by ${email}`);
                // Here you would typically send data to a server
                alert(`Hello, ${email}! Login functionality is not implemented yet.`);
            }
        });
    }
});
