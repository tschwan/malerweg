/**
 * App Weather
 * Fetches weather data from Open-Meteo API for a specific location and updates the DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();
        const weatherData = dataProvider.getWeather();

        if (!weatherData) return;

        const container = document.getElementById("weather-container");
        const section = document.getElementById("weather-section");

        if (!container || !section) return;

        const { latitude, longitude, location } = weatherData;
        const locationEl = document.getElementById("weather-location");
        if (locationEl) {
            locationEl.textContent = location || "Bad Schandau";
        }

        // Fetch from Open-Meteo
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=3`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather API request failed");

        const data = await response.json();

        // WMO Weather code mapping to Material Symbols and text descriptions
        const getWeatherMap = (code) => {
            if (code === 0) return { icon: "clear_day", text: "Klar" };
            if (code === 1 || code === 2 || code === 3)
                return { icon: "partly_cloudy_day", text: "Wolkig" };
            if (code === 45 || code === 48)
                return { icon: "foggy", text: "Nebel" };
            if (
                code === 51 ||
                code === 53 ||
                code === 55 ||
                code === 56 ||
                code === 57
            )
                return { icon: "rainy", text: "Nieselregen" };
            if (
                code === 61 ||
                code === 63 ||
                code === 65 ||
                code === 66 ||
                code === 67
            )
                return { icon: "rainy", text: "Regen" };
            if (code === 71 || code === 73 || code === 75 || code === 77)
                return { icon: "cloudy_snowing", text: "Schnee" };
            if (code === 80 || code === 81 || code === 82)
                return { icon: "rainy", text: "Regenschauer" };
            if (code === 85 || code === 86)
                return { icon: "cloudy_snowing", text: "Schneeschauer" };
            if (code === 95 || code === 96 || code === 99)
                return { icon: "thunderstorm", text: "Gewitter" };
            return { icon: "cloud", text: "Unbekannt" };
        };

        const currentMap = getWeatherMap(data.current.weather_code);

        const htmlParts = [];

        // Today (Current mostly + Daily Min/Max)
        htmlParts.push(`
            <div class="card" style="text-align: center; padding: var(--space-6);">
                <p style="font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; font-size: var(--font-size-xs); letter-spacing: var(--tracking-wider); margin-bottom: var(--space-3);">Heute</p>
                <div style="display: flex; justify-content: center; align-items: center; height: 64px; margin-bottom: var(--space-2);">
                    <span class="material-symbols-outlined" style="font-size: 48px; color: var(--color-brand-primary);">${currentMap.icon}</span>
                </div>
                <p style="font-size: var(--font-size-3xl); font-weight: 800; margin-bottom: var(--space-1);">${Math.round(data.current.temperature_2m)}°C</p>
                <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); font-weight: 500;">${currentMap.text}</p>
                <div style="margin-top: var(--space-4); font-size: var(--font-size-xs); color: var(--color-text-muted); border-top: 1px solid var(--color-border-subtle); padding-top: var(--space-3);">
                    Max: ${Math.round(data.daily.temperature_2m_max[0])}°C &nbsp;|&nbsp; Min: ${Math.round(data.daily.temperature_2m_min[0])}°C
                </div>
            </div>
        `);

        // Next 2 days
        for (let i = 1; i <= 2; i++) {
            const date = new Date(data.daily.time[i]);
            const dayName = new Intl.DateTimeFormat("de-DE", {
                weekday: "long",
            }).format(date);
            const wMap = getWeatherMap(data.daily.weather_code[i]);

            htmlParts.push(`
                <div class="card" style="text-align: center; padding: var(--space-6);">
                    <p style="font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; font-size: var(--font-size-xs); letter-spacing: var(--tracking-wider); margin-bottom: var(--space-3);">${dayName}</p>
                    <div style="display: flex; justify-content: center; align-items: center; height: 64px; margin-bottom: var(--space-2);">
                        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--color-text-primary); opacity: 0.6;">${wMap.icon}</span>
                    </div>
                    <p style="font-size: var(--font-size-2xl); font-weight: 700; margin-bottom: var(--space-1);">${Math.round(data.daily.temperature_2m_max[i])}°C</p>
                    <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); font-weight: 500;">${wMap.text}</p>
                    <div style="margin-top: var(--space-4); font-size: var(--font-size-xs); color: var(--color-text-muted); border-top: 1px solid var(--color-border-subtle); padding-top: var(--space-3);">
                        Min: ${Math.round(data.daily.temperature_2m_min[i])}°C
                    </div>
                </div>
            `);
        }

        container.innerHTML = htmlParts.join("");
        section.style.display = "block";
    } catch (error) {
        console.error("Failed to load weather data:", error);
    }
});
