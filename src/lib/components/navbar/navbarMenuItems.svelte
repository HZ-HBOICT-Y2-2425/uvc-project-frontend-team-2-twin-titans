<script>
    let menuItems = [
        { id: 1, name: "Home", href: "/", icon: "fa-home" },
        { id: 2, name: "Producten", href: "/products", icon: "fa-leaf" },
        { id: 3, name: "Recepten", href: "/dishes", icon: "fa-cutlery" },
        { id: 4, name: "Mandje", href: "/cart", icon: "fa-shopping-basket" },
    ];
</script>

<div class="flex justify-evenly w-full sm:w-auto text-xs sm:text-sm">
    {#each menuItems as item}
        <a href={item.href} class="flex flex-col items-center text-white text-xs sm:text-sm hover:bg-white hover:text-green-700 px-2 py-1 rounded">
            <i class={`fa ${item.icon} text-2xl`} aria-hidden="true"></i>
            <span class="text-xs sm:text-sm">{item.name}</span>
        </a>
    {/each}
</div>