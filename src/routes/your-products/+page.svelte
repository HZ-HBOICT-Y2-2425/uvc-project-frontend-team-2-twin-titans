<script>
  import { onMount } from "svelte";
  import { user } from "$lib/store";
  import { goto } from "$app/navigation";
  import { getData, getDataUrls, putData } from "$lib/dataHandler";
  import AddProductBtn from "$lib/components/product/addProductBtn.svelte";
  import ProductOverviewCard from "$lib/components/product/productOverviewCard.svelte"; // Importeer de nieuwe component
  import RemoveReservationBtn from "$lib/components/product/removeReservationBtn.svelte";
  import AcceptReservationBtn from "$lib/components/product/acceptReservationBtn.svelte";

  let products = {
    unreserved: [],
    reserved: [],
    yourReservations: [],
  };
  let isLoading = true;
  let error = null;

  onMount(async () =>
    setTimeout(async () => {
      try {
        let productsArray = [];
        const productUrls = await getData(
          `http://localhost:3010/products/user/${$user.id}`,
        );
        if (productUrls.length !== 0) {
          productsArray = await getDataUrls(productUrls);
        } else {
          error = "U heeft nog geen producten";
        }

        // Filter producten op de basis dat ze gereserveerd zijn
        products.unreserved = productsArray.filter(
          (product) => !product.reserved,
        );
        products.reserved = productsArray.filter((product) => product.reserved);

        const reservationUrls = await getData(
          `http://localhost:3010/products/reservation/${$user.id}`,
        );

        if (reservationUrls.length !== 0) {
          products.yourReservations = await getDataUrls(reservationUrls);
        }

        console.log("products:", products);
      } catch (err) {
        console.error("Error bij het laden van producten:", err);
        error =
          "Producten konden niet worden geladen. Probeer het later opnieuw.";
      } finally {
        isLoading = false;
      }
    }, 100),
  );

  const onViewDetails = (productId) => {
    goto(`/products/${productId}`);
  };
</script>

<div class="container mx-auto p-4">
  {#if products.yourReservations.length > 0}
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-green-600">Reservaties:</h1>
      <AddProductBtn />
    </div>

    {#if !isLoading && error === null}
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
      >
        {#each products.yourReservations as product}
          <div class="grid border border-black rounded-lg gap-4 p-1">
            <ProductOverviewCard {product} {onViewDetails} />
            <RemoveReservationBtn {product} />
          </div>
        {/each}
      </div>
    {/if}
  {/if}

  {#if products.reserved.length > 0}
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-green-600">
        Gereserveerde producten:
      </h1>
      {#if products.yourReservations.length === 0}
        <AddProductBtn />
      {/if}
    </div>

    {#if $user !== null && !isLoading && error === null}
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
      >
        {#each products.reserved as product}
          <div class="grid border border-black rounded-lg gap-4 p-1">
            <ProductOverviewCard {product} {onViewDetails} />
            <div class="grid grid-cols-2 gap-4">
              <AcceptReservationBtn {product} />
              <RemoveReservationBtn {product} />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}

  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold text-green-600">Eigen producten:</h1>
    {#if products.reserved.length === 0 && products.yourReservations.length === 0}
      <AddProductBtn />
    {/if}
  </div>

  {#if $user === null}
    <p class="text-center text-red-600">Log in om uw producten te zien</p>
  {:else if isLoading}
    <p class="text-center text-gray-600">Producten worden geladen...</p>
  {:else if error}
    <p class="text-center text-red-600">{error}</p>
  {:else if products.unreserved.length > 0}
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4"
    >
      {#each products.unreserved as product}
        <ProductOverviewCard {product} {onViewDetails} />
      {/each}
    </div>
  {:else}
    <p class="text-center text-gray-600">Geen producten gevonden...</p>
  {/if}
</div>
