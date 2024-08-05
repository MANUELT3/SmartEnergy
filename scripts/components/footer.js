// scripts/components/footer.js

function initFooter() {
    updateCopyrightYear();
}

function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement) {
        copyrightElement.textContent = `© ${currentYear} EcoWatt. All rights reserved.`;
    }
}