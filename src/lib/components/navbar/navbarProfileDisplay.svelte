<script>
    import { user } from "$lib/store";
</script>

{#if $user}
    <a href="/profile" class="text-white flex flex-col items-center hover:bg-white hover:text-green-700 px-2 py-1 rounded">
        <i class="fa fa-user text-2xl" aria-hidden="true"></i>
        <span class="text-xs">Profiel</span>
    </a>
{:else}
    <div class="flex space-x-3">
        <a href = "/login" class="bg-white text-green-700 text-sm px-3 py-1 rounded hover:shadow-sm">
            Inloggen
        </a>
        <a href="/register" class="bg-black text-white text-sm px-3 py-1 rounded hover:shadow-sm">
            Aanmelden
        </a>
    </div>
{/if}