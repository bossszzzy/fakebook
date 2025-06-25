import dotenv from 'dotenv'
import app from './app.js'
import shutdown from './utils/shutdown.util.js'
import prisma from './config/prisma.config.js'

dotenv.config()

const PORT = process.env.PORT || 8000

app.listen(PORT, ()=>console.log('Server on :', PORT))

process.on("SIGINT", ()=>	shutdown('SIGINT'))
process.on("SIGTERM", ()=>	shutdown('SIGTERM'))

process.on("uncaughtException", ()=>	shutdown('uncaughtException'))
process.on("unhandledRejection", ()=>	shutdown('unhandledRejection'))



