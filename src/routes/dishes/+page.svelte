<script>
  // @ts-nocheck

  import { onMount } from "svelte";

  export let dishes = ["Spaghetti", "Sushi", "Tacos"];

  // State for each dropdown
  let dropdownStates = {
    Categorieën: false,
    Allergieën: false,
    Seizoen: false,
    VindIkLeuks: false,
  };

  // Define dropdown content for each key
  const dropdownContent = {
    Categorieën: [],
    Allergieën: [],
    Seizoen: [],
    VindIkLeuks: [],
  };

  let query = ""; // Holds the search input value
  let selectedFilters = {
    Categorieën: [],
    Allergieën: [],
    Seizoen: [],
  };

  let recipes = [];
  let filteredRecipes = [];
  let error = null;

  async function fetchData() {
    try {
      const recipesResponse = await fetch("http://localhost:3010/recipes/");
      if (!recipesResponse.ok) throw new Error("Failed to fetch data");
      recipes = await recipesResponse.json();
      filteredRecipes = recipes; // Initially show all recipes

      // Log the categories of each recipe
      recipes.forEach((recipe) => {
        console.log(`Recipe: ${recipe.name}, Category:`, recipe.category);
      });
    } catch (err) {
      error = err.message;
    }

    // Fetch the dropdown options (categories, allergies, season)
    try {
      const recipesResponse = await fetch("http://localhost:3010/recipes/");
      if (!recipesResponse.ok) throw new Error("Failed to fetch recipes");

      const recipes = await recipesResponse.json();

      // Check if `category` exists and process it
      const allCategories = recipes
        .flatMap((recipe) => recipe.category || [])
        .reduce((unique, category) => {
          if (!unique.some((item) => item.id === category.id)) {
            unique.push(category);
          }
          return unique;
        }, []);

      // Remove duplicates for Allergies using allergy ID
      const allAllergies = recipes
        .flatMap((recipe) => recipe.allergyID || []) // Use allergyID instead of allergens
        .reduce((unique, allergyID) => {
          if (!unique.some((allergy) => allergy.id === allergyID.id)) {
            unique.push(allergyID);
          }
          return unique;
        }, []); // Remove duplicates

      // Remove duplicates for Seasons using season id
      const allSeasons = recipes
        .flatMap((recipe) => recipe.season || [])
        .reduce((unique, season) => {
          if (!unique.some((uniqueSeason) => uniqueSeason.id === season.id)) {
            unique.push(season);
          }
          return unique;
        }, []); // Remove duplicates

      console.log("Unique Categories:", allCategories);
      console.log("Unique Allergies:", allAllergies);
      console.log("Unique Seasons:", allSeasons);

      // Assign the categories, allergies, and seasons to dropdownContent
      dropdownContent.Categorieën = allCategories.map((category) => ({
        id: category.id,
        name: category.name,
      }));

      // Assign unique allergies and seasons
      dropdownContent.Allergieën = allAllergies; // All unique allergies
      dropdownContent.Seizoen = allSeasons; // All unique seasons
    } catch (err) {
      console.error("Error fetching recipes and categories:", err.message);
    }
  }

  // Handle selecting an option in a dropdown
  function selectFilter(key, item) {
    if (key === "Categorieën") {
      // Handle category selection by storing category ID
      const selectedCategoryId = item.id;
      if (selectedFilters[key].includes(selectedCategoryId)) {
        selectedFilters[key] = selectedFilters[key].filter(
          (filter) => filter !== selectedCategoryId,
        ); // Remove the category ID from selected filters
      } else {
        selectedFilters[key].push(selectedCategoryId); // Add category ID to selected filters
      }
    } else if (key === "Allergieën") {
      // Handle allergy selection
      if (selectedFilters[key].includes(item.id)) {
        selectedFilters[key] = selectedFilters[key].filter(
          (filter) => filter !== item.id,
        ); // Remove allergy from selected filters
      } else {
        selectedFilters[key].push(item.id); // Add allergy to selected filters
      }
    } else if (key === "Seizoen") {
      // Handle season selection
      if (selectedFilters[key].includes(item.id)) {
        selectedFilters[key] = selectedFilters[key].filter(
          (filter) => filter !== item.id,
        ); // Remove season from selected filters
      } else {
        selectedFilters[key].push(item.id); // Add season to selected filters
      }
    }

    // After selecting or unselecting a filter, update the filtered recipes
    filterRecipes();
  }

  function filterRecipes() {
    console.log("Filtering recipes with selected filters:", selectedFilters); // Log selected filters

    filteredRecipes = recipes.filter((recipe) => {
      const matchesQuery =
        !query ||
        recipe.name.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(query.toLowerCase());

      const matchesCategories =
        selectedFilters.Categorieën.length === 0 ||
        selectedFilters.Categorieën.every((selectedCategoryId) =>
          recipe.category.some(
            (category) => category.id === selectedCategoryId,
          ),
        );

      const matchesFilters =
        matchesCategories &&
        (selectedFilters.Allergieën.length === 0 ||
          selectedFilters.Allergieën.every((selectedAllergyId) =>
            recipe.allergyID?.some(
              (allergy) => allergy.id === selectedAllergyId,
            ),
          )) &&
        (selectedFilters.Seizoen.length === 0 ||
          selectedFilters.Seizoen.every((selectedSeasonId) =>
            recipe.season?.some((season) => season.id === selectedSeasonId),
          ));

      console.log(
        `Recipe: ${recipe.name}, Category Match: ${matchesCategories}`,
      ); // Log category match
      return matchesQuery && matchesFilters;
    });
  }

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

  function isItemSelected(key, item) {
    return selectedFilters[key]?.includes(item.id);
  }

  // Attach event listener to document
  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    fetchData();
    return () => document.removeEventListener("click", handleClickOutside);
  });
</script>

<div class="flex flex-col items-center justify-center text-center mt-12">
  <p class="text-gray-500 text-lg">Zoek de lekkerste recepten</p>
  <h1 class="text-4xl md:text-6xl font-bold">
    <span class="text-black">Recepten</span><span class="text-[#69A571]">.</span
    >
  </h1>
</div>

<!-- Search Bar -->
<div class="flex items-center max-w-[50%] md:max-w-[30%] mx-auto mt-8">
  <input
    type="text"
    bind:value={query}
    placeholder="Zoeken..."
    class="border-2 border-gray-400 px-4 py-2 rounded-l w-full focus:border-gray-400 focus:outline-none outline-none border-2 border-r-0"
    on:input={filterRecipes}
  />
  <button
    on:click={filterRecipes}
    class="px-4 py-2 bg-zinc-200 text-black rounded-r border-2 border-gray-400"
  >
    Zoeken
  </button>
</div>

<!-- Dropdown Menus -->

<div
  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:max-w-[60%] max-w-[90%] mt-12 mx-auto"
>
  {#each Object.keys(dropdownStates) as key (key)}
    <div class="flex flex-col items-center relative">
      <div class="dropdown w-full">
        <button
          class="flex items-center justify-between px-4 py-2 border-2 border-gray-400 bg-zinc-100 rounded-lg shadow-sm w-full hover:bg-zinc-200 transition duration-300"
          on:click={() => toggleDropdown(key)}
        >
          {key}
          <span class="ml-2">▼</span>
        </button>
        {#if dropdownStates[key]}
          <ul
            class="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-full z-10"
          >
            {#each dropdownContent[key] as item (item.id)}
              <li
                class={`px-4 py-2 cursor-pointer ${
                  isItemSelected(key, item)
                    ? "bg-[#69A571] text-white" // Highlight selected items
                    : "text-gray-700 hover:bg-gray-200" // Default styling
                } transition duration-300`}
                on:click={() => selectFilter(key, item)}
              >
                {item.name}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/each}
</div>

<!-- Recipes Section -->
<div
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mx-auto justify-center max-w-[90%] mt-20"
>
  {#if error}
    <p class="text-red-600">{error}</p>
  {:else if filteredRecipes.length === 0}
    <p>No recipes found.</p>
  {:else}
    {#each filteredRecipes as recipe}
      <a
        href={`/dishes/${recipe.id}`}
        class="btn px-4 py-2 rounded min-w-[8vw] text-center text-white"
      >
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <img
            src={recipe.image_url}
            alt={recipe.name}
            class="h-60 w-full object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800">{recipe.name}</h3>
          </div>
        </div>
      </a>
    {/each}
  {/if}
</div>
