<script>
    import { areFieldsFilled, assignUserInputToFields, communicateWithApi } from "$lib/components/input/formUtils";

    let fieldsFilled = null;
    let passwordConfirm = true;
    let suggestions = [];
    let timeout = null;

    let fields = {
        name: { value: null, placeholder: "Gebruikersnaam" },
        email: { value: null, placeholder: "Email" },
        password: { value: null, placeholder: "Wachtwoord", type: "password" },
        passwordConfirm: { value: null, placeholder: "Bevestig wachtwoord", type: "password" }
    };

    let zipcode = ""; // State voor postcode-input

    // Debounced functie om input te verwerken
    function handleZipcodeInput() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (zipcode.length >= 1) { // Direct starten vanaf het eerste teken
                fetchPostcodeSuggestions(zipcode);
            } else {
                suggestions = [];
            }
        }, 100); // Verlaag debounce-tijd naar 100ms voor snellere reacties
    }

    // Functie om postcode-suggesties op te halen
    async function fetchPostcodeSuggestions(query) {
        const url = `https://nominatim.openstreetmap.org/search?countrycodes=nl&postalcode=${query}&format=json&addressdetails=0&limit=5`;

        try {
            const response = await fetch(url, {
                headers: { "Accept-Language": "nl", "User-Agent": "PostcodeAutocomplete/1.0" }
            });
            const data = await response.json();
            suggestions = data.map(item => item.display_name.split(",")[0]); // Alleen postcode tonen
        } catch (error) {
            console.error("Fout bij ophalen van postcodes:", error);
            suggestions = [];
        }
    }

    // Suggestie selecteren
    function selectSuggestion(suggestion) {
        zipcode = suggestion; // Vul de geselecteerde postcode in
        suggestions = []; // Leeg de suggesties
    }

    // Account aanmaken
    async function createAccount() {
        if (fields.password.value === fields.passwordConfirm.value) {
            passwordConfirm = true;
            const filledFields = { ...fields, zipcode: { value: zipcode } };
            fieldsFilled = areFieldsFilled(filledFields);

            if (fieldsFilled) {
                const url = `http://localhost:3010/user?name=${fields.name.value}&email=${fields.email.value}&password=${fields.password.value}&zipcode=${zipcode}`;
                await communicateWithApi(url, 'POST');
            }
        } else {
            passwordConfirm = false;
        }
    }
</script>

<div class="flex flex-row items-center justify-center min-h-screen bg-gray-100">
    <section class="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Aanmelden</h1>

        <!-- Naam -->
        <input
            type="text"
            placeholder="Gebruikersnaam"
            bind:value={fields.name.value}
            class="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />

        <!-- Email -->
        <input
            type="email"
            placeholder="Email"
            bind:value={fields.email.value}
            class="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />

        <!-- Postcode Input met Autocomplete -->
        <div class="relative mb-4">
            <input
                type="text"
                placeholder="Postcode"
                bind:value={zipcode}
                on:input={handleZipcodeInput}
                class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
            {#if suggestions.length > 0}
                <ul class="absolute z-10 w-full bg-white border rounded-lg mt-1 max-h-40 overflow-auto shadow-lg">
                    {#each suggestions as suggestion}
                        <li
                            class="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-700"
                            on:click={() => selectSuggestion(suggestion)}
                        >
                            {suggestion}
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <!-- Wachtwoord -->
        <input
            type="password"
            placeholder="Wachtwoord"
            bind:value={fields.password.value}
            class="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />

        <!-- Bevestig Wachtwoord -->
        <input
            type="password"
            placeholder="Bevestig wachtwoord"
            bind:value={fields.passwordConfirm.value}
            class="w-full mb-4 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />

        <!-- Foutmeldingen -->
        {#if fieldsFilled === false}
            <p class="text-sm text-red-500 mb-4">Vul alles in</p>
        {:else if !passwordConfirm}
            <p class="text-sm text-red-500 mb-4">Vul hetzelfde wachtwoord 2x in</p>
        {/if}

        <!-- Creeër Account Knop -->
        <button
            on:click={() => createAccount()}
            class="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Creeër Account
        </button>
    </section>
</div>
