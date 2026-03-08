/**
 * map.js - Leaflet Overview Map (all 6 stages)
 * Used on index.html and etappen.html
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

    // Color per stage
    const stageColors = [
        "#2d7d46",
        "#3b6ea0",
        "#c0392b",
        "#8e44ad",
        "#e67e22",
        "#16a085",
    ];
    const stageNames = [
        "Etappe 1: Liebethal → Stadt Wehlen",
        "Etappe 2: Stadt Wehlen → Brand-Baude",
        "Etappe 3: Brand-Baude → Lichtenhain",
        "Etappe 4: Lichtenhain → Reinhardtsdorf",
        "Etappe 5: Reinhardtsdorf → Königstein",
        "Etappe 6: Königstein → Pirna",
    ];
    const stageLinks = [
        "etappe-1.html",
        "etappe-2.html",
        "etappe-3.html",
        "etappe-4.html",
        "etappe-5.html",
        "etappe-6.html",
    ];

    const gpxBase = container.dataset.gpxBase || "assets/gpx/";
    const bounds = [];
    let loadedCount = 0;

    for (let i = 0; i < 6; i++) {
        const gpxUrl = `${gpxBase}etappe-${i + 1}.gpx`;
        new L.GPX(gpxUrl, {
            async: true,
            polyline_options: {
                color: stageColors[i],
                weight: 4,
                opacity: 0.9,
                lineJoin: "round",
                className: "gpx-track", // For Method 2 (Shadow)
            },
            marker_options: {
                startIconUrl: null,
                endIconUrl: null,
                shadowUrl: null,
                wptIconUrls: { "": null },
            },
        })
            .on("addline", function (e) {
                // Method 1: Create White Halo (Outline)
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
                if (loadedCount === 6) {
                    const combined = bounds.reduce(
                        (acc, cur) => acc.extend(cur),
                        bounds[0],
                    );
                    map.fitBounds(combined, { padding: [24, 24] });
                }
            })
            .on("click", function () {
                window.location.href = stageLinks[i];
            })
            .bindPopup(
                `<strong>${stageNames[i]}</strong><br><a href="${stageLinks[i]}">Details →</a>`,
            )
            .addTo(map);
    }

    map.setView([50.955, 14.28], 11);
})();
