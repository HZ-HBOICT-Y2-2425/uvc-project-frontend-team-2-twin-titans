<script>
  export let dishes = ["Spaghetti", "Sushi", "Tacos"];
</script>

<h1>Available Dishes</h1>
<ul>
  {#each dishes as dish}
    <li>
      <a href={`/recepten/${dish}`}>{dish}</a>
    </li>
  {/each}
</ul>
