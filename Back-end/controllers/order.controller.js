import {Order} from "../models/order.model.js";

export const OrderData = async (req, res) => {
    const data = req.body;
    try {
        const order = await Order.create(data);
        //console.log(order);
        res.status(201).json({ message: "Ordered Successfully", order });
    } catch (error) {
        res.status(401).json({ error: "Error in Ordering Data" ,error});
    }
};