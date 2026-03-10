<script>
	import Map from '$lib/components/Map.svelte';
	export let data;
	$: stage = data.stage;
</script>

<svelte:head>
	<title>Etappe {stage.id}: {stage.title} - Malerweg</title>
	<meta name="description" content="Details zur Etappe {stage.id} auf dem Malerweg: {stage.title}." />
</svelte:head>

<div class="page-content">
	<div class="container">
		<header class="page-header">
			<a href="/#etappen" class="back-link">
				<span class="material-symbols-outlined">arrow_back</span>
				Zurück zur Übersicht
			</a>
			<h1 class="page-title">
				<span class="page-title__badge">Etappe {stage.id}</span>
				{stage.title}
			</h1>
		</header>

		<div class="stage-grid">
			<div class="stage-main">
				<!-- BILD & INTRO -->
				<section class="card stage-intro">
					<div class="stage-intro__image" style="background-image: url('assets/images/stage-{stage.id}.jpg');"></div>
					<div class="stage-intro__content">
						<p class="text-lead">{stage.description}</p>
					</div>
				</section>

				<!-- HIGHLIGHTS -->
				<section class="card section--mt">
					<h2 class="section__title">Highlights</h2>
					<ul class="highlight-list">
						{#each stage.highlights as highlight}
							<li class="highlight-item">
								<span class="material-symbols-outlined highlight-icon">{highlight.icon}</span>
								{highlight.text}
							</li>
						{/each}
					</ul>
				</section>
			</div>

			<aside class="stage-sidebar">
				<!-- FACTS -->
				<div class="card card--accent facts-card">
					<h3 class="facts-title">Fakten</h3>
					<div class="facts-grid">
						<div class="fact-item">
							<span class="material-symbols-outlined fact-item__icon">route</span>
							<span class="fact-item__label">Strecke</span>
							<strong class="fact-item__value">{stage.distance}</strong>
						</div>
						<div class="fact-item">
							<span class="material-symbols-outlined fact-item__icon">schedule</span>
							<span class="fact-item__label">Dauer</span>
							<strong class="fact-item__value">{stage.duration}</strong>
						</div>
						<div class="fact-item">
							<span class="material-symbols-outlined fact-item__icon">trending_up</span>
							<span class="fact-item__label">Aufstieg</span>
							<strong class="fact-item__value">{stage.elevation}</strong>
						</div>
						<div class="fact-item">
							<span class="material-symbols-outlined fact-item__icon">speed</span>
							<span class="fact-item__label">Schwierigkeit</span>
							<strong class="fact-item__value">{stage.difficulty}</strong>
						</div>
					</div>

					<!-- ACCOMMODATION -->
					{#if stage.accommodation}
						<div class="accommodation-widget">
							<h4 class="accommodation-widget__title">
								<span class="material-symbols-outlined">bed</span>
								Unterkunft
							</h4>
							<p class="accommodation-widget__name">
								<strong>{stage.accommodation.name}</strong><br>
								{#if stage.accommodation.details && stage.accommodation.details.address}
								    {stage.accommodation.details.address}
								{/if}
							</p>
							{#if stage.accommodation.details && stage.accommodation.details.info}
								<p class="accommodation-widget__notes text-sm">{stage.accommodation.details.info}</p>
							{/if}
							<a href="/unterkuenfte" class="accommodation-widget__link">Alle Unterkünfte ansehen →</a>
						</div>
					{/if}
				</div>

				<!-- GPX DOWNLOAD -->
				<div class="card download-card section--mt">
					<span class="material-symbols-outlined download-card__icon">download</span>
					<div class="download-card__content">
						<h4 class="download-card__title">GPX Track laden</h4>
						<p class="download-card__text text-sm">Track für Navi oder App.</p>
					</div>
					<a href="/assets/gpx/{stage.gpx}" download class="btn btn--outline btn--small">
						Laden
					</a>
				</div>
			</aside>
		</div>

		<!-- KARTE -->
		<section class="section section--mt stage-map-section">
			<h2 class="section__title">Route</h2>
			<div class="card card--map">
				{#key stage.id}
					<Map gpxUrl="/assets/gpx/{stage.gpx}" />
				{/key}
				<div class="map-legend">
					<div class="map-legend__item">
						<img src="/assets/images/pin-icon-start.png" alt="Start" class="map-legend__icon" />
						Start
					</div>
					<div class="map-legend__item">
						<img src="/assets/images/pin-icon-end.png" alt="Ziel" class="map-legend__icon" />
						Ziel
					</div>
				</div>
			</div>
		</section>

		<!-- ELEVATION PROFILE -->
		{#if stage.elevationProfileImage}
			<section class="section section--mt">
				<h2 class="section__title">Höhenprofil</h2>
				<div class="card elevation-profile-card">
					<img src="{stage.elevationProfileImage}" alt="Höhenprofil Etappe {stage.id}" class="elevation-profile-image" />
				</div>
			</section>
		{/if}
	</div>
</div>