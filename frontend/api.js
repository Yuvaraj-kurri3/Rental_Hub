const development= "http://localhost:8081";
const production = "https://rental-hub-zhqe.onrender.com";

const api = import.meta.env.PROD ? production : development;

export default api;