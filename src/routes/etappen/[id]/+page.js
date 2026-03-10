import tourData from '$lib/data/tour.json';

export function entries() {
	return tourData.tourPlan.stages.map(stage => ({ id: stage.id.toString() }));
}

export function load({ params }) {
	const stage = tourData.tourPlan.stages.find(s => s.id.toString() === params.id);

	if (!stage) {
		throw new Error(`Stage ${params.id} not found`);
	}

	// Fetch accommodation if accommodationId is provided
	let accommodation = null;
	if (stage.accommodationId && tourData.accommodations && tourData.accommodations.list) {
		accommodation = tourData.accommodations.list.find(a => a.id === stage.accommodationId);
	}

	return {
		stage: {
			...stage,
			accommodation
		}
	};
}