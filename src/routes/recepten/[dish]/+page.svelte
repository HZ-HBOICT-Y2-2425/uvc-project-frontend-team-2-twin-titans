<script>
  import { page } from "$app/stores";

  const { params } = $page;
  const { dish } = params;
  let people = 1;

  let recipe;

  // Fetch recipe data (replace this with your actual API or data source)
  const fetchRecipe = async () => {
    const response = await fetch(`http://localhost:3010/recipes/${dish}`);
    recipe = await response.json();
  };

  // Call the fetch function when the component is created
  fetchRecipe();

  let ingredients = ["Salt", "Pepper", "Garlic", "Olive Oil"];
  let selectedIngredients = []; // Array to store selected ingredients
</script>

<img class="block mx-auto" src={"https://via.placeholder.com/800x400"} alt="" />

{#if recipe}
  <h1 class="text-6xl text-center mt-3">{recipe.name}</h1>
  <h2 class="text-2xl font-bold mt-5 ml-2">Beschrijving</h2>
  <p
    class="max-w-[40vw] border-2 border-solid rounded border-black ml-2 p-1 px-2"
  >
    {recipe.description}
  </p>

  <div class="flex items-center mt-2 ml-2">
    <p class="font-bold mr-2">Ingredients:</p>
    <button
      class="border-2 border-black min-w-[2vw] bg-zinc-200"
      on:click={() => people--}>-</button
    >
    <p class="text-center border-2 border-black max-w-[4vw] min-w-[4vw]">
      {people}
    </p>
    <button
      class="border-2 border-black min-w-[2vw] bg-zinc-200"
      on:click={() => people++}>+</button
    >
  </div>

  <ul>
    {#each recipe.ingredients as ingredient}
      <label class="flex items-center space-x-2 ml-2">
        <input
          type="checkbox"
          bind:group={selectedIngredients}
          value={ingredient}
          class="form-checkbox"
        />
        <span>{ingredient}</span>
      </label>
    {/each}
  </ul>
{:else}
  <p>Loading...</p>
{/if}

<!-- <h2 class="mt-4 font-bold">Selected Ingredients:</h2>
<ul>
  {#each selectedIngredients as selected}
    <li>{selected}</li>
  {/each}
</ul> -->
