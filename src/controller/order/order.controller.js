const Event = require("../../models/Event");
const Order = require("../../models/Order");
const User = require("../../models/User");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

// get order by gmail
const getOrderById = async (req, res) => {
  try {
    const gmail = req.params.gmail
    const orders = await Order.find({eventOrganizerEmail: gmail})
    if (orders) {
      res.status(200).send(orders);
    }
    else{
      res.status(404).send({message: "Booking Data Not Found"})
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get a user all orderd events
const myAllOrder = async (req, res) => {
  const userEmail = req.params.email;
  console.log(userEmail)
  try {
    const query = { bookedUserEmail: userEmail }
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


// create Payment
const createPayment = async (req, res) => {
  if (req.method === 'POST') {
      try {
          const { price } = req.body;
          if (!price) {
              return res.status(400).json({ error: "Price is required" });
          }

          const paymentIntent = await stripe.paymentIntents.create({
              amount: parseInt(price * 100), // amount in cents
              currency: 'usd',
              payment_method_types: ['card'],
          });

          res.status(200).json({
              clientSecret: paymentIntent.client_secret,
              success: true,
              message: "Payment intent created successfully",
          });
      } catch (error) {
          console.error("Payment Intent Error:", error.message);
          res.status(500).json({ error: error.message });
      }
  } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { transitionId } = req.params;
    const query = { transitionId: transitionId }; 
    const result = await Order.findOne(query);

    if (!result) {
      return res.status(404).send({ message: "Booking data not found" });
    }

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
};
const metricsForAdminChart = async (req, res) =>{
  try {
    const events = await Event.find({});
    const orders = await Order.find({});
    const user = await User.find({role: "organizer"});
    
    const metrics = {
      totalEvents: events.length,
      totalSales: orders.reduce((acc, order) => acc + order.amount, 0),
      totalTickets: orders.reduce((acc, order) => acc + order?.totalTickets, 0),
      newOrganizers: user.length// Example static data or calculate from your data
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
// monthly-metrics
const monthlyMetrics = async (req, res) =>{
  try {
    const currentYear = new Date().getFullYear();
    
    const eventMetrics = await Event.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$updatedAt" },
          totalEvents: { $sum: 1 },
          newOrganizers: { $addToSet: "$organizer.email" }
        }
      },
      {
        $project: {
          month: "$_id",
          totalEvents: 1,
          newOrganizers: { $size: "$newOrganizers" }
        }
      },
      { $sort: { month: 1 } }
    ]);

    const orderMetrics = await Order.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$updatedAt" },
          ticketSales: { $sum: "$totalTickets" },
          totalSales: { $sum: "$amount" }
        }
      },
      {
        $project: {
          month: "$_id",
          ticketSales: 1,
          totalSales: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    // Combine the results
    const monthlyMetrics = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const eventData = eventMetrics.find(e => e.month === month) || { totalEvents: 0, newOrganizers: 0 };
      const orderData = orderMetrics.find(o => o.month === month) || { ticketSales: 0, totalSales: 0 };
      
      return {
        name: new Date(currentYear, i).toLocaleString('default', { month: 'short' }),
        totalEvents: eventData.totalEvents,
        newOrganizers: eventData.newOrganizers,
        ticketSales: orderData.ticketSales,
        totalSales: orderData.totalSales
      };
    });

    res.json(monthlyMetrics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching monthly metrics", error: error.message });
  }
}


 // payment intent
 const createOrder= async (req, res) => {
  const order = req.body;
  const id=req.params.id
  console.log(id)
    console.log(order,"order api");
  
    try {
      const result = await Order.create(order)
      // const seatUpdate = await Event.updateOne(
      //   { _id: new ObjectId(id) },
      //   { $set: { followers: updateFollowArrayCurrentuser } }
      // );
      res.send({
        success: true,
        paymentResult: { insertedId: result._id },
        message: "Order created successfully",
    });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
}

// module.exports = { getAllOrder, createOrder,createPayment, myAllOrder, refundRequest,getSingleOrder };
module.exports = { getAllOrder, createOrder, getOrderById, metricsForAdminChart, monthlyMetrics, myAllOrder, refundRequest, createPayment,getSingleOrder };
