<script>
  import { onMount } from "svelte";
  import { getData, getDataUrls } from "$lib/dataHandler";
  import AddProductBtn from "$lib/components/product/addProductBtn.svelte";
  import IndividualProductBtn from "$lib/components/product/individualProductBtn.svelte";
  import ProductFilter from "$lib/components/filter/ProductsFilter.svelte";
  import { page } from "$app/stores"; // SvelteKit's `page` store
  import { goto } from "$app/navigation";
  import ProductOverviewCard from "$lib/components/product/productOverviewCard.svelte";

  let products = [];
  let isLoading = true;
  let error = null;
  let searchQuery = ""; // This will hold the search query

  // Dropdown states for filters
  let dropdownStates = {
    Categorieën: false,
    Allergieën: false,
  };

  // Dropdown content for categories and allergies
  let dropdownContent = {
    Categorieën: [],
    Allergieën: [],
  };

  let selectedFilters = {
    Categorieën: [],
    Allergieën: [],
  };

  // Extract the search query from the URL
  $: searchQuery = $page.url.searchParams.get("search") || "";

  // Load product data when the component is mounted
  onMount(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      searchQuery = urlParams.get("search") || ""; // Haal de zoekquery uit de URL
      
      // Fetch product data
      const productUrls = await getData("http://localhost:3010/products");
      const productDetails = await getDataUrls(productUrls);
      products = productDetails.filter(
        (product) =>
          !product.reserved && // Toon alleen producten die niet gereserveerd zijn
          product.title.toLowerCase().includes(searchQuery.toLowerCase()), // Zoek naar producten die de zoekterm bevatten
      );

      // Fetch categories and allergies for dropdowns
      const categoriesResponse = await fetch(
        "http://localhost:3010/categories/consumables",
      );
      const allergiesResponse = await fetch(
        "http://localhost:3010/categories/allergies",
      );

      const categories = await categoriesResponse.json();
      const allergies = await allergiesResponse.json();

      // Populate the dropdowns with category and allergy data
      dropdownContent.Categorieën = categories.map((category) => ({
        id: category.id, // Ensure each category has an id field
        name: category.name,
      }));

      dropdownContent.Allergieën = allergies.map((allergy) => ({
        id: allergy.id,
        name: allergy.name,
      }));

      isLoading = false;
    } catch (err) {
      error = "Failed to load data";
      isLoading = false;
    }
  });

  function getFilteredProducts() {
    return products.filter((product) => {
      // Match search query
      const matchesQuery =
        !searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Match categories (consumables)
      const matchesCategories =
        selectedFilters.Categorieën.length === 0 ||
        selectedFilters.Categorieën.every((selectedCategoryId) =>
          product.consumables.includes(selectedCategoryId),
        );

      // Match allergies
      const matchesAllergies =
        selectedFilters.Allergieën.length === 0 ||
        selectedFilters.Allergieën.every((selectedAllergyId) =>
          product.allergies.includes(selectedAllergyId),
        );

      // Return true only if all criteria are matched
      return matchesQuery && matchesCategories && matchesAllergies;
    });
  }

  function toggleDropdown(key) {
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

  function selectFilter(key, item) {
    const selectedId = item.id; // Use the ID for both categories and allergies
    if (selectedFilters[key].includes(selectedId)) {
      selectedFilters[key] = selectedFilters[key].filter(
        (filter) => filter !== selectedId,
      );
    } else {
      selectedFilters[key] = [...selectedFilters[key], selectedId];
    }
  }

  // Attach event listener to document
  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    fetchData();
    return () => document.removeEventListener("click", handleClickOutside);

  });

  // Functie om details van een product te bekijken (kan later worden gekoppeld aan navigatie)
  const viewProductDetails = (productId) => {
    goto(`/products/${productId}`);
  };
</script>

<div class="container mx-auto p-4">
  <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
    <h1 class="text-2xl font-bold text-green-600 mb-4 sm:mb-0">Producten</h1>
    <AddProductBtn />
  </div>

  <!-- Search Bar -->
  <div class="flex items-center max-w-[50%] md:max-w-[30%] mx-auto mt-8">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Zoeken..."
      class="border-2 border-gray-400 px-4 py-2 rounded-l w-full focus:border-gray-400 focus:outline-none outline-none border-2 border-r-0"
    />
    <button
      on:click={() => {}}
      class="px-4 py-2 bg-zinc-200 text-black rounded-r border-2 border-gray-400"
    >
      Zoeken
    </button>
  </div>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:max-w-[60%] max-w-[90%] mt-12 mb-4 mx-auto justify-items-center"
  >
    {#each Object.keys(dropdownStates) as key (key)}
      <div class="flex flex-col items-center relative w-full max-w-[200px]">
        <div class="dropdown w-full">
          <button
            class="flex items-center justify-between px-4 py-2 border-2 border-gray-400 bg-zinc-100 rounded-lg shadow-sm w-full hover:bg-zinc-200 transition duration-300 max-w-[250px]"
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
                    selectedFilters[key].includes(item.id)
                      ? "bg-[#69A571] text-white"
                      : "text-gray-700 hover:bg-gray-200"
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

  <!-- Producten -->
   <!-- Producten -->
   {#if isLoading}
   <p class="text-center text-gray-600">Producten worden geladen...</p>
 {:else if error}
   <p class="text-center text-red-600">{error}</p>
 {:else if getFilteredProducts().length > 0}
   <div
     class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
   >
     {#each getFilteredProducts() as product (product.id)}
       <ProductOverviewCard {product} onViewDetails={viewProductDetails} />
     {/each}
   </div>
 {:else}
   <p class="text-center text-gray-600">Geen producten gevonden...</p>
 {/if}
</div>

