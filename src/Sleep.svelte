<script>
  import { onDestroy } from "svelte";

  import { sleepSummary, sleepTracker, STATES } from "./stores/sleeps";

  function formatTimer(duration) {
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

  // Reactive variables
  let activeKey;
  let runningTime = 0; // A cheat, this is both falsy and a number, so the derived values will still compute
  let history = [];
  let current;

  // The id of the active setInterval, for clearing
  let interval;

  // Subscribe to the sleepSummary
  const unsubSum = sleepSummary.subscribe((summary) => {
    // Extract the values of the summary Map
    const sumArray = [...summary].map(([, val]) => val);
    // If the state is STOP, that is a completed timer
    history = sumArray.filter((entry) => entry.state === STATES.STOP);
    // If state is START, the timer is still running
    current = sumArray.find((entry) => entry.state === STATES.START);

    //If we have a currently running timer, set up an interval to update the UI
    if (current) {
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

<h2>Sleeps</h2>
{#if current}
  <button on:click={() => sleepTracker.stop(activeKey)}>Stop</button>
{:else}
  <button
    on:click={() => {
      activeKey = sleepTracker.start();
    }}>Start</button
  >
{/if}
<!-- This is the timer display, only shows if the running time is not falsy (non-zero in this case) -->
{#if runningTime}
  <span>{formatTimer(runningTime)}</span>
{/if}

{#each history.reverse() as entry (entry.key)}
  <div>
    {(entry.stop - entry.start) / 1000}s
  </div>
{/each}
