<script>
	import { onMount, onDestroy } from 'svelte';

	export let gpxUrl;
	export let stageData = null; // Optional: To render elevation or markers if needed

	let mapContainer;
	let map;

	onMount(async () => {
		// Import dynamically to avoid SSR issues with Leaflet
		const L = (await import('leaflet')).default;
		await import('leaflet-gpx');

		map = L.map(mapContainer, {
			zoomControl: true,
			scrollWheelZoom: false // Usually better for embedded maps on scrolling pages
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		if (gpxUrl) {
			new L.GPX(gpxUrl, {
				async: true,
				marker_options: {
					startIconUrl: '/assets/images/pin-icon-start.png',
					endIconUrl: '/assets/images/pin-icon-end.png',
					shadowUrl: '/assets/images/pin-shadow.png'
				},
				polyline_options: {
					color: 'var(--color-primary)',
					opacity: 0.8,
					weight: 5,
					lineCap: 'round'
				}
			})
				.on('loaded', function (e) {
					map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
				})
				.addTo(map);
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="map-container" bind:this={mapContainer} style="height: 400px; width: 100%; z-index: 1;"></div>
