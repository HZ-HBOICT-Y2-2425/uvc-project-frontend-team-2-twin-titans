<script>
    import Food from "./food.svelte";
    import Cart from "./cart.svelte";
    import Dishes from "./dishes.svelte";
    import Profile from "./profile.svelte";

    // Menu-items met afbeeldingen en componenten
    export let menuItems = [
        { id: 1, name: "Food", image: "./src/assets/food.png", component: Food },
        { id: 2, name: "Dishes", image: "./src/assets/dishes.png", component: Dishes },
        { id: 3, name: "Cart", image: "./src/assets/cart.png", component: Cart },
        { id: 4, name: "Profile", image: "./src/assets/profile.png", component: Profile }
    ];

    let menu = 1; // Standaard geselecteerd menu-item
</script>

<style>
    nav {
        display: flex;
        align-items: center;
        justify-content: space-between; /* Logo links en ruimte tussen menu en logo */
        background-color: rgba(100, 175, 100, 255);
        padding: 10px 20px;
        border-bottom: 1px solid #ddd;
    }

    /* Het logo aan de linkerzijde */
    nav img {
        height: 80px;
    }

    /* De container voor de menu-items die in het midden komen te staan */
    .menu-container {
        display: flex;
        gap: 30px;
        justify-content: center; /* Plaats menu-items in het midden */
        flex-grow: 1; /* Zorg ervoor dat deze container de overgebleven ruimte opvult */
    }

    /* Stijl voor elk menu-item */
    .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding: 10px;
        border: 1px solid transparent;
        border-radius: 8px;
        transition: transform 0.2s, background-color 0.2s;
    }

    /* Afbeeldingen in de menu-items */
    .menu-item img {
        height: 60px;
        width: 60px;
        object-fit: cover;
        margin-bottom: 10px;
    }

    /* Actief menu-item stijl */
    .menu-item.active {
        background-color: white;
        border-color: limegreen;
        transform: scale(1.1);
    }

    /* Hover-effect voor menu-items */
    .menu-item:hover {
        background-color: rgba(255, 255, 255, 0.8);
    }

    /* Tekst in de menu-items */
    .menu-item span {
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        color: black;
    }

    /* Actieve tekstkleur */
    .menu-item.active span {
        color: limegreen;
    }

</style>

<!-- Navigatie -->
<nav>
    <img src="./src/assets/logo.png" alt="Logo" />
    <div class="menu-container">
        {#each menuItems as item}
            <div
                class="menu-item {menu === item.id ? 'active' : ''}"
                on:click={() => (menu = item.id)}
            >
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
            </div>
        {/each}
    </div>
</nav>

<!-- Dynamisch geladen component -->
{#each menuItems as item (item.id)}
    {#if menu === item.id}
        <svelte:component this={item.component} />
    {/if}
{/each}
