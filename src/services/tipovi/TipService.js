import { tipovi } from "./TipPodaci";

// 1/4 Read od CRUD
async function get() {
    return {data: tipovi}
}


export default{
    get
}