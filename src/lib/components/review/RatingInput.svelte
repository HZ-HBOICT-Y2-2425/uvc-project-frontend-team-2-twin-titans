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
  <div class="relative w-full">
    <input
      type="range"
      id={id}
      bind:value={value}
      min="1"
      max="5"
      step="1"
      class="w-full accent-custom-green"
      on:input={handleChange}
    />
    <div class="flex justify-between text-sm text-gray-500 mt-1">
      <span>Min: 1</span>
      <span>Max: 5</span>
    </div>
  </div>
  <p class="text-sm text-gray-700 text-center mt-2">Huidige waarde: {value}</p>
  {#if value < 1 || value > 5}
    <p class="text-red-500 text-sm text-center">De waarde moet tussen 1 en 5 liggen.</p>
  {/if}
</div>
