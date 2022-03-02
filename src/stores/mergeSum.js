import { derived } from 'svelte/store';

export function deriveMergeSummary(tracker) {
    return derived(tracker, $track => $track.reduce((acc, curr) => {
        // We reduce over the track, placing items into the Map by key, merging when an item
        // has a previously used key. This combines the START and STOP records that match.
        return acc.set(curr.key, acc.has(curr.key) ? {...acc.get(curr.key), ...curr} : curr)
    }, new Map()))
}
