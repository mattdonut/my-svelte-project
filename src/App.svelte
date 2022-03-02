<script>
  import { setContext } from "svelte";

  import {
    createTimerStoreWithSummary,
    timerContextKey,
    timerSumContextKey,
  } from "./stores/timers";

  import Sleep from "./Sleep.svelte";

  export let name = "World";

  // We create the timer tracks in the main app component, so that they will be available for
  // the whole app. We put this here instead of in the store file because we want flexibilty in how
  // we initialize and configure stores.
  let [timerTrack, timerSummary] = createTimerStoreWithSummary([
    /* We could load initial data and put it here */
  ]);

  // The context api allows us to access this data from any decendant component without needing to drill
  // props all the way down. This is effectively 'App global'
  // The motivation here is that we might want to do something like a summary dashboard, which would need
  // access to this data.
  setContext(timerContextKey, timerTrack);
  setContext(timerSumContextKey, timerSummary);

  // some simple app state for primative tabs
  let currentTab = "naps";
</script>

<main>
  <h1>Hello {name}!</h1>
  <div class="tabs">
    <span on:click={() => (currentTab = "diapers")}>Diapers</span>
    <span on:click={() => (currentTab = "feeds")}>Feeds</span>
    <span on:click={() => (currentTab = "naps")}>Naps</span>
  </div>
  <div class="view">
    {#if currentTab === "diapers"}
      <div>Diaper View</div>
    {/if}
    {#if currentTab === "feeds"}
      <div>Feed View</div>
    {/if}
    {#if currentTab === "naps"}
      <Sleep />
    {/if}
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  .tabs {
    width: 100%;
  }

  .view {
    width: 100%;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
