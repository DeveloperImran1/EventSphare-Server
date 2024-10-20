const Order = require("../../models/Order");
const { ObjectId } = require("mongodb");

// All order get korar api
const getAllOrder = async (req, res) => {
  try {
    const allOrder = await Order.find();
    res.status(200).json(allOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get a user all orderd events
const myAllOrder = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const query = { bookedUserEmail: userEmail }
    const allOrder = await Order.find(query)
    res.status(200).json(allOrder);
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
}
// get a user all orderd events
const getOrganizerOrder= async (req, res) => {
  const organizerrEmail = req.params.email;

  try {
    const query = { eventOrganizerEmail: organizerrEmail }
    const allOrder = await Order.find(query)
    res.status(200).json(allOrder);
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// refund request
const refundRequest = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  const query = { _id: new ObjectId(id) }
  try {
    const resp = await Order.updateOne(
      query, {
      $set: {
        refundRequested: "Requested"
      }
    }, { upsert: false, runValidators: true })
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// create user
const createOrder = async (req, res) => {
  const order = req.body;
  console.log(order);

  try {
    await Order.create(order);
    res.send({
      success: true,
      message: "Created successfull",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { getAllOrder, createOrder, myAllOrder, refundRequest,getOrganizerOrder };
