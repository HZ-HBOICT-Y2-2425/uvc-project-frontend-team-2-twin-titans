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
  let addedToCart = false; // Staat voor de toevoeging aan de winkelwagen

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
      addedToCart = true; // Zet de status naar true wanneer het succesvol is toegevoegd
      selectedIngredients = []; // Reset de selectie

      // Zet de status terug naar false na 3 seconden
      setTimeout(() => {
        addedToCart = false;
      }, 3000); // Melding verdwijnt na 3 seconden
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
  <!-- Melding na het toevoegen aan de winkelwagen -->
  {#if addedToCart}
    <div class="mt-2 mb-4 p-3 bg-green-500 text-white text-center font-bold rounded shadow-lg transition-opacity opacity-100">
      Product toegevoegd aan de winkelwagen!
    </div>
  {/if}

  <img 
    class="block mx-auto max-h-[400px] w-auto rounded-lg shadow-md" 
    src={recipe.image_url || 'https://via.placeholder.com/800x400'} 
    alt="Recept afbeelding" 
  />
  <h1 class="text-6xl text-center mt-3">{recipe.name}</h1>

  <div class="flex items-center mt-2 ml-12">
    <p class="font-bold mr-2">Aantal personen:</p>
    <button class="border-2 border-black min-w-[2vw] bg-zinc-200" on:click={() => changePeople(-1)}>-</button>
    <p class="text-center border-2 border-black max-w-[4vw] min-w-[4vw]">{people}</p>
    <button class="border-2 border-black min-w-[2vw] bg-zinc-200" on:click={() => changePeople(1)}>+</button>
  </div>

  <div class="flex mt-4 ml-10">
    <!-- Ingrediënten Sectie -->
    <div class="border-2 border-solid rounded border-black p-2 min-w-[18vw] max-w-[18vw]">
      <h3 class="text-xl font-bold ml-2">Ingrediënten:</h3>
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
    </div>

    <!-- Beschrijving Sectie -->
    <div class="w-1/2 ml-10">
      <h2 class="text-2xl font-bold">Beschrijving</h2>
      <p class="max-w-[40vw] border-2 border-solid rounded border-black ml-2 p-1 px-2">
        {recipe.description}
      </p>
    </div>
  </div>

{:else}
  <p>Loading...</p>
{/if}
