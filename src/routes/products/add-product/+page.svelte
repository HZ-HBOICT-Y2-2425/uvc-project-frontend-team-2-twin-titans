<script>
    import { user } from "$lib/store"; // Importeer de user store
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let title = "";
    let consumables = ""; 
    let selectedAllergies = []; 
    let price = "";
    let amount = "";
    let unit = "";
    let description = "";
    let consumablesList = [];
    let allergiesList = [];
    let showDropdown = false; // Voor het tonen van de allergieën dropdown
    let showPopup = false; // Popup na succesvolle toevoeging
    let image = null; // Voor het opslaan van de geüploade afbeelding

    let errors = {
        title: false,
        consumables: false,
        price: false,
        amount: false,
        unit: false,
        description: false,
    };

    $: userID = $user?.id || 1; // Dummy userID als fallback

    // Ophalen van data voor categorieën en allergieën
    async function fetchData() {
        try {
            const consumablesRes = await fetch(
                "http://localhost:3010/categories/consumables",
            );
            if (!consumablesRes.ok)
                throw new Error("Fout bij het ophalen van consumables");
            consumablesList = await consumablesRes.json();

            const allergiesRes = await fetch(
                "http://localhost:3010/categories/allergies",
            );
            if (!allergiesRes.ok)
                throw new Error("Fout bij het ophalen van allergieën");
            allergiesList = await allergiesRes.json();
        } catch (error) {
            console.error("Er is een fout opgetreden:", error);
        }
    }

    onMount(fetchData);

    // Validatie van velden
    function validateFields() {
        errors.title = !title;
        errors.consumables = !consumables;
        errors.price = !price || price <= 0;
        errors.amount = !amount || amount <= 0;
        errors.unit = !unit;
        errors.description = !description;
    }

    // Product toevoegen 
    async function addProduct() {
        validateFields();
        if (Object.values(errors).includes(true)) {
            alert("Alle velden zijn verplicht en moeten correct zijn!");
            return;
        }

        try {
            const productData = {
                userID, 
                title, 
                consumables, 
                allergies: selectedAllergies.length > 0 ? selectedAllergies.join(",") : "", 
                price: parseFloat(price), 
                amount: parseFloat(amount), 
                unit,
                description, 
            };

            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                formData.append(key, productData[key]);
            });

            if (image) {
                formData.append("image", image);
            }

            const res = await fetch("http://localhost:3010/products/create", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                showPopup = true;
                setTimeout(() => {
                    goto('/products');
                }, 2000);
            } else {
                alert('Fout bij het toevoegen van het product.');
            }
        } catch (error) {
            console.error('Er is een fout opgetreden:', error);
        }
    }

    // Toggle voor het toevoegen/verwijderen van allergieën
    function toggleAllergy(allergyId) {
        if (selectedAllergies.includes(allergyId)) {
            selectedAllergies = selectedAllergies.filter(id => id !== allergyId);
        } else {
            selectedAllergies.push(allergyId);
        }
    }

    // Verwerken van bestand bij bestandselectie
    function handleFileChange(event) {
        image = event.target.files[0];
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Nieuw product toevoegen</h1>
    <form on:submit|preventDefault={addProduct} class="space-y-4">
        <div>
            <label for="title" class="block mb-1 font-medium">Titel:</label>
            <input
                id="title"
                bind:value={title}
                class="border p-2 w-full {errors.title ? 'border-red-500' : 'border-gray-300'}"
                type="text"
                placeholder="Titel"
                required
            />
        </div>
        <div>
            <label for="consumables" class="block mb-1 font-medium">Categorie:</label>
            <select
                id="consumables"
                bind:value={consumables}
                class="border p-2 w-full {errors.consumables ? 'border-red-500' : 'border-gray-300'}"
                required
            >
                <option value="" disabled>Selecteer een categorie</option>
                {#each consumablesList as consumable}
                    <option value={consumable.id}>{consumable.name}</option>
                {/each}
            </select>
        </div>
        <div>
            <label for="allergies" class="block text-sm font-medium text-gray-700 mb-1">Allergieën</label>
            <div class="relative">
                <button
                    type="button"
                    on:click={() => (showDropdown = !showDropdown)}
                    class="w-full bg-gray-50 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 text-left"
                >
                    {#if selectedAllergies.length > 0}
                        {selectedAllergies.length} geselecteerd
                    {:else}
                        Selecteer allergieën
                    {/if}
                </button>
                {#if showDropdown}
                    <div class="absolute z-10 bg-white border rounded-md shadow-lg mt-2 w-full max-h-60 overflow-y-auto">
                        {#each allergiesList as allergy}
                            <label class="flex items-center px-4 py-2 hover:bg-gray-100">
                                <input
                                    type="checkbox"
                                    class="mr-2"
                                    checked={selectedAllergies.includes(allergy.id)}
                                    on:change={() => toggleAllergy(allergy.id)}
                                />
                                {allergy.name}
                            </label>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
        <div>
            <label for="price" class="block mb-1 font-medium">Prijs (€):</label>
            <input
                id="price"
                bind:value={price}
                class="border p-2 w-full {errors.price ? 'border-red-500' : 'border-gray-300'}"
                type="number"
                step="0.01"
                placeholder="Prijs"
                required
            />
        </div>
        <div>
            <label for="amount" class="block mb-1 font-medium">Hoeveelheid:</label>
            <input
                id="amount"
                bind:value={amount}
                class="border p-2 w-full {errors.amount ? 'border-red-500' : 'border-gray-300'}"
                type="number"
                placeholder="Hoeveelheid"
                required
            />
        </div>
        <div>
            <label for="unit" class="block mb-1 font-medium">Eenheid:</label>
            <select
                id="unit"
                bind:value={unit}
                class="border p-2 w-full {errors.unit ? 'border-red-500' : 'border-gray-300'}"
                required
            >
                <option value="" disabled>Selecteer een eenheid</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="l">Liter (l)</option>
                <option value="ml">Milliliter (ml)</option>
            </select>
        </div>
        <div>
            <label for="description" class="block mb-1 font-medium">Beschrijving:</label>
            <textarea
                id="description"
                bind:value={description}
                class="border p-2 w-full {errors.description ? 'border-red-500' : 'border-gray-300'}"
                placeholder="Beschrijving"
                required
            ></textarea>
        </div>

        <!-- Afbeelding Uploaden (optioneel) -->
        <div>
            <label for="image" class="block mb-1 font-medium">Afbeelding (optioneel):</label>
            <input
                type="file"
                id="image"
                accept="image/*"
                on:change={handleFileChange}
                class="border p-2 w-full"
            />
        </div>

        <button class="bg-blue-500 text-white p-2 rounded mt-4 w-full md:w-auto">Toevoegen</button>
    </form>

    {#if showPopup}
        <div class="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-4 rounded shadow-md text-center">
                <p class="text-lg font-semibold">Product toegevoegd!</p>
            </div>
        </div>
    {/if}
</div>
