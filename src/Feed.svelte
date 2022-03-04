<script>
  import { onDestroy, getContext } from "svelte";
  import { feedContextKey } from "./contexts";
  import { STATES, SOURCES, formatTimerString } from "./stores/feeds";

  const feedTracker = getContext(feedContextKey);

  // Reactive variables
  let activeKey;
  let runningTime = 0; // A cheat, this is both falsy and a number, so the derived values will still compute
  let history = [];
  let current;

  let source = SOURCES.LEFT;

  // The id of the active setInterval, for clearing
  let interval;

  // Subscribe to the feedTracker
  const unsubSum = feedTracker.subscribe((summary) => {
    console.log("Feed state:", summary);
    // Extract the values of the summary Map
    const sumArray = [...summary].map(([, val]) => val);
    // If the state is STOP, that is a completed timer
    history = sumArray.filter((entry) => entry.data.state === STATES.STOP);
    // If state is START, the timer is still running
    current = sumArray.find((entry) => entry.data.state === STATES.START);
    //If we have a currently running timer, set up an interval to update the UI
    if (current) {
      activeKey = current.key;
      // Save the interval ID to clear
      interval = setInterval(() => {
        // This is async, so be sure to check that current still exists
        if (current) {
          // Reactive assignment, this will cause the component to update
          runningTime = Date.now() - current.start;
        }
      }, 33);
    } else {
      // If there is no currently open timer, clear the runningTime
      runningTime = 0;
      clearInterval(interval);
    }
  });

  // When this component is destroyed, unsubscribe to the summary, and be sure to clear the setInterval
  onDestroy(unsubSum);
  onDestroy(() => clearInterval(interval));
</script>

<h2>Feeds</h2>
<input type="radio" bind:group={source} name="Left" value={SOURCES.LEFT} />
<input type="radio" bind:group={source} name="Right" value={SOURCES.RIGHT} />
<input type="radio" bind:group={source} name="Bottle" value={SOURCES.BOTTLE} />
{#if current}
  <button on:click={() => feedTracker.stop(activeKey)}>Stop</button>
{:else}
  <button
    on:click={() => {
      activeKey = feedTracker.start(source);
    }}>Start</button
  >
{/if}
<!-- This is the timer display, only shows if the running time is not falsy (non-zero in this case) -->
{#if runningTime}
  <span>{formatTimerString(runningTime)}</span>
{/if}

{#each history.reverse() as entry (entry.key)}
  <div>
    {formatTimerString(entry.duration)}
    {entry.data.source}
  </div>
{/each}
