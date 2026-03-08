/**
 * App Loader for organisation.html
 * Fetches data via the HikeDataProvider and binds it to the DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();

        // 1. Meta Title
        const meta = dataProvider.getMeta();
        if (meta) {
            document.title = `Organisation - ${meta.title}`;
        }

        // 2. Organization Data
        const orgData = dataProvider.getOrganization();
        if (orgData) {
            // Schedule Table
            const scheduleContainer = document.getElementById(
                "schedule-list-container",
            );
            if (scheduleContainer && orgData.schedule) {
                scheduleContainer.innerHTML = "";
                orgData.schedule.forEach((item) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${item.day}</td>
                        <td>${item.date}</td>
                        <td><a href="${item.link}">${item.route}</a></td>
                        <td>${item.start}</td>
                    `;
                    scheduleContainer.appendChild(tr);
                });
            }

            // Participants
            const participantsContainer = document.getElementById(
                "participants-list-container",
            );
            if (participantsContainer && orgData.participants) {
                participantsContainer.innerHTML = "";
                orgData.participants.forEach((person) => {
                    const li = document.createElement("li");
                    li.className = "participant-item";
                    li.innerHTML = `
                        <div class="participant-item__avatar">${person.initials}</div>
                        <span class="participant-item__name">${person.name}</span>
                    `;
                    participantsContainer.appendChild(li);
                });
            }

            // Meeting Points
            const meetingPointsContainer = document.getElementById(
                "meeting-points-list-container",
            );
            if (meetingPointsContainer && orgData.meetingPoints) {
                meetingPointsContainer.innerHTML = "";
                orgData.meetingPoints.forEach((point) => {
                    const li = document.createElement("li");
                    li.className = "feature-item";
                    li.innerHTML = `
                        <span class="material-symbols-outlined">${point.icon}</span>
                        <div>
                            <strong style="display:block;color:var(--color-text-primary);">${point.title}</strong>
                            <span class="feature-item__text">${point.desc}</span>
                        </div>
                    `;
                    meetingPointsContainer.appendChild(li);
                });
            }
        }
    } catch (error) {
        console.error("Failed to initialize app data:", error);
    }
});
