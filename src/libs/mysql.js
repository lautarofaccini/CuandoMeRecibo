import mysql from 'serverless-mysql'

export const conn = mysql({
    config: {
        host: 'localhost',
        user: 'root',
        password: 'Lobito10!',
        port: 3306,
        database: 'cuando_me_recibo'
    }
})