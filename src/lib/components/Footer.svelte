<script>
	export let tour;
</script>

<footer class="site-footer" id="main-footer">
	<div class="container">
		<div class="site-footer__grid">
			<div>
				<div class="site-footer__brand">
					<span class="material-symbols-outlined site-footer__brand-icon">terrain</span>
					<span class="site-footer__brand-name">{tour.meta.title.split(' ')[0]}</span>
				</div>
				<p class="site-footer__desc">
					{tour.meta.description}
				</p>
				<p class="site-footer__desc">
					<br>
					Powered by Stagely - Your hike perfectly staged
				</p>
			</div>
			<div class="site-footer__col">
				<h5>Informationen</h5>
				<ul>
					<li><a href="/organisation">Organisation & Anreise</a></li>
					<li><a href="/navigation">Empfohlene Apps</a></li>
					<li><a href="/links">Nützliche Links</a></li>
				</ul>
			</div>
			<div class="site-footer__col">
				<h5>Sonstiges</h5>
				<ul>
					<li><a href="#">Impressum</a></li>
					<li><a href="#">Datenschutz</a></li>
				</ul>
			</div>
			<div class="site-footer__col site-footer__emergency">
				<h5>Notfall</h5>
				<ul>
					<li class="site-footer__emergency-item">
						<span class="material-symbols-outlined">call</span>
						Rettungsdienst: {tour.meta.emergency.rescue}
					</li>
					<li class="site-footer__emergency-item">
						<span class="material-symbols-outlined">local_hospital</span>
						Polizei: {tour.meta.emergency.police}
					</li>
				</ul>
			</div>
		</div>
	</div>
</footer>