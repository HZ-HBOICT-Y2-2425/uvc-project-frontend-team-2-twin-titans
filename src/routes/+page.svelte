<script>
  import { user } from "$lib/store";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import "../app.css";
  import { getData, getDataUrls } from "$lib/dataHandler";
  import ProductOverviewCard from "$lib/components/product/ProductOverviewCard.svelte";

  let categories = [
    {
      title: "Groenten",
      image: "/images/groenten.png",
      description: "Verse en gezonde groenten direct van de boer.",
    },
    {
      title: "Zetmeel",
      image: "/images/zetmeel.png",
      description: "Producten die zetmeel en granen bevatten.",
    },
    {
      title: "Zuivel",
      image: "/images/zuivel.png",
      description: "Biologische melk, kaas en meer.",
    },
    {
      title: "Vlees",
      image: "/images/eiwitten.png",
      description: "Lokale en duurzame vleesproducten.",
    },
  ];

  let products = [];
  let error = null;
  let userID;

  // Haal de producten op van de API die specifiek door deze gebruiker zijn toegevoegd
  onMount(() => {
    setTimeout(async () => {
      userID = $user?.id || 1; // Gebruik een fallback van 1 als de userID niet beschikbaar is
      console.log("Gebruiker ID:", userID);

      const productsUrls = await getData(
        `http://localhost:3010/products/user/${userID}`,
      );

      products = await getDataUrls(productsUrls);

      console.log("Producten van gebruiker:", products);
    }, 100); // 100 milliseconden vertraging
  });

  // Navigeer naar de product detailpagina
  const viewProductDetails = (productId) => {
    goto(`/products/${productId}`);
  };
</script>

<div class="min-h-screen bg-gray-50 flex flex-col space-y-12">
  <!-- Header Section -->
  <section
    class="flex flex-col items-center justify-center text-center py-16 bg-white"
  >
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

  <!-- Categorieen Section -->
  <section class="px-4 md:px-16">
    <h2 class="text-3xl font-bold text-left mb-6">Categorieen</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each categories as category}
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <img
            src={category.image}
            alt={category.title}
            class="h-60 w-full object-cover"
          />
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-800">{category.title}</h3>
            <p class="text-gray-600 text-sm">{category.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Producten van de gebruiker Section -->
  <section class="px-4 md:px-16">
    <h2 class="text-3xl font-bold text-left mb-6">
      Jouw toegevoegde producten
    </h2>
    {#if error}
      <p class="text-red-600">{error}</p>
    {:else if products.length > 0}
      <!-- Scrollbare container -->
      <div
        class="overflow-y-auto max-h-[600px] border border-gray-300 rounded-lg shadow-lg"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {#each products as product}
            <ProductOverviewCard
              {product}
              onViewDetails={viewProductDetails}
            />
          {/each}
        </div>
      </div>
    {:else}
      <p class="text-gray-600">
        Je hebt nog geen producten toegevoegd. Begin met het toevoegen van
        producten om te verkopen of delen!
      </p>
    {/if}
  </section>

  <!-- About Section -->
  <section
    class="flex flex-col md:flex-row items-center gap-12 px-4 md:px-16 py-16 bg-gray-100"
  >
    <div class="md:w-1/2 space-y-6">
      <h2 class="text-3xl font-bold">Meer over FoodieFuse</h2>
      <p class="text-lg text-gray-600">Fuse your Finds, with Hungry Minds!</p>
      <p class="text-gray-600">
        Bij FoodieFuse geloven we in de kracht van verbinding en duurzaamheid. Ons
        platform is er om buurten samen te brengen, mensen te helpen elkaar te ondersteunen
        en gezamenlijk voedselverspilling tegen te gaan. Heb je een ingrediënt nodig,
        maar mis je dat ene product in je keukenkastje? Geen zorgen! Met FoodieFuse
        kun je eenvoudig in contact komen met buren die het wel in huis hebben, zodat
        je jouw kookplannen niet hoeft te wijzigen.
        <br /><br />
        Wij vinden het belangrijk om lokale gemeenschappen te versterken en tegelijkertijd
        onze impact op het milieu te verkleinen. Door producten te delen, verminderen
        we niet alleen voedselverspilling, maar dragen we ook bij aan het verminderen
        van CO2-uitstoot. Elke keer dat we samen werken, sparen we transportkilometers
        uit en zorgen we voor minder afval.
        <br /><br />
        Bij FoodieFuse draait het om samenwerken voor een duurzamere en hechtere
        buurt, waar iedereen bijdraagt aan een gezonde en verbonden gemeenschap.
        Doe je mee?
      </p>
    </div>
    <div class="md:w-1/2">
      <img
        src="/images/over-ons.png"
        alt="FoodieFuse"
        class="rounded-lg shadow-md"
      />
    </div>
  </section>
</div>
