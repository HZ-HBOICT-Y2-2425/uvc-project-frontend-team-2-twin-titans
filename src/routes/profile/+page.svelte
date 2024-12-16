<script>
    import { goto } from "$app/navigation";
    import { user } from "$lib/store";

    function logOut() {
        user.set(null);
        goto('/');
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Profiel</h1>
        
        <div class="space-y-4">
            <p class="text-gray-700 text-lg">
                <span class="font-semibold">Naam:</span> {$user.name}
            </p>
            <p class="text-gray-700 text-lg">
                <span class="font-semibold">Email:</span> {$user.email}
            </p>
            <p class="text-gray-700 text-lg">
                <span class="font-semibold">Postcode:</span> {$user.zipcode}
            </p>
            <p class="text-gray-700 text-lg">
                <span class="font-semibold">CO2 Bijdrage:</span> {$user.co2Contribution}
            </p>
        </div>

        <a href="/profile/edit" 
            class="inline-block mt-6 text-sm bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Profiel Bewerken
        </a>
        
        <button 
            on:click={() => logOut()} 
            class="mt-6 w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
            Uitloggen
        </button>
    </div>
</div>