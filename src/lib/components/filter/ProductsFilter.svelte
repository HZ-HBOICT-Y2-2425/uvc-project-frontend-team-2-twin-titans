<script>
    // Props passed to the component
    export let products = [];
    
    // Local state
    let filteredProducts = [...products];
    let selectedCategory = '';
    let selectedAllergies = [];
    let maxPrice = null;
    let minAmount = null;
    let selectedUnit = '';
    let showDropdown = false;
    let userID = 1; // Assuming a dummy userID

    let categories = []; // Add a state variable to hold categories
    let allergiesList = []; // Add a state variable to hold allergies list

    // Apply filters whenever the user changes a filter
    function applyFilter() {
        filteredProducts = [...products];
    
        // Apply category filter
        if (selectedCategory) {
            filteredProducts = filteredProducts.filter((product) => product.consumables === selectedCategory);
        }
    
        // Apply allergy filter
        if (selectedAllergies.length > 0) {
            filteredProducts = filteredProducts.filter((product) =>
                selectedAllergies.every((allergy) => product.allergies?.includes(allergy))
            );
        }
    
        // Apply price filter
        if (maxPrice !== null) {
            filteredProducts = filteredProducts.filter((product) => product.price <= maxPrice);
        }
    }
    
    // Fetch and populate consumables and allergies lists
    async function fetchData() {
        try {
            const response = await fetch('http://localhost:3010/categories/consumables/');
            if (!response.ok) {
                throw new Error('Gefaald om product URLs te laden');
            }

            const categoriesData = await response.json(); // Parse the response as JSON
            console.log('Categories ontvangen:', categoriesData);
            categories = categoriesData; // Update categories state with fetched data

            const allergiesRes = await fetch('http://localhost:3010/allergies');
            if (!allergiesRes.ok) throw new Error('Fout bij het ophalen van allergieën');
            allergiesList = await allergiesRes.json();
        } catch (error) {
            console.error('Er is een fout opgetreden:', error);
        }
    }

    // Ensure filters are applied when the component loads or products are updated
    $: applyFilter();
    $: fetchData();
</script>

<div class="filter-section mb-6">
    <div class="flex flex-wrap gap-4">
        <!-- Category Filter -->
        <div>
            <label for="category" class="block text-sm font-medium mb-1">Categorie:</label>
            <select
                id="category"
                bind:value={selectedCategory}
                on:change={applyFilter}
                class="border p-2 rounded w-full"
            >
                <option value="">Alle categorieën</option>
                {#each categories as category}
                    <option value={category.id}>{category.name}</option>
                {/each}
            </select>
        </div>

        <!-- Allergieën Filter -->
        <div>
            <label for="allergies" class="block text-sm font-medium mb-1">Allergieën:</label>
            <div class="relative">
                <button
                    type="button"
                    on:click={() => (showDropdown = !showDropdown)}
                    class="bg-gray-50 border p-2 rounded w-full text-left"
                >
                    {selectedAllergies.length > 0 ? `${selectedAllergies.length} geselecteerd` : 'Selecteer allergieën'}
                </button>
                {#if showDropdown}
                    <div class="absolute z-10 bg-white border rounded mt-2 max-h-60 overflow-y-auto">
                        {#each allergiesList as allergy}
                            <label class="flex items-center px-4 py-2">
                                <input
                                    type="checkbox"
                                    class="mr-2"
                                    checked={selectedAllergies.includes(allergy.id)}
                                    on:change={() => {
                                        if (selectedAllergies.includes(allergy.id)) {
                                            selectedAllergies = selectedAllergies.filter((a) => a !== allergy.id);
                                        } else {
                                            selectedAllergies = [...selectedAllergies, allergy.id];
                                        }
                                        applyFilter();
                                    }}
                                />
                                {allergy.name}
                            </label>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Price Filter -->
        <div>
            <label for="price" class="block text-sm font-medium mb-1">Max Prijs (€):</label>
            <input
                id="price"
                type="number"
                min="0"
                bind:value={maxPrice}
                on:input={applyFilter}
                class="border p-2 rounded w-full"
                placeholder="Max Prijs"
            />
        </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {#if filteredProducts.length > 0}
            {#each filteredProducts as product (product.id)}
                <div
                    class="border rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg cursor-pointer transition-transform transform hover:translate-y-[-5px]"
                    on:click={() => window.location.href = `/products/${product.id}`}
                >
                    <img
                        src="https://via.placeholder.com/400x200"
                        alt="{product.title}"
                        class="w-full h-48 object-cover"
                    />
                    <div class="p-4">
                        <h2 class="text-lg font-bold text-green-700 mb-2">{product.title}</h2>
                        <p class="text-green-700 font-bold text-base mb-2">€{product.price.toFixed(2)}</p>
                        <p class="text-gray-700 text-sm truncate">{product.description.slice(0, 100)}...</p>
                    </div>
                </div>
            {/each}
        {:else}
            <p class="text-gray-600 text-center w-full">Geen producten gevonden.</p>
        {/if}
    </div>
</div>
