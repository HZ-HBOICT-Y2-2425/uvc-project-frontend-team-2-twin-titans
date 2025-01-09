<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import '@fortawesome/fontawesome-free/css/all.css';

    let menuItems = [
        { name: "Home", href: "/", icon: "fa-home" },
        { name: "Marktplaats", href: "/products", icon: "fa-store" },
        { name: "Mijn Producten", href: "/your-products", icon: "fa-leaf" },
        { name: "Recepten", href: "/dishes", icon: "fa-cutlery" },
        { name: "Mandje", href: "/cart", icon: "fa-shopping-basket" },
    ];

    // Reactive variable for the current path
    $: currentPath = $page.url.pathname;
</script>

<div class="flex justify-evenly w-full sm:w-auto text-xs sm:text-sm z-10">
    {#each menuItems as item}
        <button 
            on:click={() => goto(item.href)} 
            class={`flex flex-col items-center text-xs sm:text-sm px-2 py-1 rounded
                ${currentPath === item.href ? 'bg-white text-green-700' : 'text-white hover:bg-white hover:text-green-700'}`}
        >
            <i class={`fa ${item.icon} text-2xl`} aria-hidden="true"></i>
            <span class="text-xs sm:text-sm">{item.name}</span>
        </button>
    {/each}
</div>
