const KEY = "oznake";

function getAll(){
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
}

function saveAll(oznake){
    localStorage.setItem(KEY, JSON.stringify(oznake));
}

export default {
    get: async () => {
        return { success: true, data: getAll() };
    },

    dodaj: async (oznaka) => {
        const oznake = getAll();

        if(!oznake.includes(oznaka)){
            oznake.push(oznaka);
        }

        saveAll(oznake);
    }
};