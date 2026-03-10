<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import tourData from '$lib/data/tour.json';

	// Import global CSS styles directly
	import '../../static/assets/css/tokens.css';
	import '../../static/assets/css/base.css';
	import '../../static/assets/css/layout.css';
	import '../../static/assets/css/components.css';
	import '../../static/assets/css/pages.css';

</script>

<Header tour={tourData} />
<main>
	<slot />
</main>
<Footer tour={tourData} />