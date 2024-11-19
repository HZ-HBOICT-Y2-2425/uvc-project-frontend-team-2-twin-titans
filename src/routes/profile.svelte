<script>
    let user = {
        name: "John Doe",
        email: "john.doe@example.com",
        bio: "I love coding and exploring new technologies."
    };

    let editing = false;

    function saveProfile() {
        alert("Profile saved!");
        editing = false;
    }
</script>

<style>
    .profile {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #f9f9f9;
    }

    .profile h2 {
        margin-bottom: 20px;
    }

    .profile p {
        margin: 5px 0;
    }

    .profile button {
        margin-top: 20px;
        padding: 10px 15px;
        background: limegreen;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .profile button.cancel {
        background: gray;
        margin-left: 10px;
    }

    .profile input,
    .profile textarea {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>

<div class="profile">
    {#if !editing}
        <h2>Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Bio:</strong> {user.bio}</p>
        <button on:click={() => (editing = true)}>Edit Profile</button>
    {:else}
        <h2>Edit Profile</h2>
        <label>
            Name:
            <input type="text" bind:value={user.name} />
        </label>
        <label>
            Email:
            <input type="email" bind:value={user.email} />
        </label>
        <label>
            Bio:
            <textarea bind:value={user.bio}></textarea>
        </label>
        <button on:click={saveProfile}>Save</button>
        <button class="cancel" on:click={() => (editing = false)}>Cancel</button>
    {/if}
</div>
