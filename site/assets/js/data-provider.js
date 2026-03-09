/**
 * DataProvider Class
 * Wrapper to encapsulate data access. Currently fetches from a local JSON file,
 * but can easily be swapped with a database or API call in the future.
 */
class HikeDataProvider {
    constructor(dataSourceUrl = "assets/data/hike-data.json") {
        this.dataSourceUrl = dataSourceUrl;
        this.data = null;
        this.loadPromise = null;
    }

    /**
     * Initializes the provider by fetching the data.
     * Caches the promise to prevent multiple concurrent requests.
     */
    async init() {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = fetch(this.dataSourceUrl)
            .then((res) => {
                if (!res.ok)
                    throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                this.data = data;
                return true;
            })
            .catch((error) => {
                console.error("Failed to load hike data:", error);
                this.loadPromise = null; // Allow retrying
                throw error;
            });

        return this.loadPromise;
    }

    _ensureDataLoaded() {
        if (!this.data) {
            throw new Error("Data not loaded. Call init() first.");
        }
    }

    getMeta() {
        this._ensureDataLoaded();
        return this.data.meta;
    }

    getHero() {
        this._ensureDataLoaded();
        return this.data.hero;
    }

    getIntro() {
        this._ensureDataLoaded();
        return this.data.intro;
    }

    getWeather() {
        this._ensureDataLoaded();
        return this.data.weather;
    }

    getOrganization() {
        this._ensureDataLoaded();
        return this.data.organization;
    }

    getTourPlan() {
        this._ensureDataLoaded();
        return this.data.tourPlan;
    }

    getOverviewMap() {
        this._ensureDataLoaded();
        return this.data.overviewMap;
    }

    getAccommodations() {
        this._ensureDataLoaded();
        return this.data.accommodations;
    }

    getLinks() {
        this._ensureDataLoaded();
        return this.data.links;
    }

    getTransport() {
        this._ensureDataLoaded();
        return this.data.transport;
    }

    getDownloads() {
        this._ensureDataLoaded();
        return this.data.downloads;
    }

    getNavigation() {
        this._ensureDataLoaded();
        return this.data.navigation;
    }
}

// Global instance (can also be instantiated per page if needed)
window.dataProvider = new HikeDataProvider();
