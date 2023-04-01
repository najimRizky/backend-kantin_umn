import "./config/loadEnv.js"

/** @Library */ 
import express from "express"
import mongoose from "mongoose"
import cors from "cors"

/** @Function */ 
import responseParser from "./helper/responseParser.js"
import connectDatabase from "./database/connectDatabase.js"
import serverListen from "./server/serverListen.js"
import requestLogger from "./server/requestLogger.js" 

/** @Routes */
import uploadRoutes from "./api/Upload/uploadRoutes.js"
import customerRoutes from "./api/Customer/customerRoutes.js"
import accountRoutes from "./api/Account/accountRoutes.js"
import tenantRoutes from "./api/Tenant/tenantRoutes.js"
import menuRoutes from "./api/Menu/menuRoutes.js"
import otherRoutes from "./api/Other/otherRoutes.js"
import cartRoutes from "./api/Cart/cartRoutes.js"

/** @Initialization */ 
const server = express()
server.use(express.json())
server.set('view engine', 'ejs');
server.use(requestLogger)
server.use(cors())

server.get('/', (_, res) => {
    return responseParser({ data: "REST API Kantin UMN", status: 200 }, res)
})
server.use("/", otherRoutes)
server.use("/upload", uploadRoutes)
server.use("/customer", customerRoutes)
server.use("/account", accountRoutes)
server.use("/tenant", tenantRoutes)
server.use("/menu", menuRoutes)
server.use("/cart", cartRoutes)

const ENABLE_DB = eval(process.env.ENABLE_DB)
if (ENABLE_DB) {
    connectDatabase(mongoose, server)
} else {
    serverListen(server)
}