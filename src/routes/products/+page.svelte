<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getData, getDataUrls } from "$lib/dataHandler";
  import AddProductBtn from "$lib/components/product/addProductBtn.svelte";
  import ProductOverviewCard from "$lib/components/product/productOverviewCard.svelte";

  let products = [];
  let isLoading = true;
  let error = null;
  let searchQuery = ""; // Dit wordt de zoekquery die we uit de URL halen

  onMount(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      searchQuery = urlParams.get("search") || ""; // Haal de zoekquery uit de URL

      const productUrls = await getData("http://localhost:3010/products");

      // Laad de productdetails van alle producten
      const productDetails = await getDataUrls(productUrls);

      // Filter producten op basis van de zoekquery
      products = productDetails.filter(
        (product) =>
          !product.reserved && // Toon alleen producten die niet gereserveerd zijn
          product.title.toLowerCase().includes(searchQuery.toLowerCase()), // Zoek naar producten die de zoekterm bevatten
      );

      isLoading = false;
    } catch (err) {
      error = "Er is een fout opgetreden bij het laden van de producten.";
      isLoading = false;
    }
  });

  // Functie om details van een product te bekijken (kan later worden gekoppeld aan navigatie)
  const viewProductDetails = (productId) => {
    goto(`/products/${productId}`);
  };
</script>

<div class="container mx-auto p-4">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
    <h1 class="text-2xl font-bold text-green-600 mb-4 sm:mb-0">Producten</h1>
    <AddProductBtn />
  </div>

  <!-- Producten -->
  {#if isLoading}
    <p class="text-center text-gray-600">Producten worden geladen...</p>
  {:else if error}
    <p class="text-center text-red-600">{error}</p>
  {:else if products.length > 0}
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {#each products as product (product.id)}
        <ProductOverviewCard {product} onViewDetails={viewProductDetails} />
      {/each}
    </div>
  {:else}
    <p class="text-center text-gray-600">Geen producten gevonden...</p>
  {/if}
</div>
