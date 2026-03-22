<script>
	import tourData from '$lib/data/tour.json';

	// Compute start date from subtitle or a specific date field if available
	// For simplicity, using a static date or parsing from subtitle for countdown
	const startDate = new Date('2026-05-04T08:00:00');
	let timeRemaining = { days: 0, hours: 0, minutes: 0 };

	function updateCountdown() {
		const now = new Date().getTime();
		const distance = startDate.getTime() - now;

		if (distance < 0) return;

		timeRemaining = {
			days: Math.floor(distance / (1000 * 60 * 60 * 24)),
			hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
			minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
		};
	}

	import { onMount } from 'svelte';
	onMount(() => {
		updateCountdown();
		const interval = setInterval(updateCountdown, 60000); // update every minute
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{tourData.meta.title}</title>
	<meta name="description" content="{tourData.meta.description}" />
</svelte:head>

<!-- HERO -->
<section class="page-hero">
	<div class="page-hero__bg" style="background-image: url('{tourData.hero.backgroundImage}');"></div>
	<div class="page-hero__overlay"></div>
	<div class="page-hero__content">
		<h1 class="page-hero__title">{tourData.hero.title}</h1>
		<p class="page-hero__subtitle">{tourData.hero.subtitle}</p>

		<div class="countdown">
			<div class="countdown__item">
				<span class="countdown__value">{timeRemaining.days}</span>
				<span class="countdown__label">Tage</span>
			</div>
			<div class="countdown__item">
				<span class="countdown__value">{timeRemaining.hours}</span>
				<span class="countdown__label">Std</span>
			</div>
			<div class="countdown__item">
				<span class="countdown__value">{timeRemaining.minutes}</span>
				<span class="countdown__label">Min</span>
			</div>
		</div>

		<div class="page-hero__actions">
			<a href="#etappen" class="btn btn--primary">
				<span class="material-symbols-outlined">list_alt</span>
				Alle Etappen
			</a>
			<a href="/downloads" class="btn btn--ghost">
				<span class="material-symbols-outlined">download</span>
				Downloads
			</a>
		</div>
	</div>
</section>

<!-- STATS -->
<section class="stats-bar">
	<div class="container stats-bar__grid">
		<div class="stat-item">
			<span class="material-symbols-outlined stat-item__icon">route</span>
			<div>
				<div class="stat-item__value">{tourData.hero.stats.distance}</div>
				<div class="stat-item__label">Gesamtstrecke</div>
			</div>
		</div>
		<div class="stat-item">
			<span class="material-symbols-outlined stat-item__icon">landscape</span>
			<div>
				<div class="stat-item__value">{tourData.hero.stats.elevation}</div>
				<div class="stat-item__label">Höhenmeter</div>
			</div>
		</div>
		<div class="stat-item">
			<span class="material-symbols-outlined stat-item__icon">schedule</span>
			<div>
				<div class="stat-item__value">{tourData.hero.stats.stages}</div>
				<div class="stat-item__label">Etappen</div>
			</div>
		</div>
	</div>
</section>

<div class="container page-content">
	<!-- INTRO -->
	<section class="section">
		<h2 class="section__title">{tourData.intro.title}</h2>
		<p class="text-body-lg">{@html tourData.intro.content}</p>
	</section>

	<!-- WEATHER WIDGET MOCK (Can be implemented fully if needed) -->
	<section class="section" id="weather-section">
		<div class="card weather-card">
			<div class="weather-header">
				<h3 class="weather-title">Wetter {tourData.weather.location}</h3>
				<span class="material-symbols-outlined weather-icon-large">partly_cloudy_day</span>
			</div>
			<div class="weather-forecast" id="weather-forecast">
				<!-- Mock forecast for static template, real implementation fetches from API -->
				<div class="forecast-day">
					<span class="forecast-date">Heute</span>
					<span class="material-symbols-outlined forecast-icon">sunny</span>
					<span class="forecast-temp">15°</span>
				</div>
				<div class="forecast-day">
					<span class="forecast-date">Morgen</span>
					<span class="material-symbols-outlined forecast-icon">partly_cloudy_day</span>
					<span class="forecast-temp">12°</span>
				</div>
				<div class="forecast-day">
					<span class="forecast-date">Übermorgen</span>
					<span class="material-symbols-outlined forecast-icon">rainy</span>
					<span class="forecast-temp">9°</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ETAPPEN LISTE -->
	<section class="section" id="etappen">
		<h2 class="section__title">Etappen Übersicht</h2>
		<div class="card-grid">
			{#each tourData.tourPlan.stages as stage}
				<a href="/etappen/{stage.id}" class="card card--hover">
					<div class="card__image">
						<img src="{stage.image}" alt="{stage.title}" loading="lazy" />
						<div class="card__badge">Etappe {stage.id}</div>
					</div>
					<div class="card__content">
						<h3 class="card__title">{stage.title}</h3>
						<div class="card__meta">
							<span class="card__meta-item">
								<span class="material-symbols-outlined">route</span>
								{stage.distance}
							</span>
							<span class="card__meta-item">
								<span class="material-symbols-outlined">trending_up</span>
								{stage.elevationUp}
							</span>
							<span class="card__meta-item">
								<span class="material-symbols-outlined">schedule</span>
								{stage.duration}
							</span>
						</div>
						<p class="card__text">{stage.descriptionShort}</p>
						<span class="card__link">
							Details ansehen <span class="material-symbols-outlined">arrow_forward</span>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- QUICK LINKS -->
	<section class="section section--bg quick-links-section">
		<div class="card-grid">
			<a href="/unterkuenfte" class="card card--hover quick-link-card">
				<div class="card__content quick-link-content">
					<span class="material-symbols-outlined quick-link-icon">bed</span>
					<h3 class="card__title">Unterkünfte</h3>
					<p class="card__text">Details zu unseren reservierten Unterkünften für jede Etappe.</p>
				</div>
			</a>
			<a href="/organisation" class="card card--hover quick-link-card">
				<div class="card__content quick-link-content">
					<span class="material-symbols-outlined quick-link-icon">train</span>
					<h3 class="card__title">An-/Abreise</h3>
					<p class="card__text">Informationen zur gemeinsamen Anreise und Abreise.</p>
				</div>
			</a>
		</div>
	</section>
</div>