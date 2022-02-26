/*
    The sleeps store is an append only store of timer records.

    There are two types of records that can be represented, START and STOP. Each of these carries a timestamp for when it occurred.
    When a START record is created, it is assigned a key which should be used to create a corresponding STOP record.
    This allows for multiple overlapping timers to be represented.

    This file also contains a derived store that produces a summary map of the records. This is
    done by merging the record object with matching keys, and placing them into a Map.
*/

import { writable, derived } from 'svelte/store';

export const STATES = {
    START: 'start',
    STOP: 'stop',
}

// Very primative key gen
let nextKey = 0;
// The records all also have a unique id
let nextId = 0;

function createStart(start) {
    return {
        id: nextId++,
        key: nextKey++,
        state: STATES.START,
        start,
    }
}

function createStop(stop, key) {
    return {
        id: nextId++,
        key,
        state: STATES.STOP,
        stop,
    }
}

function createTrack() {
    // Start with the stock writable from svelte
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,
        start: () => {
            const newEntry = createStart(Date.now());
            update(list => [...list, newEntry]);
            return newEntry.key;
        },
        stop: (key) => update(list => [...list, createStop(Date.now(), key)]),
		reset: () => set([])
	};
}

export const sleepTracker = createTrack();

export const sleepSummary = derived(sleepTracker, $track => $track.reduce((acc, curr) => {
    // We reduce over the track, placing items into the Map by key, merging when an item
    // has a previously used key. This combines the START and STOP records that match.
    return acc.set(curr.key, acc.has(curr.key) ? {...acc.get(curr.key), ...curr} : curr)
}, new Map()))