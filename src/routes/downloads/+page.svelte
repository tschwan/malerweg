<script>
	import tourData from '$lib/data/tour.json';
</script>

<svelte:head>
	<title>Downloads - {tourData.meta.title}</title>
</svelte:head>

<div class="page-content">
	<div class="container">
		<header class="page-header">
			<a href="/" class="back-link">
				<span class="material-symbols-outlined">arrow_back</span>
				Zurück zur Startseite
			</a>
			<h1 class="page-title">Downloads & GPX Tracks</h1>
		</header>

		<section class="section">
			<p class="text-body-lg">
				Lade dir die GPX-Tracks für dein GPS-Gerät oder deine Navigations-App herunter. Du kannst entweder die komplette Tour oder die einzelnen Etappen laden.
			</p>
		</section>

		<div class="card card--accent download-hero section">
			<div class="download-hero__content">
				<span class="material-symbols-outlined download-hero__icon">map</span>
				<div>
					<h2 class="download-hero__title">Komplette Tour</h2>
					<p class="download-hero__desc text-sm">Alle Etappen in einer Datei (ZIP oder kombiniertes GPX).</p>
				</div>
			</div>
			<a href="/assets/gpx/malerweg-komplett.zip" class="btn btn--primary download-hero__btn">
				<span class="material-symbols-outlined">download</span> Komplettpaket laden
			</a>
		</div>

		<h2 class="section__title">Einzelne Etappen</h2>
		<div class="card-grid">
			{#each tourData.tourPlan.stages as stage}
				<div class="card card--hover download-card">
					<div class="download-card__header">
						<span class="download-card__badge">Etappe {stage.id}</span>
						<h3 class="download-card__title">{stage.title}</h3>
					</div>
					<div class="download-card__meta">
						<span class="download-card__meta-item">
							<span class="material-symbols-outlined">route</span> {stage.distance}
						</span>
						<span class="download-card__meta-item">
							<span class="material-symbols-outlined">schedule</span> {stage.duration}
						</span>
					</div>
					<div class="download-card__actions">
						<a href="{stage.gpxFile}" download class="btn btn--outline btn--small">
							<span class="material-symbols-outlined">download</span> GPX Track
						</a>
						<a href="/etappen/{stage.id}" class="btn btn--ghost btn--small">
							Details
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>