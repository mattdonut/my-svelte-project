/*
    The timers store is an append only store of timer records.

    There are two types of records that can be represented, START and STOP. Each of these carries a timestamp for when it occurred.
    When a START record is created, it is assigned a key which should be used to create a corresponding STOP record.
    This allows for multiple overlapping timers to be represented.

    This file also contains a derived store that produces a summary map of the records. This is
    done by merging the record object with matching keys, and placing them into a Map.

    Note that these are factory methods, and no actual store instance is created.
*/

import { createTimelineStore } from './timeline';

export const STATES = {
    START: 'start',
    STOP: 'stop',
}

// a factory for getting a store track and a summary at the same time
export function createTimerStore(init = []) {
    const store = createTimelineStore(init);
    return {
        ...store,
        start: () => store.add({state: STATES.START}).key,
        stop: (key) => store.add({state: STATES.STOP}, key),
    }
}

// helper to make a pretty output string
export function formatTimerString(duration) {
    let hours = Math.floor(duration / 3600000);
    let minutes = Math.floor((duration - hours * 3600000) / 60000);
    let seconds = Math.floor(
      (duration - hours * 3600000 - minutes * 60000) / 1000
    );
    let hundos = Math.floor(duration / 10) % 100;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${hundos
      .toString()
      .padStart(2, "0")}`;
  }