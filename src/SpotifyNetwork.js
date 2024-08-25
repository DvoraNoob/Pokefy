const NetworkModule = {
    // Função getData sem o header de autorização
    getDataWithoutAuth: async (url) => {
        try {
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data without auth:', error);
            throw error; // Re-throw the error for further handling if necessary
        }
    },

    // Função getData com o header de autorização
    getData: async (url, bearer) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + bearer
                }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data with auth:', error);
            throw error; // Re-throw the error for further handling if necessary
        }
    },

    // Função postData para enviar dados via POST
    postData: async (url, data = {}) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error posting data:', error);
            throw error; // Re-throw the error for further handling if necessary
        }
    }
}

export default NetworkModule;
