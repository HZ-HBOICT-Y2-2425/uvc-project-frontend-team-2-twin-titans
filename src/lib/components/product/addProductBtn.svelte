<script>
    import { goto } from "$app/navigation";
</script>

<button
    class="text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
    style="background-color: rgb(100, 173, 108);"
    on:click={() => goto('products/add-product')}
    >
    + Product toevoegen
</button>