<script>
// @ts-nocheck

    import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import ProductFilter from '$lib/components/filter/ProductsFilter.svelte';

  let products = [];
  let isLoading = true;
  let error = null;

  onMount(async () => {
    try {
      // Laad de URLs van alle producten
      const response = await fetch('http://localhost:3010/products');
      if (!response.ok) {
        throw new Error('Gefaald om product URLs te laden');
      }

      const productUrls = await response.json();

      // Laad de product details van alle producten
      const productDetails = await Promise.all(
        productUrls.map(async (url) => {
          const productResponse = await fetch(`http://localhost:3010/${url}`);
          if (!productResponse.ok) {
            throw new Error(`Gefaald om producten te laden van: ${url}`);
          }
          return await productResponse.json();
        })
      );

      products = productDetails;
    } catch (err) {
      console.error('Error bij het laden van producten:', err);
      error = 'Producten konden niet worden geladen. Probeer het later opnieuw.';
    } finally {
      isLoading = false;
    }
  });

  function navigateToAddProduct() {
    goto('products/add-product');
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold text-green-600">
      Producten
    </h1>

    <button
      class="text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
      style="background-color: rgb(100, 173, 108);"
      on:click={navigateToAddProduct}
    >
      + Product toevoegen
    </button>
  </div>

  {#if isLoading}
    <p class="text-center text-gray-600 mt-8">Producten worden geladen...</p>
  {:else if error}
    <p class="text-center text-red-600">{error}</p>
  {:else}
    <div class="container mx-auto p-4">
      <!-- Producten worden via de Filter component gefilterd en weergegeven! -->
      <ProductFilter {products} />
    </div>
  {/if}
</div>
