<script>
    export let foodItems = ["Pizza", "Burger", "Pasta"];
</script>

<h1>Food Menu</h1>
<ul>
    {#each foodItems as food}
        <li>{food}</li>
    {/each}
</ul>
