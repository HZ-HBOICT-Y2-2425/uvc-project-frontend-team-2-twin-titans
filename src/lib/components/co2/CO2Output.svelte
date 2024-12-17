<script>
    // @ts-nocheck
  
    import { user } from "$lib/store";
</script>

<div class="px-6 py-8 rounded-lg shadow-lg mt-8 max-w-[80%] mx-auto bg-white">
    {#if $user}
        <!-- Als de gebruiker is ingelogd, laat de CO₂ contributie zien -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <p class="text-gray-700 text-lg">
                <span class="font-semibold text-gray-900">Naam:</span> {$user.name}
            </p>

            <p class="text-gray-700 text-lg">
                <span class="font-semibold text-gray-900">CO₂ Contributie:</span> {$user.co2Contribution} kg
            </p>
        </div>

        {#if $user.shoppingCart.length > 0}
            <div class="mt-6">
                <h2 class="text-xl font-semibold text-gray-700 mb-2">Shopping Cart:</h2>
                <ul>
                    {#each $user.shoppingCart as item}
                        <li class="text-gray-700 text-lg">
                            {item.name} - {item.amount} {item.unit}
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    {:else}
        <!-- Als de gebruiker niet is ingelogd -->
        <p class="text-gray-700 text-lg text-center">
            Log in om uw CO₂ contributie te bekijken.
        </p>
    {/if}
</div>
