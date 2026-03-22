/**
 * map.js - Leaflet Overview Map (all 6 stages)
 * Used on index.html and index.html#etappen
 */
(function () {
    "use strict";
    const container = document.getElementById("overview-map");
    if (!container) return;

    // Define base layers
    const osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap contributors",
        },
    );

    const topo = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '© <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            maxZoom: 17,
        },
    );

    const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            attribution:
                "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        },
    );

    // Initialize map with default layer
    const map = L.map("overview-map", {
        zoomControl: true,
        scrollWheelZoom: false,
        layers: [osm],
    });

    const baseMaps = {
        "Standard (OSM)": osm,
        Topografie: topo,
        Satellit: satellite,
    };

    L.control.layers(baseMaps).addTo(map);

    // Load data and render tracks
    dataProvider.init().then(() => {
        const tourPlan = dataProvider.getTourPlan();
        if (!tourPlan || !tourPlan.stages) return;

        const stages = tourPlan.stages;
        const gpxBase = container.dataset.gpxBase || "assets/gpx/";
        const bounds = [];
        let loadedCount = 0;

        stages.forEach((stage, i) => {
            const trackColor = dataProvider.getStageColor(stage.id);
            const gpxUrl = `${gpxBase}${stage.gpx}`;

            new L.GPX(gpxUrl, {
                async: true,
                polyline_options: {
                    color: trackColor,
                    weight: 4,
                    opacity: 0.9,
                    lineJoin: "round",
                    className: "gpx-track",
                },
                marker_options: {
                    startIconUrl: null,
                    endIconUrl: null,
                    shadowUrl: null,
                    wptIconUrls: { "": null },
                },
            })
                .on("addline", function (e) {
                    const halo = L.polyline(e.line.getLatLngs(), {
                        color: "#ffffff",
                        weight: 8,
                        opacity: 0.8,
                        lineJoin: "round",
                        interactive: false,
                    }).addTo(map);
                    halo.bringToBack();
                })
                .on("loaded", function (e) {
                    const b = e.target.getBounds();
                    bounds.push(b);
                    loadedCount++;
                    if (loadedCount === stages.length) {
                        const combined = bounds.reduce(
                            (acc, cur) => acc.extend(cur),
                            bounds[0],
                        );
                        map.fitBounds(combined, { padding: [24, 24] });
                    }
                })
                .on("click", function () {
                    window.location.href = stage.link;
                })
                .bindPopup(
                    `<strong>${stage.title}</strong><br><a href="${stage.link}">Details →</a>`,
                )
                .addTo(map);
        });
    });

    map.setView([50.955, 14.28], 11);
})();
