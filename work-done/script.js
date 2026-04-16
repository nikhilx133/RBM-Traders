// Lightbox Modal Functions
function openLightbox(imageSrc) {
    const modal = document.getElementById('lightboxModal');
    const image = document.getElementById('lightboxImage');
    image.src = imageSrc;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside the image
window.addEventListener('click', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (e.target === modal) {
        closeLightbox();
    }
});

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
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
