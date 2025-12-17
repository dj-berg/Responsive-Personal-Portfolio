/* app logic */

document.addEventListener("DOMContentLoaded", () => {

    /* nav header */
    const menuLinks = document.querySelectorAll("header ul li a");
    const sections = document.querySelectorAll("section");
    const header = document.querySelector("header");

    function activeMenu() {
        // Calculate a reference point slightly below the header so the active section
        // is determined by what is visible under the fixed header.
        const offset = header ? header.offsetHeight + 8 : 72;
        const fromTop = window.scrollY + offset;
        let anyActive = false;

        // For each section, find the corresponding nav link (exclude the logo link)
        // and toggle the `active` class when the section is in view.
        sections.forEach(section => {
            const id = section.id;
            if (!id) return;
            const link = document.querySelector(`header ul li a[href="#${id}"]:not(.sidebar-logo)`) ||
                         document.querySelector(`header ul li a[href="#${id}"]`);
            if (!link) return;

            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (fromTop >= top && fromTop < bottom) {
                link.classList.add('active');
                anyActive = true;
            } else {
                link.classList.remove('active');
            }
        });

        // Fallback: if no section matched (edge cases like very top of the page), ensure Home is active
        if (!anyActive) {
            const homeLink = document.querySelector('header ul li a[href="#home"]:not(.sidebar-logo)') ||
                             document.querySelector('header ul li a[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    function handleScroll() {
        activeMenu();
        if (window.scrollY > 50) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    // keep active state synced on load, resize and hash changes
    window.addEventListener('load', handleScroll);
    window.addEventListener('resize', handleScroll);
    window.addEventListener('hashchange', handleScroll);

    // init emailjs
    if (window.emailjs && typeof emailjs.init === 'function') {
        emailjs.init("VkVXmCBWffsrQg6wy");
    }

    // mobile menu toggle (desktop: inline, mobile: sidebar)
    const menuIcon = document.getElementById('menu-icon');
    const navList = document.querySelector('.navlist');
    const isMobile = () => window.matchMedia('(max-width: 420px)').matches;

    if (menuIcon && navList) {
        menuIcon.addEventListener('click', (ev) => {
            ev.stopPropagation();

            if (isMobile()) {
                const opened = navList.classList.toggle('sidebar-open');
                document.body.classList.toggle('no-scroll', opened);
                document.body.classList.toggle('sidebar-active', opened);
            } else {
                navList.classList.toggle('show');
            }
        });

        // close on click outside
        document.addEventListener('click', (ev) => {
            // sidebar close
            if (navList.classList.contains('sidebar-open')) {
                if (!(ev.target.closest('.navlist') || ev.target.closest('#menu-icon'))) {
                    navList.classList.remove('sidebar-open');
                    document.body.classList.remove('no-scroll');
                    document.body.classList.remove('sidebar-active');
                }
            }
            // inline menu close
            if (navList.classList.contains('show')) {
                if (!(ev.target.closest('.navlist') || ev.target.closest('#menu-icon'))) {
                    navList.classList.remove('show');
                }
            }
        });

        // close on escape key
        document.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape') {
                if (navList.classList.contains('sidebar-open')) {
                    navList.classList.remove('sidebar-open');
                    document.body.classList.remove('no-scroll');
                    document.body.classList.remove('sidebar-active');
                }
                if (navList.classList.contains('show')) {
                    navList.classList.remove('show');
                }
            }
        });

        // close when a nav link is clicked (mobile sidebar)
        navList.querySelectorAll('a').forEach(a => a.addEventListener('click', (ev) => {
            // if it's an anchor to an in-page id, smooth scroll with offset for header
            const href = a.getAttribute('href') || '';
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    ev.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 64;
                    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }

            if (navList.classList.contains('sidebar-open')) {
                navList.classList.remove('sidebar-open');
                document.body.classList.remove('no-scroll');
                document.body.classList.remove('sidebar-active');
            }
            navList.classList.remove('show');
        }));
    }

    /* about toggle */
    const toggleBtn = document.getElementById("toggleAboutBtn");
    const moreText = document.querySelector(".about-content .more-text");

    if (toggleBtn && moreText) {
        toggleBtn.addEventListener("click", () => {
            moreText.classList.toggle("show");
            toggleBtn.textContent =
                moreText.classList.contains("show") ? "Show Less" : "Read More";
        });
    }

    /* skill circles */
    document.querySelectorAll(".circular-progress").forEach(circle => {
        const progress = circle.dataset.progress;
        const svgCircle = circle.querySelector("circle:last-child");
        if (!svgCircle) return;

        const radius = svgCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        svgCircle.style.strokeDasharray = circumference;
        svgCircle.style.strokeDashoffset =
            circumference - (progress / 100) * circumference;
    });

    /* rain + lightning */
    (function initRain() {
        const canvas = document.getElementById('rain-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = window.innerWidth;
        let H = window.innerHeight;
        const DPR = window.devicePixelRatio || 1;
        let drops = [];

        const DROP_SCALE = 0.25;
        const MIN_LEN = 18;
        const MAX_LEN = 40;
        const MIN_SPEED = 8;
        const MAX_SPEED = 20;
        const LINE_WIDTH = 2;

        function resizeCanvas() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = Math.round(W * DPR);
            canvas.height = Math.round(H * DPR);
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            initDrops();
        }

        function initDrops() {
            drops = [];
            const targetCount = Math.max(120, Math.floor(W * DROP_SCALE));
            for (let i = 0; i < targetCount; i++) {
                drops.push(randomDrop(true));
            }
        }

        function randomDrop(offscreen = false) {
            return {
                x: Math.random() * W,
                y: offscreen ? Math.random() * H : (-Math.random() * 200),
                len: MIN_LEN + Math.random() * (MAX_LEN - MIN_LEN),
                speed: MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED),
                wind: -0.2 + Math.random() * 0.4,
                opacity: 0.1 + Math.random() * 0.3
            };
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            ctx.lineWidth = LINE_WIDTH;
            ctx.lineCap = 'round';

            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];
                ctx.beginPath();
                ctx.strokeStyle = `rgba(18, 247, 255, ${d.opacity})`;
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x + d.wind * d.len, d.y + d.len);
                ctx.stroke();

                d.x += d.wind * d.speed * 0.3;
                d.y += d.speed;

                if (d.y > H + 50) {
                    drops[i] = randomDrop(true);
                    drops[i].y = -10 - Math.random() * 100;
                }
                if (d.x < -50 || d.x > W + 50) {
                    drops[i].x = Math.random() * W;
                }
            }

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resizeCanvas, { passive: true });
        resizeCanvas();
        requestAnimationFrame(draw);

        const lightning = document.querySelector('.lightning');

        function lightningFlash() {
            if (!lightning) return;
            const intensity = Math.random() > 0.6 ? 0.85 : 0.45;
            const duration = 80 + Math.random() * 150;

            lightning.style.transition = `opacity ${Math.min(0.12, duration / 1000)}s ease`;
            lightning.style.opacity = intensity;
            setTimeout(() => { lightning.style.opacity = 0; }, duration);

            if (Math.random() > 0.4) {
                setTimeout(() => {
                    lightning.style.transition = 'opacity 0.08s linear';
                    lightning.style.opacity = Math.random() > 0.5 ? 0.5 : 0.9;
                    setTimeout(() => { lightning.style.opacity = 0; }, 80 + Math.random() * 120);
                }, 100 + Math.random() * 200);
            }
        }

        (function scheduleLightning() {
            const delay = 1500 + Math.random() * 3500;
            setTimeout(() => {
                lightningFlash();
                scheduleLightning();
            }, delay);
        })();
    })();

    /* typed init */
    if (window.Typed) {
        const titles = [
            "Data Engineer",
            "UI/UX Designer",
            "AI Engineer",
            "Full-Stack Developer",
            "Cloud Developer",
            "<span class='gold-title'>Software Engineer!!!</span>"
        ];

        new Typed(".auto-type", {
            strings: titles,
            typeSpeed: 18,
            backSpeed: 18,
            backDelay: 400,
            startDelay: 300,
            loop: true,
            smartBackspace: true,
            contentType: "html",

            preStringTyped: (index) => {
                const cursor = document.querySelector(".typed-cursor");
                if (!cursor) return;

                // toggle gold cursor
                if (index === titles.length - 1) {
                    cursor.classList.add('gold');
                } else {
                    cursor.classList.remove('gold');
                }
            },

            onStringTyped: (index, self) => {
                if (index === titles.length - 1) {
                    self.stop();
                    setTimeout(() => self.start(), 1200);
                }
            }
        });
    }

    /* contact form */
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    if (!form || !status) return;

    const submitBtn = form.querySelector("button");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // prevent jump

        // honeypot
        if (form.company && form.company.value) return;

        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        emailjs.sendForm(
            "service_syup7ka",      // service id
            "template_wyzx1ds",     // template id
            form
        )
        .then(() => {
            status.textContent = "Message Sent Successfully!!!";
            status.className = "form-status success";
            submitBtn.textContent = "Send Message";
            submitBtn.disabled = false;
            form.reset();
            // auto-hide success
            setTimeout(() => {
                status.classList.remove("success");
            }, 4000);
        })
        .catch((error) => {
            status.textContent = "Failed to send. Please try again.";
            status.className = "form-status error";
            submitBtn.textContent = "Send Message";
            submitBtn.disabled = false;
            console.error("EmailJS Error:", error);
            // auto-hide error
            setTimeout(() => {
                status.classList.remove("error");
            }, 6000);
        });
    });

});
