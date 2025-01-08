<script>
    export let id;
    export let label;
    export let description;
    export let value;
    export let onInputChange;
  
    function handleChange(event) {
      const newValue = Number(event.target.value);
      onInputChange(newValue);
    }
  </script>
  
  <div class="flex flex-col">
    <label for={id} class="text-lg font-medium text-gray-700 mb-2">{label}:</label>
    <p class="text-sm text-gray-500 mb-2">{description}</p>
    <input
      type="number"
      id={id}
      bind:value={value}
      min="1"
      max="5"
      class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green w-full {value < 1 || value > 5 ? 'border-red-500' : 'border-gray-300'}"
      required
      on:input={handleChange}
    />
    {#if value < 1 || value > 5}
      <p class="text-red-500 text-sm text-center">De waarde moet tussen 1 en 5 liggen.</p>
    {/if}
  </div>
  