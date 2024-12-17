<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user } from '$lib/store';
  import '../app.css';
  import CO2Output from '$lib/components/co2/CO2Output.svelte';

  let categories = [];
  let displayedCategories = [];
  let showMore = false; // Default to false, showing only 4 categories
  let products = [];
  let error = null;

  $: userID = $user?.id || 1; // Fallback to dummy userID if not available

  onMount(async () => {
    try {
      const [categoriesResponse, userResponse] = await Promise.all([
        fetch('http://localhost:3010/categories/consumables/'),
        fetch(`http://localhost:3013/user/${userID}`)
      ]);

      if (!categoriesResponse.ok || !userResponse.ok) {
        throw new Error('Failed to load data');
      }

      categories = await categoriesResponse.json();
      products = await userResponse.json();

      // Initialize displayedCategories based on showMore
      displayedCategories = showMore ? categories : categories.slice(0, 4);
    } catch (err) {
      console.error('Error loading data:', err);
      error = 'Failed to load data. Please try again later.';
    }
  });

  function updateDisplayedCategories() {
    displayedCategories = showMore ? categories : categories.slice(0, 4);
  }

  function toggleCategories() {
    showMore = !showMore;
    displayedCategories = showMore ? categories : categories.slice(0, 4);
  }

  function viewProductDetails(productId) {
    goto(`/products/${productId}`);
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col space-y-12">
  <!-- Header Section -->
  <section class="flex flex-col items-center justify-center text-center py-16 bg-white">
    <p class="text-gray-500 text-lg">Fuse your Finds, with Hungry Minds</p>
    <h1 class="text-4xl md:text-6xl font-bold">
      <span class="text-black">Jouw</span>
      <span class="text-[#69A571]">overblijvers</span>
    </h1>
    <div class="relative mt-8 w-full max-w-md">
      <input
        type="text"
        placeholder="Zoek naar producten..."
        class="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#69A571]"
      />
    </div>
  </section>
  
  <!-- Bespaarde CO2 Uitstoot -->
  <CO2Output />

  <!-- Categorieën Section -->
  <section class="px-4 md:px-16">
    <h2 class="text-3xl font-bold text-left mb-6">Categorieën</h2>
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each displayedCategories as category (category.id)}
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
          on:click={() => goto(`/products/${category.id}`)}
          on:keydown={(e) => e.key === 'Enter' && goto(`/products/${category.id}`)}
          role="button"
          tabindex="0"
        >
          <img
            src="/images/{category.name}.png"
            alt={category.name}
            class="h-60 w-full object-cover hover:opacity-90 transition-opacity duration-300"
          />
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800 mb-2">{category.name}</h3>
            <p class="text-gray-600 text-sm">{category.description || ''}</p>
            <a
              href={`/products/${category.id}`}
              class="mt-2 inline-block text-[#69A571] hover:underline"
            >
              Bekijk {category.name}
            </a>
          </div>
        </div>
      {/each}
    </div>

    {#if categories.length > 4}
      <div class="mt-6 flex justify-center">
        <button
          class="bg-[#63AD6C] text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105 hover:shadow-md duration-300"
          on:click={toggleCategories}
        >
          {showMore ? 'Laat minder categorieën zien' : 'Meer categorieën weergeven'}
        </button>
      </div>
    {/if}
  </section>

  <!-- Producten van de gebruiker Section -->
  <section class="px-4 md:px-16">
    <h2 class="text-3xl font-bold text-left mb-6">Jouw toegevoegde producten</h2>
    {#if error}
      <p class="text-red-600">{error}</p>
    {:else if products.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each products as product (product.id)}
          <div class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <img src={product.image || 'https://via.placeholder.com/300'} alt={product.title} class="h-60 w-full object-cover" />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-800">{product.title}</h3>
              <p class="text-gray-600 text-sm">{product.description}</p>
              <p class="text-gray-700 font-semibold">Prijs: €{product.price}</p>
              <p class="text-gray-500 text-sm">Aantal: {product.amount} {product.unit}</p>
              <p class="text-gray-500 text-sm">CO2-bijdrage: {product.co2Contribution} kg</p>
              <p class="text-gray-500 text-sm">Vervaldatum: {new Date(product.expirationDate).toLocaleDateString()}</p>
              {#if product.reserved}
                <p class="text-red-500 text-sm">Gereserveerd door gebruiker {product.reservedByUserID}</p>
              {/if}
              <button
                class="mt-4 bg-[#69A571] text-white px-4 py-2 rounded-md hover:bg-[#5a8f61] transition-colors duration-300"
                on:click={() => viewProductDetails(product.id)}
              >
                Bekijk details
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-gray-600">Je hebt nog geen producten toegevoegd. Begin met het toevoegen van producten om te verkopen of delen!</p>
    {/if}
  </section>

  <!-- About Section -->
  <section class="flex flex-col md:flex-row items-center gap-12 px-4 md:px-16 py-16 bg-gray-100">
    <div class="md:w-1/2 space-y-6">
      <h2 class="text-3xl font-bold">Meer over FoodieFuse</h2>
      <p class="text-lg text-gray-600">Fuse your Finds, with Hungry Minds!</p>
      <p class="text-gray-600">
        Bij FoodieFuse geloven we in de kracht van verbinding en duurzaamheid. Ons platform is er om buurten samen te brengen, mensen te helpen elkaar te ondersteunen en gezamenlijk voedselverspilling tegen te gaan. Heb je een ingrediënt nodig, maar mis je dat ene product in je keukenkastje? Geen zorgen! Met FoodieFuse kun je eenvoudig in contact komen met buren die het wel in huis hebben, zodat je jouw kookplannen niet hoeft te wijzigen.
        <br><br>
        Wij vinden het belangrijk om lokale gemeenschappen te versterken en tegelijkertijd onze impact op het milieu te verkleinen. Door producten te delen, verminderen we niet alleen voedselverspilling, maar dragen we ook bij aan het verminderen van CO2-uitstoot. Elke keer dat we samen werken, sparen we transportkilometers uit en zorgen we voor minder afval.
        <br><br>
        Bij FoodieFuse draait het om samenwerken voor een duurzamere en hechtere buurt, waar iedereen bijdraagt aan een gezonde en verbonden gemeenschap. Doe je mee?
      </p>
    </div>
    <div class="md:w-1/2">
      <img src="/images/over-ons.png" alt="FoodieFuse" class="rounded-lg shadow-md w-full h-auto" />
    </div>
  </section>
</div>