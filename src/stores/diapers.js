/*
    The diapers store is an append only store of diaper records.

    Diaper changes are treated as instantaneous and are simply logged as a single event.
    A diaper change can have poop, pee, and a chance to pee on the adults.
*/

import { createTimelineStore } from './timeline';

// a factory for getting a store track and a summary at the same time
export function createDiaperStore(init = []) {
    const store = createTimelineStore(init);
    return {
        ...store,
        add: (poo, pee, gotcha) => store.add({poo, pee, gotcha}),
    }
}