<script>
	import tourData from '$lib/data/tour.json';
</script>

<svelte:head>
	<title>Navigation & Apps - {tourData.meta.title}</title>
</svelte:head>

<div class="page-content">
	<div class="container">
		<header class="page-header">
			<a href="/" class="back-link">
				<span class="material-symbols-outlined">arrow_back</span>
				Zurück zur Startseite
			</a>
			<h1 class="page-title">Navigation & Apps</h1>
		</header>

		<section class="section">
			<p class="text-body-lg">
				Damit wir uns nicht verlaufen, hier die wichtigsten Apps und Tools zur Navigation auf unserer Wanderung.
			</p>
		</section>

		<div class="card-grid">
			{#each tourData.navigation.apps as app}
				<div class="card card--hover app-card">
					<div class="app-card__header">
						<span class="material-symbols-outlined app-card__icon">{app.icon || 'smartphone'}</span>
						<h3 class="app-card__title">{app.name}</h3>
					</div>
					<div class="app-card__content">
						<p class="app-card__desc">{@html app.description}</p>
					</div>
					<div class="app-card__actions">
						{#if app.links.ios}
							<a href="{app.links.ios}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--small">
								<span class="material-symbols-outlined">phone_iphone</span> App Store
							</a>
						{/if}
						{#if app.links.android}
							<a href="{app.links.android}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--small">
								<span class="material-symbols-outlined">android</span> Play Store
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>