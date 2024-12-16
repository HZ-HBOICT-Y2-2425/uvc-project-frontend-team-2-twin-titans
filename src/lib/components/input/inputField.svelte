<script>
    export let parameterObject;

    const baseInputClasses = "w-full px-4 py-2 mb-4 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border";
</script>

<input 
    id={parameterObject.id} 
    placeholder={parameterObject.placeholder} 
    type={parameterObject.type} 
    value={parameterObject.value || ""}
    class="{baseInputClasses} {parameterObject.value === "" ? 'border-red-500' : 'border-gray-300'}"
/>