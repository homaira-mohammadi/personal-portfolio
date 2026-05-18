/* ========================== */

/* ========================= */
/* 2. GSAP CUSTOM CURSOR     */
/* ========================= */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
const hoverElements = document.querySelectorAll('a, button, .cursor-hover');

if (window.matchMedia("(pointer: fine)").matches) {
    // Only apply custom cursor on desktop/mouse devices
    document.addEventListener('mousemove', (e) => {
        // Move dot instantly
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0, ease: "power2.out" });
        // Move outline with less delay for faster following
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.05, ease: "power2.out" });
    });

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.5, borderColor: '#fff', duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, borderColor: '#33ccff', duration: 0.2 });
        });
    });
}


/* =========================== */
/* 3. GSAP 3D HOVER (ABOUT)    */
/* =========================== */
const tiltBox = document.querySelector('.tilt-box');
if(tiltBox) {
    tiltBox.addEventListener('mousemove', (e) => {
        const rect = tiltBox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width - 0.5) * 20; // max rotation degrees
        const yPercent = (y / rect.height - 0.5) * -20;
        
        gsap.to(tiltBox, { 
            rotationY: xPercent, 
            rotationX: yPercent, 
            ease: "power1.out", 
            transformPerspective: 1000, 
            transformOrigin: "center" 
        });
    });

    tiltBox.addEventListener('mouseleave', () => {
        gsap.to(tiltBox, { rotationY: 0, rotationX: 0, ease: "power2.out", duration: 0.5 });
    });
}

/* ========================= */
/* 4. AOS & TYPED.JS INIT    */
/* ========================= */
document.addEventListener("DOMContentLoaded", function () {
    const transitionOverlay = document.getElementById('page-transition');
    if (transitionOverlay) {
        gsap.to(transitionOverlay, { 
            y: "-100%", 
            duration: 0.8, 
            ease: "power4.inOut", 
            delay: 0.2 
        });
    }

    // Initialize AOS
    AOS.init({
        once: false,
        offset: 50,
    });

    // Initialize Typed.js
    if (document.querySelector(".typing-text")) {
        new Typed(".typing-text", {
            strings: ["Computer Science Student", "English Educator", "Web Designer"],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 1500,
            loop: true
        });
    }
});


/* ========================= */
/* 5. NAVBAR & MOBILE MENU   */
/* ========================= */
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('#navbar');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('#header');

// Mobile Menu Toggle
menuIcon.addEventListener('click', () => {
    const isExpanded = menuIcon.querySelector('i').classList.contains('bx-x');
    if (isExpanded) {
        menuIcon.innerHTML = `<i class='bx bx-menu'></i>`;
        navbar.classList.replace('translate-y-0', '-translate-y-[200%]');
    } else {
        menuIcon.innerHTML = `<i class='bx bx-x'></i>`;
        navbar.classList.replace('-translate-y-[200%]', 'translate-y-0');
    }
});

// Highlight active section & sticky header
window.addEventListener('scroll', () => {
    let top = window.scrollY;

    // Header bg opacity on scroll
    if (top > 50) {
        header.classList.add('shadow-md');
    } else {
        header.classList.remove('shadow-md');
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('text-main');
                link.classList.add('text-white');
            });

            let activeLink = document.querySelector(`nav a[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.remove('text-white');
                activeLink.classList.add('text-main');
            }
        }
    });
});

/* ========================= */
/* 6. READ MORE BUTTONS      */
/* ========================= */
const readMoreBtns = document.querySelectorAll('.read-more-btn');
readMoreBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const container = this.parentElement;
        const moreText = container.querySelector('.more-text');

        if (moreText.classList.contains('hidden')) {
            moreText.classList.remove('hidden');
            this.textContent = "Read Less";
        } else {
            moreText.classList.add('hidden');
            this.textContent = "Read More";
        }
    });
});

/* =========================== */
/* 7. PAGE TRANSITION OVERLAY  */
/* =========================== */
const transitionOverlay = document.getElementById('page-transition');
const transitionText = document.getElementById('transition-text');

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if(!targetId.startsWith('#')) return;
        
        e.preventDefault();
        
        // Close mobile menu if it's open
        if(menuIcon && navbar) {
            const isExpanded = menuIcon.querySelector('i').classList.contains('bx-x');
            if(isExpanded) {
                menuIcon.innerHTML = `<i class='bx bx-menu'></i>`;
                navbar.classList.replace('translate-y-0', '-translate-y-[200%]');
            }
        }
        
        const sectionName = this.innerText;
        transitionText.innerText = sectionName;

        const tl = gsap.timeline();
        
        // Drop curtain
        tl.to(transitionOverlay, { y: "0%", duration: 0.5, ease: "power4.inOut" })
          .call(() => {
              // Temporarily turn off CSS smooth scrolling so we can jump instantly under the curtain
              document.documentElement.classList.remove('scroll-smooth');
              
              // Jump to target section
              const targetEl = document.querySelector(targetId);
              if(targetEl) {
                  targetEl.scrollIntoView();
              }
              
              // Safely update URL
              history.replaceState(null, null, targetId);
              
              setTimeout(() => {
                  document.documentElement.classList.add('scroll-smooth');
              }, 50);
              
              // Refresh animations
              if(typeof AOS !== 'undefined') {
                  AOS.refreshHard();
              }
          })
          .to(transitionOverlay, { y: "100%", duration: 0.5, ease: "power4.inOut", delay: 0.15 })
          .set(transitionOverlay, { y: "-100%" }); // Reset overlay position
    });
});
