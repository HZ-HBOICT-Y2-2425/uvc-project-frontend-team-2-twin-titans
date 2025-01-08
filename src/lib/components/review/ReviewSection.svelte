<script>
    import { goto } from "$app/navigation";
    export let reviews = [];
    export let averageReview = {};
    export let userId = null;
    export let dish = "";
  
    const goToReviews = () => goto(`/reviews/${dish}`);
  </script>
  
  <div class="text-center mt-6">
    <h2 class="text-2xl font-bold mb-2">
      Gemiddelde beoordeling
      {#if reviews.length}
        <span class="text-sm text-gray-500">
          ({reviews.length}
          {reviews.length === 1 ? "beoordeling" : "beoordelingen"})
        </span>
      {/if}
    </h2>
    {#if averageReview}
      <div
        class="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-8"
      >
        <p>⭐ <strong>{averageReview.total}</strong>/5</p>
        <p>💰 Kosten: {averageReview.cost}/5</p>
        <p>⚙️ Moeilijkheid: {averageReview.difficulty}/5</p>
        <p>🍴 Smaak: {averageReview.taste}/5</p>
      </div>
    {:else}
      <p>Geen reviews beschikbaar.</p>
    {/if}
  
    <!-- Beoordeling Knop -->
    {#if userId}
      <div class="flex justify-center mt-4">
        <button
          class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          on:click={goToReviews}
        >
          Schrijf een beoordeling
        </button>
      </div>
    {/if}
  
    <!-- Beoordeling Sectie -->
    <div class="mt-6 px-4">
      <h2 class="text-2xl font-bold mb-4 text-center">Beoordeling</h2>
      {#if reviews.length > 0}
        <p class="text-center text-gray-500">
          {reviews.length}
          {reviews.length === 1 ? "beoordeling" : "beoordelingen"}
        </p>
        <ul class="space-y-4">
          {#each reviews as review}
            <li class="p-4 border rounded shadow text-left">
              <p>⭐ Totale Beoordeling: {review.totalRating}/5</p>
              <p>🍴 Smaak: {review.tasteRating || "N.v.t."}/5</p>
              <p>💰 Kosten: {review.costRating || "N.v.t."}/5</p>
              <p>⚙️ Moeilijkheid: {review.difficultyRating || "N.v.t."}/5</p>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-center text-gray-500">Geen reviews beschikbaar.</p>
      {/if}
    </div>
  </div>
  