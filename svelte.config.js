import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			// If deploying to a subfolder on GitHub Pages, we might need to set the base path.
			// Currently leaving it as root.
			base: ''
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for static assets during prerendering
				// since they are handled natively by the server, not SvelteKit routes
				if (path.startsWith('/assets/')) {
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;