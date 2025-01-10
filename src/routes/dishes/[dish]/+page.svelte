<script>
  import { onMount } from 'svelte';
  import { user } from '../../../lib/store'; // Store for logged-in user
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  const { params } = $page;
  const { dish } = params;

  let recipe;
  let people = 1;
  let selectedIngredients = [];
  let userId = null; // User ID
  let addedToCart = false;
  let localCart = []; // Locally stored cart
  let reviews = [];
  let averageReview = {};

  // Check if user is logged in and fetch recipe data
  onMount(async () => {
    const unsubscribe = user.subscribe((storedUser) => {
      if (storedUser) {
        userId = storedUser.id; // Get the user ID
      }
    });

    await fetchRecipe();
    await fetchReviews();

    // Load the local cart if it exists
    loadLocalCart();

    return () => unsubscribe();
  });

  // Fetch recipe
  async function fetchRecipe() {
    try {
      const response = await fetch(`http://localhost:3010/recipes/${dish}`);
      if (response.ok) {
        recipe = await response.json();
      } else {
        console.error("Recipe not found.");
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  }

  // Fetch reviews
  async function fetchReviews() {
    try {
      const response = await fetch(
        `http://localhost:3010/reviews/recipe/${dish}`,
      );
      if (response.ok) {
        reviews = await response.json();
        calculateAverageReview();
      } else {
        console.error("Error fetching reviews.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  // Calculate average review
  function calculateAverageReview() {
    if (!reviews.length) return (averageReview = null);

    let totalTaste = 0, totalCost = 0, totalDifficulty = 0, totalRating = 0;

    reviews.forEach((r) => {
      totalTaste += r.tasteRating || 0;
      totalCost += r.costRating || 0;
      totalDifficulty += r.difficultyRating || 0;
      totalRating += r.totalRating || 0;
    });

    const count = reviews.length;
    averageReview = {
      taste: (totalTaste / count).toFixed(1),
      cost: (totalCost / count).toFixed(1),
      difficulty: (totalDifficulty / count).toFixed(1),
      total: (totalRating / count).toFixed(1),
      reviewCount: count,
    };
  }

  // Add selected ingredients to the cart
  async function addToCart() {
    if (!selectedIngredients.length) {
      alert("Please select ingredients.");
      return;
    }

    if (userId) {
      // User is logged in, save to database
      try {
        for (const ingredient of selectedIngredients) {
          const itemToAdd = {
            name: ingredient.name,
            amount: ingredient.amount * people,
            unit: ingredient.unit,
          };

          const queryParams = new URLSearchParams(itemToAdd).toString();
          const response = await fetch(`http://localhost:3010/user/${userId}/cart?${queryParams}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) throw new Error("Error adding to cart.");
        }

        addedToCart = true;
        setTimeout(() => (addedToCart = false), 3000);
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("An error occurred while adding items.");
      }
    } else {
      // User is not logged in, save locally
      selectedIngredients.forEach((ingredient) => {
        const itemToAdd = {
          name: ingredient.name,
          amount: ingredient.amount * people,
          unit: ingredient.unit,
        };
        localCart.push(itemToAdd);
      });

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(localCart));
      addedToCart = true;
      setTimeout(() => (addedToCart = false), 3000);
    }
  }

  // Load local cart when the page is loaded
  function loadLocalCart() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      localCart = JSON.parse(storedCart);
      console.log("Locally stored cart:", localCart);
    }
  }

  const changePeople = (delta) => (people = Math.max(1, people + delta));
  const goToReviews = () => goto(`/reviews/${dish}`);
</script>

{#if recipe}
  <!-- Notification -->
  {#if addedToCart}
    <div class="mt-2 mb-4 p-3 bg-green-500 text-white text-center font-bold rounded shadow-lg">
      Producten toegevoegd aan de winkelwagen!
    </div>
  {/if}

  <!-- Recipe Image -->
  <img
    class="block mx-auto w-full max-h-[250px] sm:max-h-[400px] object-cover rounded-lg shadow-md"
    src={recipe.image_url || "https://via.placeholder.com/800x400"}
    alt="Recipe image"
  />

  <h1 class="text-3xl sm:text-5xl text-center mt-3 font-bold">{recipe.name}</h1>

  <!-- People Selection -->
  <div class="flex justify-center items-center mt-4">
    <p class="font-bold mr-2">Aantal personen:</p>
    <button class="px-3 py-1 bg-gray-200 rounded" on:click={() => changePeople(-1)}>-</button>
    <p class="mx-2 text-lg font-bold">{people}</p>
    <button class="px-3 py-1 bg-gray-200 rounded" on:click={() => changePeople(1)}>+</button>
  </div>

  <!-- Ingredients Grid -->
  <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
    <!-- Ingredients -->
    <div class="p-4 border rounded-lg shadow">
      <h3 class="text-xl font-bold mb-2">Ingredienten:</h3>
      <ul>
        {#each recipe.ingredients as ingredient}
          <label class="flex items-center space-x-2 mb-2">
            <input type="checkbox" bind:group={selectedIngredients} value={ingredient} />
            <span>{ingredient.amount * people} {ingredient.unit} {ingredient.name}</span>
          </label>
        {/each}
      </ul>
      <button class="mt-4 w-full p-2 bg-green-500 text-white rounded" on:click={addToCart}>
        Toevoegen aan winkelwagen
      </button>
    </div>

    <!-- Description -->
    <div class="p-4 border rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-2">Beschrijving</h2>
      <p>{recipe.description}</p>
    </div>
  </div>

  <!-- Average Review -->
  <div class="text-center mt-6">
    <h2 class="text-2xl font-bold mb-2">Gemiddelde beoordeling {#if reviews.length} <span class="text-sm text-gray-500">({reviews.length} beoordelingen)</span> {/if}</h2>
    {#if averageReview}
      <div class="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-8">
        <p>⭐ <strong>{averageReview.total}</strong>/5</p>
        <p>💰 Kosten: {averageReview.cost}/5</p>
        <p>⚙️ Moeilijkheid: {averageReview.difficulty}/5</p>
        <p>🍴 Smaak: {averageReview.taste}/5</p>
      </div>
    {:else}
      <p>Geen beoordelingen beschikbaar.</p>
    {/if}
  </div>

  <!-- Review Button -->
  <div class="flex justify-center mt-4">
    <button
      class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      on:click={goToReviews}
    >
      Schrijf een beoordeling
    </button>
  </div>

  <!-- Reviews Section -->
  <div class="mt-6 px-4">
    <h2 class="text-2xl font-bold mb-4 text-center">Beoordelingen</h2>
    {#if reviews.length > 0}
      <ul class="space-y-4">
        {#each reviews as review}
          <li class="p-4 border rounded shadow">
            <p>⭐ Totale beoordeling: {review.totalRating}/5</p>
            <p>🍴 Smaak: {review.tasteRating || "N/A"}/5</p>
            <p>💰 Kosten: {review.costRating || "N/A"}/5</p>
            <p>⚙️ Moeilijkhijd: {review.difficultyRating || "N/A"}/5</p>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-center text-gray-500">Geen beoordelingen beschikbaar.</p>
    {/if}
  </div>
{:else}
  <p class="text-center">Laden...</p>
{/if}