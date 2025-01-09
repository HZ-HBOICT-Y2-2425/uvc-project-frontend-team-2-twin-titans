<script>
  export let query = ""; // Search query
  export let onSearch = () => {}; // Callback function when search is triggered

  function handleSearch() {
    onSearch(query); // Trigger the parent function with the search query
  }
</script>

<div class="flex items-center max-w-[30%] mx-auto mt-10">
  <input
    type="text"
    bind:value={query}
    placeholder="Zoeken..."
    class="border border-black px-4 py-2 rounded-l w-full focus:border-black focus:outline-none outline-none border-2 border-r-0"
  />
  <button
    on:click={handleSearch}
    class="px-4 py-2 bg-zinc-200 text-black rounded-r border-2 border-black"
  >
    Zoeken
  </button>
</div>
