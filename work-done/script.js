// Project Modal Functions
function openProjectModal() {
    document.getElementById('projectModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Change modal image and update active thumbnail
function changeImage(src) {
    document.getElementById('modalImage').src = src;
    
    // Update active thumbnail
    const thumbs = document.querySelectorAll('.modal-thumbs img');
    thumbs.forEach(thumb => {
        thumb.classList.remove('thumb-active');
        if (thumb.src.includes(src)) {
            thumb.classList.add('thumb-active');
        }
    });
}

// Close modal when clicking outside the content
window.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) {
        closeProjectModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Add scroll animation to elements
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease-out forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card').forEach(card => {
        observer.observe(card);
    });
});
