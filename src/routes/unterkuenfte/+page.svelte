<script>
	import tourData from '$lib/data/tour.json';
</script>

<svelte:head>
	<title>Unterkünfte - {tourData.meta.title}</title>
</svelte:head>

<div class="page-content">
	<div class="container">
		<header class="page-header">
			<a href="/" class="back-link">
				<span class="material-symbols-outlined">arrow_back</span>
				Zurück zur Startseite
			</a>
			<h1 class="page-title">Unterkünfte</h1>
		</header>

		<div class="section">
			<p class="text-body-lg">
				Übersicht der reservierten Unterkünfte für die Tour {tourData.meta.title}.
			</p>
		</div>

		<div class="card-grid">
			{#each tourData.tourPlan.stages as stage}
				{#if stage.accommodation}
					<div class="card card--hover accommodation-card">
						<div class="accommodation-card__header">
							<span class="accommodation-card__badge">Etappe {stage.id}</span>
							<h3 class="accommodation-card__title">{stage.accommodation.name}</h3>
						</div>
						<div class="accommodation-card__content">
							<p class="accommodation-card__address">
								<span class="material-symbols-outlined">location_on</span>
								{stage.accommodation.address}
							</p>
							{#if stage.accommodation.notes}
								<p class="accommodation-card__notes">
									<span class="material-symbols-outlined">info</span>
									{stage.accommodation.notes}
								</p>
							{/if}
						</div>
						<div class="accommodation-card__actions">
							<a href="https://maps.google.com/?q={encodeURIComponent(stage.accommodation.name + ' ' + stage.accommodation.address)}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--small">
								In Maps öffnen
							</a>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>