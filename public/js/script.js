const wrapper = document.querySelector('.wrapper');
const forgotLink = document.querySelector('.forgot-password-link'); // Your forgot password link/button
const backToLogin = document.querySelector('.back-to-login'); // Button in forgot page to go back

forgotLink.addEventListener('click', () => {
  wrapper.classList.add('forgot-active');
});

backToLogin.addEventListener('click', () => {
  wrapper.classList.remove('forgot-active');
});

const circle = document.querySelector('.circle-animation');

forgotLink.addEventListener('click', () => {
    wrapper.classList.add('forgot-password');
});
