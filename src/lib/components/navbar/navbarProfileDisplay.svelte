<script>
    import { user } from "$lib/store";
    import { page } from "$app/stores";

    $: currentPath = $page.url.pathname;
</script>

{#if $user}
    <a 
        href="/profile" 
        class={`flex flex-col items-center px-2 py-1 rounded 
            ${currentPath === "/profile" ? 'bg-white text-green-700' : 'text-white hover:bg-white hover:text-green-700'}`}
    >
        <i class="fa fa-user text-2xl" aria-hidden="true"></i>
        <span class="text-xs">Profiel</span>
    </a>
{:else}
    <div class="flex space-x-3">
        <a 
            href="/login" 
            class="bg-white text-green-700 text-sm px-3 py-1 rounded hover:shadow-sm"
        >
            Inloggen
        </a>
        <a 
            href="/register" 
            class="bg-black text-white text-sm px-3 py-1 rounded hover:shadow-sm"
        >
            Aanmelden
        </a>
    </div>
{/if}
