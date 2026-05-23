function closeMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");
    if (menuBtn) menuBtn.classList.remove("active");
    if (sideMenu) sideMenu.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
}

function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    reveals.forEach((element) => {
        if (element.getBoundingClientRect().top < windowHeight - 100) {
            element.classList.add("active");
        }
    });
}

function initCommon() {
    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const overlay = document.getElementById("overlay");
    
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            const isOpen = menuBtn.classList.toggle("active");
            if (sideMenu) sideMenu.classList.toggle("active", isOpen);
            if (overlay) overlay.classList.toggle("active", isOpen);
            menuBtn.setAttribute("aria-expanded", String(isOpen));
        });
    }
    
    if (overlay) overlay.addEventListener("click", closeMenu);
    
    // Side menu links
    const menuLinks = document.querySelectorAll("#sideMenu a");
    menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
    
    // Outside click close
    document.addEventListener("click", (event) => {
        if (!sideMenu?.contains(event.target) && !menuBtn?.contains(event.target)) {
            closeMenu();
        }
    });

    // Page transition links
    const animatedLinks = document.querySelectorAll('a[href]:not([href^="mailto:"]):not([href^="tel:"]):not([href^="#"]):not([target="_blank"])');
    animatedLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || link.target === "_blank") {
                return;
            }
            event.preventDefault();
            const pageTransitionOverlay = document.getElementById("pageTransitionOverlay");
            if (pageTransitionOverlay) pageTransitionOverlay.classList.add("active");
            setTimeout(() => {
                window.location.href = href;
            }, 280);
        });
    });
    
    // Load handler
    
    const pageTransitionOverlay = document.getElementById("pageTransitionOverlay");
    if (pageTransitionOverlay) pageTransitionOverlay.classList.remove("active");
    
    const loader = document.getElementById("loader");
    setTimeout(() => {
        if (loader) {
            loader.classList.add("hidden");
            setTimeout(() => loader.style.display = "none", 1000);
        }
    }, 1600);
    
    reveal();
    
    // Scroll handler
    window.addEventListener("scroll", reveal);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommon);
} else {
    initCommon();
}

// ---- Instant Quotation wall calculator ----
(function initQuotationCalculator() {
    const lengthEl = document.getElementById('length');
    const heightEl = document.getElementById('height');
    const totalAreaEl = document.getElementById('totalArea');
    const villageEl = document.getElementById('village');
    const priceDisplay = document.getElementById('priceDisplay');
    const errorEl = document.getElementById('error');
    const resultsEl = document.getElementById('results');
    const resultsContentEl = document.getElementById('resultsContent');
    const calcBtn = document.getElementById('calculateBtn'); // optional button

    if (!totalAreaEl || !villageEl || !priceDisplay || !resultsContentEl) return;

    const basePrice = 70;
    const villagePriceMultiplier = {
        Kalrawas: 1.0,
        Harchandpur: 1.1,
        Bawal: 1.15,
        Jaliawas: 1.12,
        Banipur: 1.08,
        Chirhara: 1.18,
        Saban: 1.2,
        Naichana: 1.25,
        Suthana: 1.22,
        Mohammadpur: 1.3,
        other: 1.35
    };

    function getNumber(el) {
        const v = parseFloat(el?.value);
        return Number.isFinite(v) ? v : 0;
    }

    function formatINR(n) {
        try {
            return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
        } catch {
            return String(Math.round(n));
        }
    }

    function computePricePerSqFt() {
        const village = villageEl.value;
        const mult = villagePriceMultiplier[village] ?? villagePriceMultiplier.other;
        return basePrice * mult;
    }

    function recomputeAreaIfMissing() {
        const totalAreaVal = getNumber(totalAreaEl);
        if (totalAreaVal > 0) return totalAreaVal;

        const l = getNumber(lengthEl);
        const h = getNumber(heightEl);
        if (l > 0 && h > 0) {
            const area = l * h;
            totalAreaEl.value = String(area);
            return area;
        }
        return 0;
    }

    function setError(msg) {
        if (errorEl) errorEl.textContent = msg || '';
    }

    function updatePrice() {
        const p = computePricePerSqFt();
        priceDisplay.textContent = `₹${Math.round(p)}`;
        setError('');
    }

    function calculate() {
        const area = recomputeAreaIfMissing();
        const village = villageEl.value;
        const p = computePricePerSqFt();

        setError('');

        if (!village) {
            setError('Please select a village.');
            if (resultsEl) resultsEl.style.display = 'none';
            return;
        }

        if (!(area > 0)) {
            setError('Please enter a valid area (or length & height).');
            if (resultsEl) resultsEl.style.display = 'none';
            return;
        }

        const totalCost = area * p;

        const items = [
            { label: 'Wall Area (sq ft)', value: formatINR(area) },
            { label: 'Price per sq ft', value: `₹${formatINR(p)}` },
            { label: 'Estimated Cost', value: `₹${formatINR(totalCost)}` }
        ];

        resultsContentEl.innerHTML = items
            .map(
                (it) => `
                <div class="result-item">
                    <span class="result-label">${it.label}</span>
                    <span class="result-value">${it.value}</span>
                </div>`
            )
            .join('');

        if (resultsEl) {
            resultsEl.style.display = 'block';
            resultsEl.style.opacity = '1';
        }

        return totalCost;
    }

    // Attach listeners
    villageEl.addEventListener('change', updatePrice);
    lengthEl?.addEventListener('input', calculate);
    heightEl?.addEventListener('input', calculate);
    totalAreaEl?.addEventListener('input', calculate);
    calcBtn?.addEventListener('click', calculate);

    // Initialize price display
    updatePrice();
})();
