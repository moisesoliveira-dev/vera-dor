export const isDevelopment = process.env.NODE_ENV !== 'production';

export const databaseConfig = {
    // Configuração para produção (Railway)
    production: {
        host: 'postgres.railway.internal',
        port: 5432,
        username: 'postgres',
        password: 'RdpmtkgDGbpDvvFJgnUkoEKCxIewremX',
        database: 'railway',
    },

    // Configuração para desenvolvimento local (opcional)
    development: {
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'chatbot_dev',
    },

    // Configuração que será usada
    get current() {
        return isDevelopment ? this.development : this.production;
    }
};
