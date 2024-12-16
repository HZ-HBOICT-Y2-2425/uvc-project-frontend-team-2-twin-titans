import { writable } from 'svelte/store';

// Maak een winkelwagen store
export const cart = writable([]);

// Haal de gebruikers-ID op (kan bijvoorbeeld uit localStorage komen)
function getUserId() {
  return localStorage.getItem('userId'); // Haal de userId op uit localStorage
}

// Laad de winkelwagen uit de backend op basis van de gebruikers-ID
async function loadCart() {
  const userId = getUserId(); // Haal de userId op

  if (userId) {
    try {
      const response = await fetch(`http://localhost:3010/user/${userId}/cart`); // Fetch from backend
      if (response.ok) {
        const data = await response.json();
        cart.set(data); // Zet de winkelwagen in de store met de data van de server
      } else {
        cart.set([]); // Zet de winkelwagen als leeg als de server een fout teruggeeft
      }
    } catch (error) {
      console.error('Fout bij het laden van winkelwagen:', error);
      cart.set([]); // Stel winkelwagen in op een lege array als er een fout is
    }
  } else {
    // Als er geen gebruiker is ingelogd, haal de winkelwagen uit de algemene localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      cart.set(JSON.parse(savedCart)); // Zet de winkelwagen in de store
    } else {
      cart.set([]); // Als er geen winkelwagen is, stel deze in op een lege array
    }
  }
}

// Sla de winkelwagen op in de backend of localStorage afhankelijk van de gebruikers-ID
async function saveCart() {
  cart.subscribe(async (items) => {
    const userId = getUserId(); // Haal de userId op

    if (userId) {
      // Sla de winkelwagen op per gebruiker naar de server
      try {
        const response = await fetch(`http://localhost:3010/user/${userId}/cart`, {
          method: 'PUT', // Gebruik PUT om de cart te updaten
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(items),
        });

        if (response.ok) {
          console.log('Winkelwagen succesvol opgeslagen op de server');
        } else {
          console.error('Fout bij het opslaan van de winkelwagen op de server');
        }
      } catch (error) {
        console.error('Fout bij het opslaan van de winkelwagen:', error);
      }
    } else {
      // Als er geen gebruiker is ingelogd, sla de winkelwagen op in localStorage
      localStorage.setItem('cart', JSON.stringify(items));
    }
  });
}

// Functie om de winkelwagen te verwijderen of te resetten (alleen als er geen gebruiker is ingelogd)
async function clearLocalCart() {
  const userId = getUserId();

  if (userId) {
    // Als de gebruiker is ingelogd, sla de winkelwagen op per gebruiker
    try {
      const response = await fetch(`http://localhost:3010/user/${userId}/cart`, {
        method: 'DELETE', // Verwijder de cart van de server
      });

      if (response.ok) {
        console.log('Winkelwagen succesvol verwijderd van de server');
      } else {
        console.error('Fout bij het verwijderen van winkelwagen op de server');
      }
    } catch (error) {
      console.error('Fout bij het verwijderen van winkelwagen:', error);
    }
  }

  // Reset de winkelwagen zowel in de store als in localStorage
  cart.set([]);
  if (userId) {
    localStorage.setItem(`cart_${userId}`, JSON.stringify([])); // Reset winkelwagen in localStorage per gebruiker
  } else {
    localStorage.setItem('cart', JSON.stringify([])); // Reset de algemene winkelwagen
  }
}

// Verwijder een item uit de winkelwagen
async function removeItem(itemId) {
  const userId = getUserId();

  if (userId) {
    try {
      const response = await fetch(`http://localhost:3010/user/${userId}/cart/${itemId}`, {
        method: 'DELETE', // Verwijder het item van de server
      });

      if (response.ok) {
        // Update store na succesvolle verwijdering van de server
        const updatedCart = await response.json(); // Haal de bijgewerkte winkelwagen op
        cart.set(updatedCart);
      } else {
        console.error('Fout bij het verwijderen van item van de server');
      }
    } catch (error) {
      console.error('Fout bij het verwijderen van item:', error);
    }
  }
}

// Voeg een item toe aan de winkelwagen
async function addToCart(item) {
  const userId = getUserId();

  if (userId) {
    try {
      const response = await fetch(`http://localhost:3010/user/${userId}/cart`, {
        method: 'POST', // Gebruik POST om een nieuw item toe te voegen
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item), // Verstuur het item naar de backend
      });

      if (response.ok) {
        const updatedCart = await response.json(); // Verkrijg de bijgewerkte winkelwagen van de server
        cart.set(updatedCart); // Werk de store bij met de nieuwe winkelwagen
        console.log('Item succesvol toegevoegd aan de winkelwagen');
      } else {
        console.error('Fout bij het toevoegen van item aan de winkelwagen');
      }
    } catch (error) {
      console.error('Fout bij het verzenden van het item naar de backend:', error);
    }
  } else {
    console.error('Je moet inloggen om een item toe te voegen aan de winkelwagen');
  }
}

export { loadCart, saveCart, clearLocalCart, removeItem, addToCart };
