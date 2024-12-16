<script>
    import NavbarLogo from "./navbarLogo.svelte";
    import NavbarMenuItems from "./navbarMenuItems.svelte";
    import NavbarProfileDisplay from "./navbarProfileDisplay.svelte";
</script>

<!-- Bovenste balk (alleen voor mobiel) -->
<div class="sm:hidden fixed top-0 left-0 right-0 flex items-center justify-between" 
    style="background-color: rgb(100, 173, 108); padding: 8px 16px; z-index: 10;">
    <NavbarLogo />
    <NavbarProfileDisplay />
</div>

<!-- Navbar -->
<nav class="sm:flex sm:items-center sm:justify-between fixed bottom-0 w-full sm:static text-white flex justify-evenly items-center" 
    style="background-color: rgb(100, 173, 108); padding: 8px 16px;">
    
    <!-- Logo en titel (alleen zichtbaar op desktop) -->
    <div class="hidden sm:flex">
        <NavbarLogo />
    </div>

    <!-- Menu-items (zowel mobiel als desktop) -->
    <NavbarMenuItems />

    <div class="hidden sm:flex">
        <NavbarProfileDisplay />
    </div>
</nav>
