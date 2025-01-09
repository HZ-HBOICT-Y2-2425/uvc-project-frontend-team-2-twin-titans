<script>
    import { unreserve } from "$lib/dataHandler";

    export let product;
</script>

<button 
    on:click={() => unreserve(product)} 
    class="bg-red-500 rounded-lg transition-transform transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer text-center text-white font-bold p-1"
>
    Reservatie Annuleren
</button>