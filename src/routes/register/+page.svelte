<script>
    import Form from "$lib/components/input/form.svelte";
    import { areFieldsFilled, assignUserInputToFields, communicateWithApi } from "$lib/components/input/formUtils";

    let fieldsFilled = null;
    let passwordConfirm = true;
    let fields = {
        name: {
            value: null,
            placeholder: "Gebruikersnaam"
        },
        email: {
            value: null,
            placeholder: "Email"
        },
        zipcode: {
            value: null,
            placeholder: "Postcode"
        },
        password: {
            value: null,
            placeholder: "Wachtwoord",
            type: "password"
        },
        passwordConfirm: {
            value: null,
            placeholder: "Bevestig wachtwoord",
            type:"password"
        }
    }

    async function createAccount() {
        fields = assignUserInputToFields(fields);
        if (fields.password.value === fields.passwordConfirm.value) {
            passwordConfirm = true;
            fieldsFilled = areFieldsFilled(fields)
            if (fieldsFilled) {
                const url = `http://localhost:3010/user?name=${fields.name.value}&email=${fields.email.value}&password=${fields.password.value}&zipcode=${fields.zipcode.value}`;
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

        <Form fields={fields} />

        {#if fieldsFilled === false}
            <p class="text-sm text-red-500 mb-4">Vul alles in</p>
        {:else if !passwordConfirm}
            <p class="text-sm text-red-500 mb-4">Vul hetzelfde wachtwoord 2x in</p>
        {/if}
        
        <button 
            on:click={() => createAccount()} 
            class="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Creeër Account
        </button>
    </section>
</div>