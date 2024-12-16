<script>
    import InputField from "./inputField.svelte";

    export let fields;
    let keys = Object.keys(fields);
    
</script>

{#each keys as key}
    <InputField parameterObject={{
        id: key,
        placeholder: fields[key].placeholder || 'placeholder',
        type: fields[key].type || 'text',
        value: fields[key].value
    }}/>
{/each}