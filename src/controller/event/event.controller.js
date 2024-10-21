const Event = require("../../models/Event");
const { ObjectId } = require('mongodb');
const { startOfToday, addDays, startOfWeek, addMonths } = require('date-fns');

const getAllEvent = async (req, res) => {
  const {
    category,
    minimumPrice,
    maximumPrice,
    type,
    country,
    city,
    startDate,
    endDate,
    search,
    day, // Day filter parameter
    limit = 6,
    page = 1,
  } = req.query;

  const filters = {};

  // Category filter
  if (category) {
    filters.category = category;
  }

  // Type filter
  if (type) {
    filters.type = type;
  }

  // Location filters
  if (country) {
    filters['location.country'] = country;
  }
  if (city) {
    filters['location.city'] = city;
  }

  // Date filters
  if (startDate || endDate) {
    filters.dateTime = {};

    if (startDate) {
      filters.dateTime.$gte = new Date(startDate);
    }

    if (endDate) {
      filters.dateTime.$lte = new Date(endDate);
    }
  }

  // Day filter
  if (day) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999); // End of tomorrow

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of the current week
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of the week
    weekEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0); // Start of the current month

    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999); // End of the current month

    filters.dateTime = {}; // Initialize the dateTime filter

    switch (day.toLowerCase()) {
      case "today":
        filters.dateTime.$gte = today;
        filters.dateTime.$lte = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1); // End of today
        break;
      case "tomorrow":
        filters.dateTime.$gte = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        filters.dateTime.$lte = tomorrow;
        break;
      case "this_week":
        filters.dateTime.$gte = weekStart;
        filters.dateTime.$lte = weekEnd;
        break;
      case "this_month":
        filters.dateTime.$gte = monthStart;
        filters.dateTime.$lte = monthEnd;
        break;
      case "all":
        delete filters.dateTime; // If "all" is selected, remove dateTime filter
        break;
      default:
        delete filters.dateTime;
    }
  }




  // Search filter
  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Price filters
  if (minimumPrice || maximumPrice) {
    filters.price = {};
    if (minimumPrice) filters.price.$gte = Number(minimumPrice);
    if (maximumPrice) filters.price.$lte = Number(maximumPrice);
  }

  const itemsPerPage = parseInt(limit); // Number of items per page
  const currentPage = parseInt(page); // Current page number

  try {
    // Counting total events
    const totalEvents = await Event.countDocuments(filters);

    // Finding filtered events with pagination
    const events = await Event.find(filters)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.json({
      totalEvents,
      currentPage,
      totalPages: Math.ceil(totalEvents / itemsPerPage),
      events,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getSingleEvent = async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await Event.findOne(query);

    if (!result) {
      return res.status(404).send({ message: "Event Not Found" });
    }

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
};

const getPopularEvents = async (req, res) => {
  try {
    const popularEvents = await Event.aggregate([
      {
        $addFields: {
          bookedSeatsCount: { $size: { $ifNull: ["$bookedSeats", []] } }
        }
      },
      {
        $sort: { bookedSeatsCount: -1 }
      },
      {
        $limit: 6
      }
    ]);
    

    res.status(200).json(popularEvents);
  } catch (error) {
    console.error("Error fetching popular events:", error);
    res.status(500).json({ message: "Something went wrong popular events" });
  }
};




const getBookedSeatUpdate = async (req, res) => {
  try {
    const { eventId, newBookedSeats } = req.body;

    // Update the events collection to add the new booked seats
    const result = await Event.updateOne(
      { _id: new ObjectId(eventId) },
      { $addToSet: { bookedSeats: { $each: newBookedSeats } } }
    );

    if (result.modifiedCount > 0) {
      res.send({ success: true, message: 'Booked seats updated successfully' });
    } else {
      res.send({ success: false, message: 'No changes were made' });
    }
  } catch (error) {
    console.error('Error updating booked seats:', error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
};

// Create Event
const getMyEvent = async (req, res) => {
  try {
    const { email } = req?.params;
    const query = { "contactInfo.email": email }
    const result = await Event.find(query)
    if (!result) {
      return res.status(404).send({ message: "Your event not found" })
    }
    res.send(result)
  }
  catch (error) {
    res.status(500).send({ message: error.message })
  }
}

// get event by category
const getCategoryEvent = async (req, res) => {
  const { category } = req.params;
  console.log(category)
  const query = { category: category }
  try {
    if (category === "All") {
      const result = await Event.find()
      if (!result) {
        return res.status(404).send({ message: "This category event not found" })
      }
      res.send(result)
    }
    else {
      const result = await Event.find(query)
      if (!result) {
        return res.status(404).send({ message: "This category event not found" })
      }
      res.send(result)
    }

  }
  catch (error) {
    res.status(500).send({ message: error.message })
  }
}

// get event by email
const getEventsByEmail = async () => {

}

// create user
const createEvent = async (req, res) => {
  const event = req.body;
  try {
    await Event.create(event);
    res.send({
      success: true,
      message: "Created Successful",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// module.exports = { getAllEvent, createEvent, getSingleEvent };
module.exports = { getAllEvent, createEvent, getSingleEvent, getMyEvent, getCategoryEvent, getBookedSeatUpdate, getPopularEvents };
