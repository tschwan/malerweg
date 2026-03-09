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

        // 2. Schedule Timeline (using tourPlan as source of truth)
        const tourPlan = dataProvider.getTourPlan();
        if (tourPlan && tourPlan.stages) {
            const timelineContainer =
                document.getElementById("schedule-timeline");
            if (timelineContainer) {
                timelineContainer.innerHTML = "";
                tourPlan.stages.forEach((stage) => {
                    const item = document.createElement("div");
                    item.className = "timeline__item";
                    item.innerHTML = `
                        <div class="timeline__marker"></div>
                        <div class="timeline__content">
                            <p class="timeline__day">${stage.day}, ${stage.date}.</p>
                            <h3 class="timeline__title"><a href="${stage.link}">${stage.route}</a></h3>
                            <div class="timeline__meta">
                                <span class="timeline__meta-item">
                                    <span class="material-symbols-outlined">schedule</span>
                                    ${stage.startTime} Uhr
                                </span>
                                <span class="timeline__meta-item">
                                    <span class="material-symbols-outlined">arrow_range</span>
                                    ${stage.distance}
                                </span>
                            </div>
                        </div>
                    `;
                    timelineContainer.appendChild(item);
                });
            }
        }

        // 3. Organization Data (Participants & Meeting Points)
        const orgData = dataProvider.getOrganization();
        if (orgData) {
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
