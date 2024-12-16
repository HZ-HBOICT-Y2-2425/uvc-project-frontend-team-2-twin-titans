<script>
    import { user } from "$lib/store";
    import { loadCart } from "../../stores/cart";  // Zorg ervoor dat we de winkelwagen opnieuw laden

    import Form from "$lib/components/input/form.svelte";
    import { areFieldsFilled, assignUserInputToFields, communicateWithApi } from "$lib/components/input/formUtils";


    let fieldsFilled = null;
    let userFound = true;
    let fields = {
        user: {
            value: null,
            placeholder: "Gebruikersnaam"
        },
        password: {
            value: null,
            placeholder: "Wachtwoord",
            type: "password"
        }
    }

    // Loginfunctie
    async function login() {
        fields = assignUserInputToFields(fields);
        fieldsFilled = areFieldsFilled(fields);
        if (fieldsFilled) {
            const url = `http://localhost:3010/user/login?user=${fields.user.value}&password=${fields.password.value}`
            userFound = true;
            userFound = await communicateWithApi(url, 'GET');
        }
    }

</script>

<div class="flex flex-row items-center justify-center min-h-screen bg-gray-100">
    <section class="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h1 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Inloggen</h1>

        <Form fields={fields}/>

        {#if fieldsFilled === false}
            <p class="text-sm text-red-500 mb-4">Vul alles in</p>
        {:else if !userFound}
            <p class="text-sm text-red-500 mb-4">Wachtwoord of gebruikersnaam incorrect</p>
        {/if}
        
        <button 
            on:click={() => login()} 
            class="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Login
        </button>
    </section>
</div>
