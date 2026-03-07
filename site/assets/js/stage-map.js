/**
 * stage-map.js – Leaflet Map for a Single Stage
 * Reads data-gpx attribute from the map container div.
 */
(function () {
    "use strict";
    const container = document.getElementById("stage-map");
    if (!container) return;

    const gpxUrl = container.dataset.gpx;
    if (!gpxUrl) return;

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

    const map = L.map("stage-map", {
        zoomControl: true,
        scrollWheelZoom: false,
        layers: [osm], // Default layer
    });

    const baseMaps = {
        "Standard (OSM)": osm,
        Topografie: topo,
        Satellit: satellite,
    };

    L.control.layers(baseMaps).addTo(map);

    const trackColor = container.dataset.color || "#2d4c3b";
    new L.GPX(gpxUrl, {
        async: true,
        polyline_options: {
            color: trackColor,
            weight: 5,
            opacity: 1,
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
                weight: 10,
                opacity: 0.8,
                lineJoin: "round",
                interactive: false,
            }).addTo(map);
            halo.bringToBack();
        })
        .on("loaded", function (e) {
            map.fitBounds(e.target.getBounds(), { padding: [32, 32] });
            // Show distance info
            /*
            const dist = e.target.get_distance();
            const infoEl = document.getElementById("stage-map-info");
            if (infoEl && dist) {
                infoEl.textContent = `Streckenlänge: ${(dist / 1000).toFixed(1)} km`;
            }
            */
        })
        .addTo(map);

    const elevationDiv = document.getElementById("elevation-div");
    if (elevationDiv) {
        // Initialize elevation profile
        const elevationControl = L.control.elevation({
            theme: "lime-theme",
            detached: true,
            elevationDiv: "#elevation-div",
            autofitBounds: true,
            position: "bottomleft",
            summary: "inline",
            altitude: true,
            slope: "disabled",
            speed: false,
            acceleration: false,
            time: true,
            legend: true,
            followMarker: true,
            almostOver: true,
            distanceMarkers: false,
            downloadLink: false,
            polyline: {
                className: "elevation-polyline-hidden",
                color: "transparent",
                opacity: 0,
                weight: 0,
            },
        });
        elevationControl.addTo(map);
        elevationControl.load(gpxUrl);
    }

    map.setView([50.955, 14.28], 13);
})();
