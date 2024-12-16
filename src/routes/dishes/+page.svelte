<script>
  import { onMount } from "svelte";

  export let dishes = ["Spaghetti", "Sushi", "Tacos"];

  // State for each dropdown
  let dropdownStates = {
    Groentes: false,
    Allergieën: false,
    Seizoen: false,
    VindIkLeuks: false,
  };

  // Define dropdown content for each key
  const dropdownContent = {
    vegetables: ["Carrot", "Broccoli", "Spinach"],
    allergies: ["Peanuts", "Shellfish", "Dairy"],
    season: ["Apple", "Banana", "Cherry"],
    likes: ["Water", "Juice", "Soda"],
  };

  let query = ""; // Holds the search input value

  function handleSearch() {
    console.log("Search query:", query);
    // Perform search logic here
  }

  let recipes = [];
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:3010/recipes/");
      if (!response.ok) throw new Error("Failed to fetch data");
      recipes = await response.json();
    } catch (err) {
      error = err.message;
    }
  });

  // Function to toggle a specific dropdown
  function toggleDropdown(key) {
    // Toggle the clicked dropdown while closing others
    for (const dropdown in dropdownStates) {
      if (dropdown !== key) {
        dropdownStates[dropdown] = false; // Close other dropdowns
      }
    }
    dropdownStates[key] = !dropdownStates[key]; // Toggle the clicked dropdown
  }

  // Close all dropdowns when clicking outside
  function handleClickOutside(event) {
    if (!event.target.closest(".dropdown")) {
      for (const key in dropdownStates) {
        dropdownStates[key] = false; // Close all dropdowns
      }
    }
  }

  // Attach event listener to document
  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });
</script>

<h1 class="text-8xl text-green-600 text-center">Recepten</h1>

<!-- Search Bar -->
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

<!-- Dropdown Menus -->
<div class="grid grid-cols-2 mx-auto justify-center gap-6 max-w-[42%] mt-20">
  {#each Object.keys(dropdownStates) as key (key)}
    <div class="flex items-center justify-center text-center relative">
      <div class="dropdown">
        <!-- Dropdown Toggle Button -->
        <button
          class="btn px-4 py-2 border-2 border-black bg-zinc-200 rounded min-w-[8vw]"
          on:click={() => toggleDropdown(key)}
        >
          {key}
        </button>

        <!-- Dropdown Menu -->
        {#if dropdownStates[key]}
          <ul
            class="absolute bg-white border border-gray-300 rounded shadow-lg mt-2 w-52 z-10"
          >
            {#each dropdownContent[key] as item}
              <li class="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                {item}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/each}
</div>

<!-- Recipes Section -->
<div class="grid grid-cols-2 gap-4 mx-auto justify-center max-w-[50%] mt-20">
  {#if error}
    <p class="text-red-600">{error}</p>
  {:else if recipes.length === 0}
    <p>Loading recipes...</p>
  {:else}
    {#each recipes as recipe}
      <a
        href={`/dishes/${recipe.id}`}
        class="btn px-4 py-2 border-2 border-black bg-green-500 rounded min-w-[8vw] text-center text-white"
      >
        {recipe.name}
      </a>
    {/each}
  {/if}
</div>
