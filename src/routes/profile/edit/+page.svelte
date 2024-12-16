<script>
    import { goto } from "$app/navigation";
    import Form from "$lib/components/input/form.svelte";
    import { areFieldsFilled, assignUserInputToFields, communicateWithApi } from "$lib/components/input/formUtils";
    import { user } from "$lib/store";

    let fieldsFilled = null;
    let passwordConfirm = true;
    let fields = {
        name: {
            value: $user.name,
            placeholder: "Gebruikersnaam"
        },
        email: {
            value: $user.email,
            placeholder: "Email"
        },
        zipcode: {
            value: $user.zipcode,
            placeholder: "Postcode"
        },
        password: {
            value: $user.password,
            placeholder: "Wachtwoord",
            type: "password"
        },
        passwordConfirm: {
            value: $user.password,
            placeholder: "Bevestig wachtwoord",
            type: "password"
        }
    }

    async function editAccount() {
        fields = assignUserInputToFields(fields);
        if (fields.password.value === fields.passwordConfirm.value) {
            passwordConfirm = true;
            fieldsFilled = areFieldsFilled(fields)
            if (fieldsFilled) {
                const url = `http://localhost:3010/user/${$user.id}?name=${fields.name.value}&email=${fields.email.value}&password=${fields.password.value}&zipcode=${fields.zipcode.value}`;
                await communicateWithApi(url, 'PATCH', '/profile');
            }
        } else {
            passwordConfirm = false;
        }
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Profiel</h1>

        <Form fields={fields} />

        {#if fieldsFilled === false}
            <p class="text-sm text-red-500 mb-4">Vul alles in</p>
        {:else if !passwordConfirm}
            <p class="text-sm text-red-500 mb-4">Vul hetzelfde wachtwoord 2x in</p>
        {/if}
       
        <button 
            on:click={() => editAccount()} 
            class="mt-6 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Update Profiel
        </button>
    </div>
</div>