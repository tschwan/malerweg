<script>
	export let tour;

	let isMobileNavOpen = false;
	let isThemeDropdownOpen = false;
	let isEtappenDropdownOpen = false;

	function toggleMobileNav() {
		isMobileNavOpen = !isMobileNavOpen;
	}

	function toggleThemeDropdown() {
		isThemeDropdownOpen = !isThemeDropdownOpen;
		isEtappenDropdownOpen = false;
	}

	function toggleEtappenDropdown(e) {
		if (window.innerWidth >= 832) {
			e.preventDefault();
			isEtappenDropdownOpen = !isEtappenDropdownOpen;
			isThemeDropdownOpen = false;
		}
	}

	function setTheme(theme) {
		document.documentElement.classList.remove(
			'theme-ocean',
			'theme-autumn',
			'theme-dark',
			'theme-dark-brown'
		);
		if (theme) {
			document.documentElement.classList.add(theme);
		}
		try {
			localStorage.setItem('malerweg-theme', theme);
		} catch (e) {}
		isThemeDropdownOpen = false;
	}

	// Close dropdowns on outside click
	function handleOutsideClick(e) {
		if (!e.target.closest('.theme-trigger-container')) {
			isThemeDropdownOpen = false;
		}
		if (!e.target.closest('.site-nav__item--dropdown')) {
			isEtappenDropdownOpen = false;
		}
	}
</script>

<svelte:window on:click={handleOutsideClick} />

<header class="site-header">
	<div class="container site-header__container">
		<a href="/" class="site-brand" aria-label="Startseite">
			<span class="material-symbols-outlined site-brand__icon">terrain</span>
			<span class="site-brand__name">{tour.meta.title.split(' ')[0]}</span>
		</a>

		<div class="site-nav-wrapper">
			<nav class="site-nav" aria-label="Hauptnavigation">
				<div class="site-nav__item site-nav__item--dropdown" class:is-open={isEtappenDropdownOpen}>
					<a class="site-nav__link" href="/#etappen" on:click={toggleEtappenDropdown}>
						Etappen <span class="material-symbols-outlined dropdown-icon">expand_more</span>
					</a>
					<div class="site-nav__submenu">
						<a class="site-nav__submenu-link" href="/#etappen">Alle Etappen</a>
						{#each tour.tourPlan.stages as stage, i}
							<a class="site-nav__submenu-link" href="/etappen/{stage.id}">Etappe {stage.id}</a>
						{/each}
					</div>
				</div>
				<a class="site-nav__link" href="/unterkuenfte">Unterkünfte</a>
				<a class="site-nav__link" href="/organisation">Organisation</a>
				<a class="site-nav__link" href="/navigation">Navigation</a>
				<a class="site-nav__link" href="/links">Links</a>
				<a class="site-nav__link" href="/downloads">Downloads</a>
			</nav>

			<div class="theme-trigger-container" class:is-open={isThemeDropdownOpen}>
				<button class="theme-trigger" aria-label="Theme wählen" on:click|stopPropagation={toggleThemeDropdown}>
					<span class="material-symbols-outlined">palette</span>
				</button>
				<div class="theme-dropdown">
					<button class="theme-menu-item" on:click={() => setTheme('')}>
						<span class="theme-dot" style="background-color: #f7f9f6; border: 1px solid #d4dec9;"></span> Natur (Standard)
					</button>
					<button class="theme-menu-item" on:click={() => setTheme('theme-ocean')}>
						<span class="theme-dot" style="background-color: #f5f8fa; border: 1px solid #c2d5e3;"></span> Ozean
					</button>
					<button class="theme-menu-item" on:click={() => setTheme('theme-autumn')}>
						<span class="theme-dot" style="background-color: #fcf8f2; border: 1px solid #e8cdab;"></span> Herbst
					</button>
					<button class="theme-menu-item" on:click={() => setTheme('theme-dark')}>
						<span class="theme-dot" style="background-color: #1a2e24; border: 1px solid #7da98d;"></span> Dunkel
					</button>
					<button class="theme-menu-item" on:click={() => setTheme('theme-dark-brown')}>
						<span class="theme-dot" style="background-color: #26211d; border: 1px solid #a88a6d;"></span> Dunkelbraun
					</button>
				</div>
			</div>

			<button class="nav-toggle" aria-expanded={isMobileNavOpen} aria-label="Menü öffnen" on:click={toggleMobileNav}>
				<span class="material-symbols-outlined">{isMobileNavOpen ? 'close' : 'menu'}</span>
			</button>
		</div>
	</div>

	<nav class="site-nav-mobile" class:is-open={isMobileNavOpen} aria-label="Mobile Navigation">
		<div class="site-nav-mobile__group">
			<span class="site-nav-mobile__label">Etappen</span>
			<a class="site-nav__link" href="/#etappen" on:click={toggleMobileNav}>Alle Etappen</a>
			{#each tour.tourPlan.stages as stage}
				<a class="site-nav__link" href="/etappen/{stage.id}" on:click={toggleMobileNav}>Etappe {stage.id}</a>
			{/each}
		</div>
		<div class="site-nav-mobile__group">
			<span class="site-nav-mobile__label">Menü</span>
			<a class="site-nav__link" href="/unterkuenfte" on:click={toggleMobileNav}>Unterkünfte</a>
			<a class="site-nav__link" href="/organisation" on:click={toggleMobileNav}>Organisation</a>
			<a class="site-nav__link" href="/navigation" on:click={toggleMobileNav}>Navigation</a>
			<a class="site-nav__link" href="/links" on:click={toggleMobileNav}>Links</a>
			<a class="site-nav__link" href="/downloads" on:click={toggleMobileNav}>Downloads</a>
		</div>
	</nav>
</header>
