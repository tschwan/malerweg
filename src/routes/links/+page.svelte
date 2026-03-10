<script>
	import tourData from '$lib/data/tour.json';
</script>

<svelte:head>
	<title>Nützliche Links - {tourData.meta.title}</title>
</svelte:head>

<div class="page-content">
	<div class="container">
		<header class="page-header">
			<a href="/" class="back-link">
				<span class="material-symbols-outlined">arrow_back</span>
				Zurück zur Startseite
			</a>
			<h1 class="page-title">Nützliche Links</h1>
		</header>

		<section class="section">
			<p class="text-body-lg">
				Weitere Informationen, Fahrpläne und nützliche Ressourcen zur Sächsischen Schweiz.
			</p>
		</section>

		<div class="card-grid">
			{#each tourData.links as linkGroup}
				<div class="card card--content link-group">
					<div class="card__header">
						<h2 class="card__title">
							<span class="material-symbols-outlined">{linkGroup.icon || 'link'}</span>
							{linkGroup.category}
						</h2>
					</div>
					<div class="card__body">
						<ul class="link-list">
							{#each linkGroup.items as link}
								<li class="link-list__item">
									<a href="{link.url}" target="_blank" rel="noopener noreferrer" class="link-list__link">
										{link.title}
										<span class="material-symbols-outlined link-list__icon">open_in_new</span>
									</a>
									{#if link.description}
										<p class="link-list__desc text-sm">{link.description}</p>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>