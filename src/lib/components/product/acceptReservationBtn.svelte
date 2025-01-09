<script>
    import { deleteData, putData } from "$lib/dataHandler";
    import { user } from "$lib/store";

    export let product;
    
    async function approveReservation(product) {
        console.log(product);
        user.set(await putData(`http://localhost:3010/user/${product.userID}/addco2?co2=${product.co2Contribution}`));
        await putData(`http://localhost:3010/user/${product.reservedByUserID}/addco2?co2=${product.co2Contribution}`);
        await deleteData(`http://localhost:3010/products/delete/${product.id}/${$user.id}`);
        window.location.reload();
    }
</script>

<button 
    on:click={() => approveReservation(product)} 
    class="bg-green-500 rounded-lg transition-transform transform hover:translate-y-[-2px] hover:shadow-lg cursor-pointer text-center text-white font-bold p-1"
>
    Product is Opgehaald
</button>