// Mobile Menu Toggle
const burger = document.getElementById('burger');
const navMenu = document.querySelector('.nav-menu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Menu Category Filter with Animation
const categoryButtons = document.querySelectorAll('.category-btn');
const menuGrids = document.querySelectorAll('.menu-grid');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const category = button.getAttribute('data-category');

        // Fade out all grids
        menuGrids.forEach(grid => {
            grid.style.opacity = '0';
            grid.style.transform = 'translateY(20px)';
        });

        // Wait for fade out, then show/hide
        setTimeout(() => {
            menuGrids.forEach(grid => {
                if (category === 'all') {
                    grid.classList.add('active');
                    grid.style.display = 'grid';
                    // Trigger reflow
                    grid.offsetHeight;
                    grid.style.opacity = '1';
                    grid.style.transform = 'translateY(0)';
                } else {
                    const gridCategory = grid.getAttribute('data-category');
                    if (gridCategory === category) {
                        grid.classList.add('active');
                        grid.style.display = 'grid';
                        // Trigger reflow
                        grid.offsetHeight;
                        grid.style.opacity = '1';
                        grid.style.transform = 'translateY(0)';
                    } else {
                        grid.classList.remove('active');
                        grid.style.display = 'none';
                    }
                }
            });
        }, 300);
    });
});

// Initialize - show all items with transition
menuGrids.forEach(grid => {
    grid.classList.add('active');
    grid.style.display = 'grid';
    grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
});

// Header Background on Scroll and Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrollY = window.pageYOffset;
    
    // Change header background on scroll
    if (scrollY > 100) {
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
    } else {
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
    }
    
    // Show/hide scroll to top button
    if (scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Here you would typically send the data to a server
        // For now, we'll just show an alert
        alert('Спасибо за бронирование! Мы свяжемся с вами в ближайшее время.');
        
        // Reset form
        contactForm.reset();
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Observe menu items with stagger effect
document.querySelectorAll('.menu-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    
    const menuObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                menuObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    menuObserver.observe(el);
});

// Image Modal Functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.querySelector('.modal-caption');
const closeBtn = document.querySelector('.modal-close');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const resetZoomBtn = document.getElementById('resetZoom');

let currentScale = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

// Open modal when clicking on menu item image
document.querySelectorAll('.menu-item-image').forEach(item => {
    item.addEventListener('click', function(e) {
        e.stopPropagation();
        const menuItem = this.closest('.menu-item');
        const img = this.querySelector('img');
        const title = menuItem.querySelector('h3').textContent;
        
        modal.classList.add('active');
        modalImg.src = img.src;
        modalCaption.textContent = title;
        document.body.style.overflow = 'hidden';
        
        // Reset zoom and position
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    });
});

// Close modal
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
}

// Zoom controls
zoomInBtn.addEventListener('click', () => {
    currentScale = Math.min(currentScale + 0.25, 3);
    updateTransform();
});

zoomOutBtn.addEventListener('click', () => {
    currentScale = Math.max(currentScale - 0.25, 0.5);
    updateTransform();
});

resetZoomBtn.addEventListener('click', () => {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
});

// Mouse wheel zoom
modalImg.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        currentScale = Math.min(currentScale + 0.1, 3);
    } else {
        currentScale = Math.max(currentScale - 0.1, 0.5);
    }
    updateTransform();
});

// Drag to pan
modalImg.addEventListener('mousedown', (e) => {
    if (currentScale > 1) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        modalImg.style.cursor = 'grabbing';
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    modalImg.style.cursor = 'grab';
});

// Touch support for mobile
let touchStartX, touchStartY, touchStartDistance;

modalImg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX - translateX;
        touchStartY = e.touches[0].clientY - translateY;
    } else if (e.touches.length === 2) {
        touchStartDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }
});

modalImg.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && currentScale > 1) {
        translateX = e.touches[0].clientX - touchStartX;
        translateY = e.touches[0].clientY - touchStartY;
        updateTransform();
    } else if (e.touches.length === 2) {
        const distance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = distance / touchStartDistance;
        currentScale = Math.min(Math.max(currentScale * scale, 0.5), 3);
        touchStartDistance = distance;
        updateTransform();
    }
});

function updateTransform() {
    modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === '+' || e.key === '=') {
            currentScale = Math.min(currentScale + 0.25, 3);
            updateTransform();
        } else if (e.key === '-') {
            currentScale = Math.max(currentScale - 0.25, 0.5);
            updateTransform();
        } else if (e.key === '0') {
            currentScale = 1;
            translateX = 0;
            translateY = 0;
            updateTransform();
        }
    }
});
