<script>
    import "../app.css";
    import Navbar from "$lib/components/navbar/navbar.svelte";
    import { onMount } from "svelte";
    import { user, initializeUserStore } from "$lib/store";

    onMount(() => {
        initializeUserStore();
    })
</script>

<header>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <Navbar />
</header>

<main>
    <slot />
</main>

<footer>
    <p class="text-center text-sm text-gray-500 py-4">
        &copy; 2024 FoodieFuse. All rights reserved.
    </p>
</footer>
