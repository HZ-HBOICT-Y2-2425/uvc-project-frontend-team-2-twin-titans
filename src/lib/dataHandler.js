export const getData = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) { throw new Error('Gefaald om URL te laden'); }
        let data = await res.json();
        return data;
    } catch (error) {
        console.error('Error bij het laden:', error);
    }
}

export const postData = async (url) => {
    try {
        const res = await fetch(url, { method: 'POST'});
        if (!res.ok) { throw new Error('Gefaald om URL te laden'); }
        let data = await res.json();
        return data;
    } catch (error) {
        console.error('Error bij het laden:', error);
    }
}

export const putData = async (url) => {
    try {
        const res = await fetch(url, { method: 'PUT'});
        if (!res.ok) { throw new Error('Gefaald om URL te laden'); }
        let data = await res.json();
        return data;
    } catch (error) {
        console.error('Error bij het laden:', error);
    }
}

export const deleteData = async (url) => {
    try {
        const res = await fetch(url, { method: 'DELETE'});
        if (!res.ok) { throw new Error('Gefaald om URL te laden'); }
    } catch (error) {
        console.error('Error bij het laden:', error);
    }
}

export const getDataUrls = async (urls) => {
    return await Promise.all(
        urls.map(async (url) => {
            return await getData(`http://localhost:3010/${url}`)
        })
    );
}

export const reserve = async (product, user) => {
    await putData(`http://localhost:3010/products/reserve/${product.id}/${product.userID}/${user.id}`);
    window.location.reload();
}

export const unreserve = async(product) => {
    await putData(`http://localhost:3010/products/unreserve/${product.id}/${product.userID}`);
    window.location.reload();
}