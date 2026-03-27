async function loadPartial(id, file) {
    const target = document.getElementById(id);
    if (!target) return;

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        target.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a[data-page]');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });
}

async function initLayout() {
    await loadPartial('site-header', 'header.html');
    await loadPartial('site-footer', 'footer.html');
    setActiveNavLink();
}

document.addEventListener('DOMContentLoaded', initLayout);
