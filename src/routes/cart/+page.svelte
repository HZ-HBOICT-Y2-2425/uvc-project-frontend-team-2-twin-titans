<script>
    let cartItems = [
      { id: 1, name: "Item 1", price: 19.99 },
      { id: 2, name: "Item 2", price: 9.99 },
    ];
  </script>
  
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">Boodschappen mandje</h1>
    {#if cartItems.length}
      <ul class="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {#each cartItems as item}
          <li class="flex justify-between items-center border-b py-2">
            <span class="text-gray-700">{item.name}</span>
            <span class="text-gray-500">${item.price.toFixed(2)}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-500">Jouw boodschappen mandje is leeg!</p>
    {/if}
  </div>
  