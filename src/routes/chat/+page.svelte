<script>
    let messages = [
      { id: 1, sender: "You", text: "Dit is een test bericht." },
      { id: 2, sender: "User", text: "Dit is een ander test bericht." },
    ];
  
    let newMessage = "";
    const sendMessage = () => {
      if (newMessage.trim()) {
        messages = [...messages, { id: messages.length + 1, sender: "You", text: newMessage }];
        newMessage = "";
      }
    };
  </script>
  
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">Chat</h1>
    <div class="w-full max-w-lg bg-white shadow-md rounded-lg flex flex-col p-4 space-y-2">
      {#each messages as message}
        <div
          class="p-2 rounded-lg {message.sender === 'You' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}"
        >
          <strong>{message.sender}:</strong> {message.text}
        </div>
      {/each}
    </div>
    <div class="w-full max-w-lg mt-4 flex">
      <input
        type="text"
        bind:value={newMessage}
        placeholder="Type a message..."
        class="flex-grow border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        on:click={sendMessage}
        class="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition"
      >
        Verzenden
      </button>
    </div>
  </div>
  