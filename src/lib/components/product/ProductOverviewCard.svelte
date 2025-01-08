<script>
    export let product;
    export let onViewDetails;
  </script>
  
  <div
    class="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
  >
    <img
      src={product.image
        ? `http://localhost:3010/products/product/image/${product.image}`
        : "https://via.placeholder.com/300"}
      alt={product.title}
      class="h-40 w-full object-cover border-2 border-gray rounded-md"
    />
    <div class="p-4">
      <h3 class="text-lg font-bold text-gray-800">{product.title}</h3>
      <p class="text-gray-700 font-semibold">Prijs: €{product.price}</p>
      <p class="text-gray-500 text-sm">
        Aantal: {product.amount} {product.unit}
      </p>
      <p class="text-gray-500 text-sm">
        Vervaldatum: {new Date(product.expirationDate).toLocaleDateString()}
      </p>
      {#if product.reserved}
        <p class="text-red-500 text-sm">
          Gereserveerd door gebruiker {product.reservedByUserID}
        </p>
      {/if}
      <button
        class="mt-4 bg-[#69A571] text-white px-4 py-2 rounded-md"
        on:click={() => onViewDetails(product.id)}
      >
        Bekijk details
      </button>
    </div>
  </div>
  