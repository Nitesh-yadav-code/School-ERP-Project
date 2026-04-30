import api from "../axiosSetup";

const accountService = {
    createAccount: (data)=> api.post("/api/v1/create-account", data),
    getAccounts: ()=> api.get("/api/v1/create-account/get-accounts")
}

export default accountService;