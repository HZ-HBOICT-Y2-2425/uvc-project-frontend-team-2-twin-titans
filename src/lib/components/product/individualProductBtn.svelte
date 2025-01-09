<script>
    import { goto } from "$app/navigation";
    export let product;
</script>

<button
    class="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer text-left"
    on:click={() => goto(`/products/${product.id}`)}
>
    <img
        src="https://via.placeholder.com/400x200"
        alt="{product.title}"
        class="w-full h-48 object-cover"
    />
    <div class="p-4">
        <h2 class="text-lg font-bold text-green-700 mb-2">{product.title}</h2>
        <p class="text-green-700 font-bold text-base mb-2">${product.price.toFixed(2)}</p>
        <p class="text-gray-700 text-sm truncate">{product.description.slice(0, 100)}...</p>
    </div>
</button>