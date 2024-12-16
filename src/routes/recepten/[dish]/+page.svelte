<script>
  import { cart, loadCart, saveCart, clearLocalCart } from '../../../stores/cart'; // Winkelwagen store importeren
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  const { params } = $page;
  const { dish } = params;

  let recipe;
  let people = 1;
  let selectedIngredients = [];
  let userId = 1; // Gebruik de huidige ingelogde gebruiker (hardcoded voorbeeld)

  // Haal receptdata op via de API
  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:3010/recipes/${dish}`);
      if (response.ok) {
        recipe = await response.json();
      } else {
        throw new Error('Recept niet gevonden');
      }
    } catch (error) {
      console.error('Er is een fout opgetreden:', error);
    }

    loadCart(); // Laad de winkelwagen bij het laden van de pagina
  });

  // Voeg geselecteerde ingrediënten toe aan de winkelwagen
  const addToCart = async () => {
    if (selectedIngredients.length === 0) {
      alert('Selecteer eerst ingrediënten!');
      return;
    }

    try {
      // Verstuur elk geselecteerd ingrediënt afzonderlijk naar de backend
      for (const ingredient of selectedIngredients) {
        const itemToAdd = {
          name: ingredient.name,
          amount: ingredient.amount * people, // Pas het aantal aan op basis van de personen
          unit: ingredient.unit
        };

        const response = await fetch(`http://localhost:3012/${userId}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemToAdd), // Verstuur één item
        });

        if (!response.ok) {
          throw new Error('Fout bij het toevoegen van ingrediënten aan de winkelwagen');
        }

        // Bij succes, werk de winkelwagen store bij
        const updatedCart = await response.json();
        cart.set(updatedCart);
        saveCart(); // Sla de winkelwagen op in localStorage
      }

      alert('Ingrediënten toegevoegd aan de winkelwagen!');
      selectedIngredients = []; // Reset de selectie
    } catch (error) {
      console.error(error);
      alert('Er is een fout opgetreden bij het toevoegen van ingrediënten aan de winkelwagen.');
    }
  };

  // Beperk de minimumwaarde van mensen tot 1
  const changePeople = (delta) => {
    people = Math.max(1, people + delta);
  };
</script>

{#if recipe}
  <img class="block mx-auto" src={recipe.image_url || 'https://via.placeholder.com/800x400'} alt="Recept afbeelding" />
  <h1 class="text-6xl text-center mt-3">{recipe.name}</h1>
  <h2 class="text-2xl font-bold mt-5 ml-2">Beschrijving</h2>
  <p class="max-w-[40vw] border-2 border-solid rounded border-black ml-2 p-1 px-2">
    {recipe.description}
  </p>

  <div class="flex items-center mt-2 ml-2">
    <p class="font-bold mr-2">Aantal personen:</p>
    <button class="border-2 border-black min-w-[2vw] bg-zinc-200" on:click={() => changePeople(-1)}>-</button>
    <p class="text-center border-2 border-black max-w-[4vw] min-w-[4vw]">{people}</p>
    <button class="border-2 border-black min-w-[2vw] bg-zinc-200" on:click={() => changePeople(1)}>+</button>
  </div>

  <h3 class="text-xl font-bold mt-4 ml-2">Ingrediënten:</h3>
  <ul>
    {#each recipe.ingredients as ingredient}
      <label class="flex items-center space-x-2 ml-2">
        <input 
          type="checkbox" 
          bind:group={selectedIngredients} 
          value={ingredient} 
          class="form-checkbox" />
        <span>{ingredient.amount * people} {ingredient.unit} {ingredient.name}</span>
      </label>
    {/each}
  </ul>

  <button class="mt-4 p-2 bg-green-500 text-white rounded" on:click={addToCart}>
    Voeg toe aan winkelwagen
  </button>

{:else}
  <p>Loading...</p>
{/if}
