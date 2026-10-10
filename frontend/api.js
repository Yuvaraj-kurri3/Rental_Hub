const development= "http://localhost:8081";
const production = "https://rentapp-2s3s.onrender.com";

const api = import.meta.env.PROD ? production : development;

export default api;