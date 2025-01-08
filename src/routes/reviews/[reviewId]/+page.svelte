<script>
  import { user } from '$lib/store'; // Zorg ervoor dat je de juiste user store importeert
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; 
  import { goto } from '$app/navigation';

  let recipeId; 
  let existingReview = null;
  let costRating = 1;
  let difficultyRating = 1;
  let tasteRating = 1;
  let userId;

  // Zorg ervoor dat recipeId beschikbaar is uit de URL-parameters
  $: {
    if ($page.params && $page.params.reviewId) {
      recipeId = $page.params.reviewId; // Gebruik reviewId als recipeId
    }
  }

  // Zorg ervoor dat userId altijd uit de store komt
  $: userId = $user?.id;

  // Controleer of er al een review is voor dit recept
  onMount(async () => {
    if (!userId || !recipeId) return; // Controleer of zowel userId als recipeId beschikbaar zijn

    const response = await fetch(`http://localhost:3010/reviews/user/${userId}`);
    if (response.ok) {
      const reviews = await response.json();
      existingReview = reviews.find(review => review.recipeId == recipeId); // Zoek naar de review met het juiste recipeId
    } else {
      console.error('Fout bij het ophalen van reviews');
    }
  });

  // Functie om de review in te sturen
  async function submitReview() {
    if (existingReview) {
      alert('Je hebt al een review voor dit recept.');
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        userID: userId,
        recipeID: recipeId, 
        costRating: costRating,
        difficultyRating: difficultyRating,
        tasteRating: tasteRating
      }).toString();

      const response = await fetch(`http://localhost:3010/reviews/create?${queryParams}`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Review succesvol toegevoegd!');
        goto(`/dishes/${recipeId}`); 
      } else {
        const error = await response.json();
        console.error('Server fout:', error);
        throw new Error('Fout bij het toevoegen van de review');
      }
    } catch (error) {
      console.error(error);
      alert('Er is een fout opgetreden bij het toevoegen van de review.');
    }
  }
</script>

{#if existingReview}
  <p class="text-center text-lg">Je hebt al een Beoordeling voor dit recept.</p>
{:else}
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-bold text-custom-green text-center mb-6">Schrijf een Beoordeling</h1>
    
    <!-- Algemene uitleg onder de titel -->
    <p class="text-center text-sm text-gray-600 mb-4">
      Beoordeel dit recept op basis van kosten, moeilijkheid en smaak. Vul de onderstaande velden in om je mening te geven.
    </p>

    <form on:submit|preventDefault={submitReview} class="space-y-6">
      <!-- Kosten input -->
      <div class="flex flex-col">
        <label for="costRating" class="text-lg font-medium text-gray-700 mb-2">Kosten:</label>
        <p class="text-sm text-gray-500 mb-2">Beoordeel de kosten van het recept op een schaal van 1 tot 5, waarbij 1 staat voor 'zeer goedkoop' en 5 voor 'zeer duur'.</p>
        <input 
          type="number" 
          id="costRating" 
          bind:value={costRating} 
          min="1" 
          max="5" 
          class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green w-full {costRating < 1 || costRating > 5 ? 'border-red-500' : 'border-gray-300'}"
          required
        />
        {#if costRating < 1 || costRating > 5}
          <p class="text-red-500 text-sm text-center">De waarde moet tussen 1 en 5 liggen.</p>
        {/if}
      </div>

      <!-- Moeilijkheid input -->
      <div class="flex flex-col">
        <label for="difficultyRating" class="text-lg font-medium text-gray-700 mb-2">Moeilijkheid:</label>
        <p class="text-sm text-gray-500 mb-2">Beoordeel de moeilijkheid van het recept op een schaal van 1 tot 5, waarbij 1 staat voor 'heel makkelijk' en 5 voor 'zeer moeilijk'.</p>
        <input 
          type="number" 
          id="difficultyRating" 
          bind:value={difficultyRating} 
          min="1" 
          max="5" 
          class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green w-full {difficultyRating < 1 || difficultyRating > 5 ? 'border-red-500' : 'border-gray-300'}"
          required
        />
        {#if difficultyRating < 1 || difficultyRating > 5}
          <p class="text-red-500 text-sm text-center">De waarde moet tussen 1 en 5 liggen.</p>
        {/if}
      </div>

      <!-- Smaak input -->
      <div class="flex flex-col">
        <label for="tasteRating" class="text-lg font-medium text-gray-700 mb-2">Smaak:</label>
        <p class="text-sm text-gray-500 mb-2">Beoordeel de smaak van het recept op een schaal van 1 tot 5, waarbij 1 staat voor 'slecht' en 5 voor 'uitstekend'.</p>
        <input 
          type="number" 
          id="tasteRating" 
          bind:value={tasteRating} 
          min="1" 
          max="5" 
          class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green w-full {tasteRating < 1 || tasteRating > 5 ? 'border-red-500' : 'border-gray-300'}"
          required
        />
        {#if tasteRating < 1 || tasteRating > 5}
          <p class="text-red-500 text-sm text-center">De waarde moet tussen 1 en 5 liggen.</p>
        {/if}
      </div>

      <!-- Verzenden knop -->
      <button 
        type="submit" 
        class="w-full bg-custom-green text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-200 mt-4">
        Verzenden
      </button>
    </form>
  </div>
{/if}
