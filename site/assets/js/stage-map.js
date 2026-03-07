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
        layers: [osm],
    });
    const baseMaps = {
        "Standard (OSM)": osm,
        Topografie: topo,
        Satellit: satellite,
    };
    L.control.layers(baseMaps).addTo(map);
    const trackColor = container.dataset.color || "#2d4c3b";
    // Load GPX track for visual display
    new L.GPX(gpxUrl, {
        async: true,
        polyline_options: {
            color: trackColor,
            weight: 5,
            opacity: 1,
            lineJoin: "round",
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
                weight: 10,
                opacity: 0.8,
                lineJoin: "round",
                interactive: false,
            }).addTo(map);
            halo.bringToBack();
        })
        .on("loaded", function (e) {
            map.fitBounds(e.target.getBounds(), { padding: [32, 32] });
        })
        .addTo(map);
    // Initialize elevation profile
    const elevationDiv = document.getElementById("elevation-div");
    if (elevationDiv) {
        // Hover marker shown on map when chart is hovered
        const hoverMarker = L.circleMarker([0, 0], {
            radius: 8,
            fillColor: trackColor,
            fillOpacity: 1,
            color: "#ffffff",
            weight: 3,
            interactive: false,
        });
        const elevationControl = L.control.elevation({
            theme: "lime-theme",
            detached: true,
            elevationDiv: "#elevation-div",
            autofitBounds: false,
            position: "bottomleft",
            summary: "inline",
            altitude: true,
            slope: "disabled",
            speed: false,
            acceleration: false,
            time: true,
            legend: true,
            followMarker: false,
            almostOver: false,
            distanceMarkers: false,
            downloadLink: false,
            polyline: {
                color: "transparent",
                weight: 0,
                opacity: 0,
            },
        });
        elevationControl.addTo(map);
        elevationControl.load(gpxUrl);
        // Listen to chart mouse events for hover marker
        elevationControl.on("elechart_hover", function (e) {
            if (e && e.data && e.data.latlng) {
                hoverMarker.setLatLng(e.data.latlng).addTo(map);
            }
        });
        elevationControl.on("elechart_leave", function () {
            hoverMarker.remove();
        });
    }
    map.setView([50.955, 14.28], 13);
})();
