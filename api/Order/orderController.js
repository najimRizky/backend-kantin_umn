import mongoose from "mongoose"
import errorHandler from "../../helper/errorHandler.js"
import responseParser from "../../helper/responseParser.js"
import Cart from "./../Cart/cartModel.js"
import Order from "./orderModel.js"

const createOrder = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const { cart_id, payment_method } = req.body

        const cart = await Cart.findById(cart_id).populate("items.menu")
        if (!cart) throw Error("||404")

        const newOrder = {
            customer: cart.customer,
            tenant: cart.tenant,
            items: cart.items.map((item) => ({
                menu: item.menu._id,
                quantity: item.quantity,
                price: item.menu.price
            })),
            status: "pending",
            total_price: calculateTotalPrice(cart.items),
            payment_method: payment_method
        }
        const createdOrder = await Order.createOrder(newOrder)
        // await Cart.clearCartById(cart_id)

        await session.commitTransaction()
        session.endSession()

        return responseParser({ data: createdOrder }, res)
    } catch (err) {
        await session.abortTransaction()
        session.endSession()

        return errorHandler(err, res)
    }
}

const confirmOrder = async (req, res) => {
    try {
        const { _id } = req.params
        const tenant_id = req.user._id

        const confirmedOrder = await Order.confirmOrder(_id, tenant_id)

        if (!confirmedOrder) throw Error("||404")

        return responseParser({ status: 200 }, res)

    } catch (err) {
        return errorHandler(err, res)
    }
}

const rejectOrder = async (req, res) => {
    try {
        const { _id } = req.params
        const tenant_id = req.user._id

        const rejectedOrder = await Order.rejectOrder(_id, tenant_id)

        if (!rejectedOrder) throw Error("||404")

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const serveOrder = async (req, res) => {
    try {
        const { _id } = req.params
        const tenant_id = req.user._id

        const servedOrder = await Order.serveOrder(_id, tenant_id)

        if (!servedOrder) throw Error("||404")

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const finishOrder = async (req, res) => {
    try {
        const { _id } = req.params
        const tenant_id = req.user._id

        const completedOrder = await Order.finishOrder(_id, tenant_id)

        if (!completedOrder) throw Error("||404")

        return responseParser({ status: 200 }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const getAllOrder = async (req, res) => {
    try {
        const user_id = req.user._id //Tenant or Customer

        const orders = await Order.find({
            $or: [
                { customer: user_id },
                { tenant: user_id },
            ]
        })

        return responseParser({ status: 200, data: orders }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const user_id = req.user._id //Tenant or Customer
        const { _id } = req.params

        const order = await Order.findOne({
            _id: _id,
            $or: [
                { customer: user_id },
                { tenant: user_id },
            ]
        })

        if (!order) throw Error("||404")

        return responseParser({ status: 200, data: order }, res)
    } catch (err) {
        return errorHandler(err, res)
    }
}

const calculateTotalPrice = (items) => {
    let totalPrice = 0

    items.map((item) => {
        totalPrice += (item.quantity * item.menu.price)
    })

    return totalPrice
}

export default {
    createOrder,
    confirmOrder,
    rejectOrder,
    serveOrder,
    finishOrder,
    getAllOrder,
    getSingleOrder
}