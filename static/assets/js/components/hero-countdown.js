/**
 * HeroCountdown Component
 * Renders a countdown to the start of the hike.
 */
const HeroCountdown = {
    render: (targetId) => {
        return `
            <div id="${targetId}" class="hero-countdown">
                <div class="hero-countdown__item">
                    <span class="hero-countdown__value" id="countdown-days">00</span>
                    <span class="hero-countdown__label">Tage</span>
                </div>
                <div class="hero-countdown__item">
                    <span class="hero-countdown__value" id="countdown-hours">00</span>
                    <span class="hero-countdown__label">Std.</span>
                </div>
                <div class="hero-countdown__item">
                    <span class="hero-countdown__value" id="countdown-minutes">00</span>
                    <span class="hero-countdown__label">Min.</span>
                </div>
                <div class="hero-countdown__item">
                    <span class="hero-countdown__value" id="countdown-seconds">00</span>
                    <span class="hero-countdown__label">Sek.</span>
                </div>
            </div>
        `;
    },
    init: (startDate, endDate) => {
        const update = () => {
            const now = new Date();
            const container = document.querySelector(".hero-countdown");
            if (!container) return;

            // Hike is over
            if (now >= endDate) {
                container.innerHTML = `<p class="hero-countdown__started">Malerweg 2026 erfolgreich beendet!</p>`;
                return;
            }

            // Hike is active
            if (now >= startDate) {
                container.innerHTML = `<p class="hero-countdown__started">Wanderung hat begonnen!</p>`;
                return;
            }

            // Hike hasn't started yet
            const diff = startDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const dEl = document.getElementById("countdown-days");
            const hEl = document.getElementById("countdown-hours");
            const mEl = document.getElementById("countdown-minutes");
            const sEl = document.getElementById("countdown-seconds");

            if (dEl) dEl.textContent = String(days).padStart(2, "0");
            if (hEl) hEl.textContent = String(hours).padStart(2, "0");
            if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
            if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
        };
        update();
        return setInterval(update, 1000);
    },
};
