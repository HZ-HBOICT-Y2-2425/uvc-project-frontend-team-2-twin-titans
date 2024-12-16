<script>
  import { cart, loadCart, saveCart, clearLocalCart, removeItem } from '../../stores/cart'; // Winkelwagen store
  import { onMount } from 'svelte'; // Importeer onMount om de winkelwagen te laden bij het inladen van de eerste keer

  // Laad de winkelwagen bij het inladen van de pagina
  onMount(() => {
    loadCart(); // Laad winkelwagen uit backend
  });

  // Verwijder item uit winkelwagen
  function handleRemoveItem(id) {
    removeItem(id); // Verwijder het item zowel van de frontend als de backend
  }

  // Leeg de winkelwagen
  function clearCart() {
    clearLocalCart(); // Verwijder winkelwagen uit server en localStorage
  }

  // Download de winkelwagen als tekstbestand
  function downloadCartAsText() {
    const textData = $cart
      .map(item => `${item.name} (${item.amount} ${item.unit})`)  // Toon de hoeveelheid zonder vermenigvuldigen met het aantal personen
      .join('\n');

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Boodschappenlijst.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Deel de winkelwagen (met de share API)
  async function shareCart() {
    const textData = $cart
      .map(item => `${item.name} (${item.amount} ${item.unit})`)  // Toon de hoeveelheid zonder vermenigvuldigen met het aantal personen
      .join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mijn Boodschappenlijst',
          text: textData,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Delen wordt niet ondersteund op jouw apparaat.');
    }
  }
</script>

<div class="flex flex-col items-center p-6 bg-gray-50 min-h-screen font-sans">
  <h1 class="text-3xl font-semibold text-green-600 mb-6">Winkelwagen</h1>

  {#if $cart.length}
    <div class="w-full max-w-md">
      {#each $cart as item (item.id)}
        <div class="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
          <span class="text-lg text-gray-800">
            {item.name} ({item.amount} {item.unit})  <!-- Toon de hoeveelheid zonder vermenigvuldigen met het aantal personen -->
          </span>
          <div class="flex items-center space-x-2">
            <button
              class="text-sm text-white bg-red-500 py-1 px-3 rounded-md hover:bg-red-600 transition"
              on:click={() => handleRemoveItem(item.id)}
              aria-label="Remove item"
            >
              🗑️
            </button>
          </div>
        </div>
      {/each}
    </div>

    <div class="flex items-center space-x-6 mt-6">
      <button
        class="text-2xl text-gray-600 hover:text-gray-800"
        on:click={downloadCartAsText}
        aria-label="Download cart as text"
      >
        ⬇️
      </button>
      <button
        class="text-2xl text-gray-600 hover:text-gray-800"
        on:click={shareCart}
        aria-label="Share cart"
      >
        🔗
      </button>
    </div>

  {:else}
    <p class="text-gray-500">Je winkelmand is leeg!</p>
  {/if}
</div>
