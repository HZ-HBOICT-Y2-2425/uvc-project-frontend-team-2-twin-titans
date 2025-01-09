<script>
  import { onMount } from 'svelte';
  import { user } from '../../lib/store'; // User store
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation'; // Navigatie

  let cart = writable([]); // Winkelwagen
  let userId = null; // Gebruikers-ID

  // Laad winkelwagen bij het laden van de pagina
  onMount(() => {
    const unsubscribe = user.subscribe((storedUser) => {
      if (storedUser) {
        userId = storedUser.id; // Gebruikers-ID ophalen
        loadCart(userId); // Winkelwagen laden van server
      } else {
        // Als gebruiker niet is ingelogd, laad winkelwagen uit localStorage
        loadLocalCart();
      }
    });

    return () => unsubscribe();
  });

  // Laad winkelwagen van server voor ingelogde gebruiker
  async function loadCart(userId) {
    try {
      const response = await fetch(`http://localhost:3010/user/${userId}/cart`);
      if (response.ok) {
        const data = await response.json();
        cart.set(data); // Zet de winkelwagen in de writable store
      } else {
        console.error('Probleem bij het ophalen van de winkelwagen.');
      }
    } catch (error) {
      console.error('Fout bij het laden van winkelwagen:', error);
    }
  }

  // Laad winkelwagen uit localStorage voor niet-ingelogde gebruiker
  function loadLocalCart() {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Winkelwagen (localStorage):", localCart);

    // Zorg ervoor dat elk item een id heeft
    localCart.forEach(item => {
      if (!item.id) {
        item.id = Math.random().toString(36).substr(2, 9); // Genereer een unieke id als er geen is
      }
    });

    cart.set(localCart); // Zet de winkelwagen in de writable store
  }

  // Voeg item toe aan winkelwagen
  function addToCart(item) {
    cart.update((currentCart) => {
      const updatedCart = [...currentCart, item];
      if (userId) {
        // Als de gebruiker ingelogd is, sla de winkelwagen op op de server
        saveCartToServer(updatedCart);
      } else {
        // Als de gebruiker niet ingelogd is, sla de winkelwagen lokaal op
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  }

  // Sla de winkelwagen op op de server voor ingelogde gebruiker
  async function saveCartToServer(updatedCart) {
    try {
      const response = await fetch(`http://localhost:3010/user/${userId}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCart),
      });
      if (!response.ok) {
        console.error('Fout bij het opslaan van de winkelwagen op de server');
      }
    } catch (error) {
      console.error('Fout bij het opslaan van winkelwagen op de server:', error);
    }
  }

  // Verwijder item uit winkelwagen
  async function handleRemoveItem(itemId) {
    if (userId) {
      // Als de gebruiker ingelogd is, verwijder item van de server
      try {
        const response = await fetch(`http://localhost:3010/user/${userId}/cart/${itemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          cart.update((currentCart) => {
            const updatedCart = currentCart.filter(item => item.id !== itemId);
            // Sla de gewijzigde winkelwagen op bij ingelogde gebruiker
            saveCartToServer(updatedCart);
            return updatedCart;
          });
        } else {
          console.error('Fout bij het verwijderen van item op de server');
        }
      } catch (error) {
        console.error('Fout bij het verwijderen van item op de server:', error);
      }
    } else {
      // Als de gebruiker niet ingelogd is, verwijder het item uit localStorage
      cart.update((currentCart) => {
        const updatedCart = currentCart.filter(item => item.id !== itemId);
        // Werk localStorage bij
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
  }

  // Download de winkelwagen als tekstbestand
  function downloadCartAsText() {
    const textData = $cart
      .map(item => `${item.name} (${item.amount} ${item.unit})`)
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
      .map(item => `${item.name} (${item.amount} ${item.unit})`)
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

<div class="flex flex-col items-center p-6 bg-gray-50 min-h-screen pt-24">
  <h1 class="text-3xl font-semibold text-green-600 mb-6">Boodschappenlijst</h1>

  {#if $cart.length}
    <div class="w-full max-w-4xl">
      {#each $cart as item, index (item.id || index)}
        <div class="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
          <span class="text-lg text-gray-800">
            {item.name} ({item.amount} {item.unit})
          </span>
          <div class="flex items-center space-x-2">
            <button
              class="text-sm text-white bg-red-500 py-2 px-4 rounded-md hover:bg-red-600 transition"
              on:click={() => handleRemoveItem(item.id)}
              aria-label="Verwijder item"
            >
              🗑️
            </button>
            <button
              class="text-sm text-white bg-blue-500 py-2 px-4 rounded-md hover:bg-blue-600 transition"
              on:click={() => goto(`/products?search=${encodeURIComponent(item.name)}`)}
              aria-label="Bekijk product"
            >
              👁️
            </button>
          </div>
        </div>
      {/each}
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mt-6 space-y-4 sm:space-y-0">
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
