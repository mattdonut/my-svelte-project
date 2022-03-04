/*
    The timers store is an append only store of timer records.

    There are two types of records that can be represented, START and STOP. Each of these carries a timestamp for when it occurred.
    When a START record is created, it is assigned a key which should be used to create a corresponding STOP record.
    This allows for multiple overlapping timers to be represented.

    This file also contains a derived store that produces a summary map of the records. This is
    done by merging the record object with matching keys, and placing them into a Map.

    Note that these are factory methods, and no actual store instance is created.
*/

import { writable, derived } from 'svelte/store';

// Very primative key gen
let nextKey = 0;
// The records all also have a unique id
let nextId = 0;

function createEvent(data, key, timestamp) {
    return {
        data,
        id: nextId++,
        key: key || `groupKey::${nextKey++}`,
        timestamp: timestamp || Date.now(),
    }
}

function createSummaryEntry(trackEvent) {
    return {
        key: trackEvent.key,
        start: trackEvent.timestamp,
        duration: 0,
        data: trackEvent.data,
        events: [trackEvent],
    }
}

function addEventToSummary(summ, trackEvent) {
    return {
        ...summ,
        end: Math.max(summ.end, trackEvent.timestamp),
        duration: Math.max(summ.duration, trackEvent.timestamp - summ.start),
        data: {...summ.data, ...trackEvent.data},
        events: [...summ.events, trackEvent],
    }
}

export function createTimelineStore(init = []) {
    // Start with the stock writable from svelte
	const { subscribe, set, update } = writable(init);

    // create the action interface, much like a reducer.
    // In this case, we have three additional methods, and we
    // hide the general 'update' and 'set' methods.
    // 'subscribe' must be forwarded for this to work as a store.
	const tracker = {
		subscribe,
        add: (data, key, timestamp) => {
            const newEntry = createEvent(data, key, timestamp);
            update(list => [...list, newEntry]);
            return newEntry;
        },
		reset: () => set([])
	};

    const summary = derived(tracker, $track => $track.reduce((acc, curr) => {
        // We reduce over the track, placing items into the Map by key, merging when an item
        // has a previously used key.
        return acc.has(curr.key) ? acc.set(curr.key, addEventToSummary(acc.get(curr.key), curr)) : acc.set(curr.key, createSummaryEntry(curr))
    }, new Map()))

    return {
        ...tracker,
        tracker,
        ...summary,
    }
}
