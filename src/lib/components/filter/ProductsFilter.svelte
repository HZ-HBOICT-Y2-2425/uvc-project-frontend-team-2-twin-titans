<script>
    // Props passed to the component
    export let products = [];
    
    // Local state
    let filteredProducts = [...products];
    let selectedFilter = 'All';
    let selectedCategory = '';
    let selectedAllergies = [];
    let maxPrice = null;
    let minAmount = null;
    let selectedUnit = '';
    let showDropdown = false; // Ensure showDropdown is defined
    
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
    
        // Apply amount filter
        if (minAmount !== null && selectedUnit) {
            filteredProducts = filteredProducts.filter((product) =>
                product.amount >= minAmount && product.unit === selectedUnit
            );
        }
    }
    
    // Ensure filters are applied when the component loads or products are updated
    $: applyFilter();
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
                    {#each [...new Set(products.map((p) => p.consumables))] as category}
                        <option value={category}>{category}</option>
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
                            {#each [...new Set(products.flatMap((p) => p.allergies || []))] as allergy}
                                <label class="flex items-center px-4 py-2">
                                    <input
                                        type="checkbox"
                                        class="mr-2"
                                        checked={selectedAllergies.includes(allergy)}
                                        on:change={() => {
                                            if (selectedAllergies.includes(allergy)) {
                                                selectedAllergies = selectedAllergies.filter((a) => a !== allergy);
                                            } else {
                                                selectedAllergies = [...selectedAllergies, allergy];
                                            }
                                            applyFilter();
                                        }}
                                    />
                                    {allergy}
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
    
            <!-- Amount and Unit Filter -->
            <div>
                <label for="amount" class="block text-sm font-medium mb-1">Min Hoeveelheid:</label>
                <input
                    id="amount"
                    type="number"
                    min="0"
                    bind:value={minAmount}
                    on:input={applyFilter}
                    class="border p-2 rounded w-full"
                    placeholder="Min Hoeveelheid"
                />
            </div>
            <div>
                <label for="unit" class="block text-sm font-medium mb-1">Eenheid:</label>
                <select
                    id="unit"
                    bind:value={selectedUnit}
                    on:change={applyFilter}
                    class="border p-2 rounded w-full"
                >
                    <option value="">Alle eenheden</option>
                    {#each [...new Set(products.map((p) => p.unit))] as unit}
                        <option value={unit}>{unit}</option>
                    {/each}
                </select>
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
    