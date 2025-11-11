import Address from "../models/address.js"

// add address : /api/address/add

export const addAdress = async (req, res) => {
    try {
        const { address, userId } = req.body
        await Address.create({ ...address, userId })
        res.json({ success: true, message: "address added successfully " })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// get address : /api/address/get

export const getAdress = async (req, res) => {
    try {
        const { userId } = req.body
        const addresses = await Address.find({ userId })
        res.json({ success: true, addresses })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
