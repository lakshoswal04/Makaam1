// Configuration file with hardcoded keys
// Replace all process.env references with this config

module.exports = {
    // JWT Secret Key for authentication
    JWTPRIVATEKEY: "2b1e4c7e8f9a0d1c2e3f4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
    
    // MongoDB Connection String
    MONGO_URI: "mongodb+srv://lakshoswal04:lakshoswal040306@cluster1.ntouf11.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
    
    // Password hashing salt rounds
    SALT: 10,
    
    // Groq API Key
    GROQ_API_KEY: "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",
    
    // Server ports (primary and fallbacks)
    PORT: 3000,
    FALLBACK_PORTS: [3001, 3002, 3003]
};
