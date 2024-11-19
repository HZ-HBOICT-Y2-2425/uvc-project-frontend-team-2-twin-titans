<script>
    export let cartItems = ["Pizza", "Burger"];
</script>

<h1>Your Cart</h1>
{#if cartItems.length > 0}
    <ul>
        {#each cartItems as item}
            <li>{item}</li>
        {/each}
    </ul>
{:else}
    <p>Your cart is empty.</p>
{/if}
