<script>
  import Sleep from "./Sleep.svelte";
  let currentTab = "naps";
</script>

<main>
  <h1>Hello Kiva!</h1>
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
