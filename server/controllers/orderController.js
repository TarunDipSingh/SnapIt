import Order from "../models/order.js"
import Product from "../models/product.js"
import stripe from "stripe";
import User  from "../models/User.js"

// Place order Stripe : api/order/stripe

export const placeOrderStripe = async (req, res) => {

    try {
        const { userId, items, address } = req.body
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: 'Invalid Data' })
        }
        let productData = [];
        // calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            })
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        // add tax charge (2%)
        amount += Math.floor(amount * 0.02)

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online"
        })

        // Stripe Gateway Initialise

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        // Create line items for line

        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })

        // Create Session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.json({ success: true, url: session.url });
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Stripe Webhook to Verify Payment Action : /stripe
export const stripeWebhooks = async (req, res) => {
    // Stripe Gateway intialisation  
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

    const sig = req.headers["stripe-signature"]
    let event;

    try {
        event = stripeInstance.webhooks.cconstructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )

    } catch (error) {
        res.status(400).send(`Webhook Error: ${error.message}`)
    }

    // handle the event
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.session.llist({
                payment_intent: paymentIntentId,
            })

            const { orderId, userId } = session.data[0].metadata
            // Mark Payment as Paid 
            await Order.findByIdAndUpdate(orderId, { isPaid: true })
            // Clear User Cart
            await User.findByIdAndUpdate(userId, { cartItems: {} })
            break;
        }

        case "payment_intent.payment_failed": {
             const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.session.llist({
                payment_intent: paymentIntentId,
            })

            const { orderID } = session.data[0].metadata
            await Order.findByIdAndUpdate(orderId)
            break;
        }

        default:
            console.error(`Unheandled event type ${event.type}`)
            break;
    }
}

// Place order COD : api/order/cod
export const placeOrderCOD = async (req, res) => {

    try {
        const { userId, items, address } = req.body
        if (!address || items.length === 0) {
            return res.json({ success: false, message: 'Invalid Data' })
        }
        // calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        // add tax charge (2%)
        amount += Math.floor(amount * 0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        })

        return res.json({ success: true, message: "Order Placed Successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// get order by user ID : /api/order/user

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })

        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get All Orders (for seller / admin ) : /api/order.seller

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}