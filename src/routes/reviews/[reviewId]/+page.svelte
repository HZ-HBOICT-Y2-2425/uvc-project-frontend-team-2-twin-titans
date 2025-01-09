<script>
  import { user } from "$lib/store";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import RatingInput from "$lib/components/review/RatingInput.svelte"; // Pad naar je component

  let recipeId;
  let costRating = 1;
  let difficultyRating = 1;
  let tasteRating = 1;
  let userId;

  $: {
    if ($page.params && $page.params.reviewId) {
      recipeId = $page.params.reviewId;
    }
  }

  $: userId = $user?.id;

  async function submitReview() {
    try {
      const queryParams = new URLSearchParams({
        userID: userId,
        recipeID: recipeId,
        costRating: costRating,
        difficultyRating: difficultyRating,
        tasteRating: tasteRating,
      }).toString();

      const response = await fetch(
        `http://localhost:3010/reviews/create?${queryParams}`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        alert("Review succesvol toegevoegd!");
        goto(`/dishes/${recipeId}`);
      } else {
        const error = await response.json();
        console.error("Server fout:", error);
        throw new Error("Fout bij het toevoegen van de review");
      }
    } catch (error) {
      console.error(error);
      alert("Er is een fout opgetreden bij het toevoegen van de review.");
    }
  }
</script>

<div class="max-w-md mx-auto p-4">
  <h1 class="text-2xl font-bold text-custom-green text-center mb-6">
    Schrijf een Beoordeling
  </h1>

  <p class="text-center text-sm text-gray-600 mb-4">
    Beoordeel dit recept op basis van kosten, moeilijkheid en smaak. Vul de
    onderstaande velden in om je mening te geven.
  </p>

  <form on:submit|preventDefault={submitReview} class="space-y-6">
    <RatingInput
      id="costRating"
      label="Kosten"
      description="Beoordeel de kosten van het recept op een schaal van 1 tot 5, waarbij 1 staat voor 'zeer goedkoop' en 5 voor 'zeer duur'."
      value={costRating}
      onInputChange={(value) => (costRating = value)}
    />
    <RatingInput
      id="difficultyRating"
      label="Moeilijkheid"
      description="Beoordeel de moeilijkheid van het recept op een schaal van 1 tot 5, waarbij 1 staat voor 'heel makkelijk' en 5 voor 'zeer moeilijk'."
      value={difficultyRating}
      onInputChange={(value) => (difficultyRating = value)}
    />
    <RatingInput
      id="tasteRating"
      label="Smaak"
      description="Beoordeel de smaak van het recept op een schaal van 1 tot 5, waarbij 1 staat voor 'slecht' en 5 voor 'uitstekend'."
      value={tasteRating}
      onInputChange={(value) => (tasteRating = value)}
    />

    <button
      type="submit"
      class="w-full bg-custom-green text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-200 mt-4"
    >
      Verzenden
    </button>
  </form>
</div>
