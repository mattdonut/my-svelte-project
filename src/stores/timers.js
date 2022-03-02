/*
    The timers store is an append only store of timer records.

    There are two types of records that can be represented, START and STOP. Each of these carries a timestamp for when it occurred.
    When a START record is created, it is assigned a key which should be used to create a corresponding STOP record.
    This allows for multiple overlapping timers to be represented.

    This file also contains a derived store that produces a summary map of the records. This is
    done by merging the record object with matching keys, and placing them into a Map.

    Note that these are factory methods, and no actual store instance is created.
*/

import { writable } from 'svelte/store';
import { deriveMergeSummary } from './mergeSum';

// These are unique keys for finding the timer store in a component context.
// Since the timer track has the ability to run multiple timers concurrently,
// we feel pretty ok with only supplying one key. If you do find a need to have
// multiple timer tracks in one context, you'll have to create your own keys.
export const timerContextKey = Symbol('Timer context key');
export const timerSumContextKey = Symbol('Timer Summary context key');

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

export function createTimerStore(init = []) {
    // Start with the stock writable from svelte
	const { subscribe, set, update } = writable(init);

    // create the action interface, much like a reducer.
    // In this case, we have three additional methods, and we
    // hide the general 'update' and 'set' methods.
    // 'subscribe' must be forwarded for this to work as a store.
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

// a factory for getting a store track and a summary at the same time
export function createTimerStoreWithSummary(init = []) {
    const track = createTimerStore(init);
    const sum = deriveMergeSummary(track);
    return [track, sum];
}