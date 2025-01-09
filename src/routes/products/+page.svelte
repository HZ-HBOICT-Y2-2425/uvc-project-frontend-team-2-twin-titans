<script>
  import { onMount } from "svelte";
  import { getData, getDataUrls } from "$lib/dataHandler";
  import AddProductBtn from "$lib/components/product/addProductBtn.svelte";
  import IndividualProductBtn from "$lib/components/product/individualProductBtn.svelte";
  import { page } from "$app/stores"; // SvelteKit's `page` store

  let products = [];
  let isLoading = true;
  let error = null;
  let searchQuery = ""; // This will hold the search query

  // Extract the search query from the URL
  $: searchQuery = $page.url.searchParams.get("search") || "";

  // Load product data when the component is mounted
  onMount(async () => {
    try {
      const productUrls = await getData("http://localhost:3010/products");

      // Load the product details for all products
      const productDetails = await getDataUrls(productUrls);

      // Store the products globally to be filtered later
      products = productDetails.filter(
        (product) => !product.reserved, // Only show products that are not reserved
      );

      isLoading = false;
    } catch (err) {
      error = "Failed to load products";
      isLoading = false;
    }
  });

  // Function to filter products based on the search query
  function getFilteredProducts() {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold text-green-600">Producten</h1>
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

  {#if isLoading}
    <p class="text-center text-gray-600">Producten worden geladen...</p>
  {:else if error}
    <p class="text-center text-red-600">{error}</p>
  {:else if getFilteredProducts().length > 0}
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {#each getFilteredProducts() as product (product.id)}
        <IndividualProductBtn {product} />
      {/each}
    </div>
  {:else}
    <p class="text-center text-gray-600">Geen producten gevonden...</p>
  {/if}
</div>
