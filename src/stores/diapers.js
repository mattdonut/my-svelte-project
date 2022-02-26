import { writable } from 'svelte/store';

function createTrack() {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,
        add: (item) => update(list => [...list, item]),
		reset: () => set([])
	};
}

export const diaperTracker = createTrack();