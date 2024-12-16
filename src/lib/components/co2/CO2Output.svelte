<script>
    // @ts-nocheck
  
    let userData = {
      id: 4,
      name: "test5",
      password: "testtest",
      email: "test5@gmail.com",
      zipcode: "1234AB",
      co2Contribution: 0,
      shoppingCart: []
    };
</script>

<div class="px-6 py-8  rounded-lg shadow-lg mt-8 max-w-[80%] mx-auto bg-white">
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <p class="text-gray-700 text-lg">
            <span class="font-semibold text-gray-900">Naam:</span> {userData.name}
        </p>

        <p class="text-gray-700 text-lg">
            <span class="font-semibold text-gray-900">CO₂ Contributie:</span> {userData.co2Contribution} kg
        </p>
    </div>

    {#if userData.shoppingCart.length > 0}
        <div class="mt-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">Shopping Cart:</h2>
            <ul>
                {#each userData.shoppingCart as item}
                    <li class="text-gray-700 text-lg">
                        {item.name} - {item.amount} {item.unit}
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
