<script>
	import tourData from '$lib/data/tour.json';
	const org = tourData.organization;
</script>

<svelte:head>
	<title>Organisation - {tourData.meta.title}</title>
</svelte:head>

<div class="page-content">
	<div class="container">
		<header class="page-header">
			<a href="/" class="back-link">
				<span class="material-symbols-outlined">arrow_back</span>
				Zurück zur Startseite
			</a>
			<h1 class="page-title">Organisation & Anreise</h1>
		</header>

		<section class="section">
			<div class="two-col" style="row-gap: var(--space-12);">
				<!-- 1. Teilnehmer -->
				<div>
					<div class="section-icon-header">
						<span class="material-symbols-outlined">groups</span>
						<h2>Teilnehmer</h2>
					</div>
					<div class="card">
						<ul class="participant-list">
							{#if org.participants}
								{#each org.participants as participant}
									<li class="participant-item">
										<div class="participant-avatar">{participant.initials}</div>
										<span class="participant-name">{participant.name}</span>
									</li>
								{/each}
							{/if}
						</ul>
					</div>
				</div>

				<!-- 2. Anreise -->
				<div>
					<div class="section-icon-header">
						<span class="material-symbols-outlined">location_on</span>
						<h2>Anreise nach Liebethal</h2>
					</div>
					<div class="card">
						{#if org.arrival && org.arrival.options}
							{#each org.arrival.options as option}
								<div class="transit-option">
									<div class="transit-option__header">
										<span class="material-symbols-outlined">{option.icon || 'train'}</span>
										<div class="transit-option__title">{option.title}</div>
									</div>
									<div class="transit-option__desc">{@html option.desc}</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>

				<!-- 3. Tagesplan -->
				<div>
					<div class="section-icon-header">
						<span class="material-symbols-outlined">calendar_today</span>
						<h2>Tagesplan</h2>
					</div>
					<div class="card" style="padding-top: var(--space-8); padding-bottom: var(--space-4);">
						<div class="timeline">
							{#if org.schedule}
								{#each org.schedule as item}
									<div class="timeline__item">
										<div class="timeline__time">{item.time}</div>
										<div class="timeline__content">
											<div class="timeline__title">{item.title}</div>
											{#if item.desc}
												<div class="timeline__desc">{@html item.desc}</div>
											{/if}
										</div>
									</div>
								{/each}
							{/if}
						</div>
					</div>
				</div>

				<!-- 4. ÖPNV -->
				<div>
					<div class="section-icon-header">
						<span class="material-symbols-outlined">tram</span>
						<h2>ÖPNV auf der Route</h2>
					</div>
					<div class="card">
						{#if org.localTransport}
							{#each org.localTransport as transport}
								<div class="transit-option">
									<div class="transit-option__header">
										<span class="material-symbols-outlined">{transport.icon || 'directions_bus'}</span>
										<div class="transit-option__title">{transport.title}</div>
									</div>
									<div class="transit-option__desc">{@html transport.desc}</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>

				<!-- 5. Treffpunkte -->
				<div>
					<div class="section-icon-header">
						<span class="material-symbols-outlined">map</span>
						<h2>Treffpunkte</h2>
					</div>
					<div class="card">
						<ul class="feature-list">
							{#if org.meetingPoints}
								{#each org.meetingPoints as point}
									<li class="feature-item">
										<span class="material-symbols-outlined">{point.icon || 'flag'}</span>
										<div class="feature-content">
											<div class="feature-title">{point.title}</div>
											<div class="feature-desc">{@html point.desc}</div>
										</div>
									</li>
								{/each}
							{/if}
						</ul>
					</div>
				</div>

				<!-- 6. Abreise -->
				<div>
					<div class="section-icon-header">
						<span class="material-symbols-outlined">exit_to_app</span>
						<h2>Abreise von Pirna</h2>
					</div>
					<div class="card">
						{#if org.departure && org.departure.options}
							{#each org.departure.options as option}
								<div class="transit-option">
									<div class="transit-option__header">
										<span class="material-symbols-outlined">{option.icon || 'train'}</span>
										<div class="transit-option__title">{option.title}</div>
									</div>
									<div class="transit-option__desc">{@html option.desc}</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</section>
	</div>
</div>