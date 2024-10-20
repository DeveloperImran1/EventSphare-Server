const User = require("../../models/User");

const getSingleUser = async (req, res) => {
  try {
    const query = {
      email: req.params.email
    };

    // Step 1: Find the user by email
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }

    // Step 2: Query for followers by their emails
    const followers = await User.find({ email: { $in: user.followers } }); // Fetch followers' details by email

    // Step 3: Attach the populated followers to the user object
    const userWithFollowers = {
      ...user.toObject(),
      followers // Replace followers array with populated user data
    };

    res.send(userWithFollowers);    

  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};


const createUser = async (req, res) => {

  const user = req.body;
  try {

    await User.create(user)
    res.send({
      success: true,
      message: "Created successfull",
    })
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    })
  }
};

// update user
const updateUser = async (req, res) => {
  try {

    const result = await User.updateOne(
      { email: req?.params?.email },
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          city: req.body.city,
          country: req.body.country,
          gender: req.body.gender,
          skills: req.body.skills,
          specialty: req.body.specialty,
        }
      },
      { upsert: false, runValidators: true }
    )
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

// followes add korar api

const addedFollower = async (req, res) => {
  const { dynamicUserEmail, currentUserEmail, updateFollowArrayDynamicUser, updateFollowArrayCurrentuser } = req.body;
  console.log("this is a requested put request", req.body)

  try {
    // Update the dynamic user's follower list
    const dynamicUserUpdate = await User.updateOne(
      { email: dynamicUserEmail },
      { $set: { followers: updateFollowArrayDynamicUser } }
    );

    // Update the current user's following list
    const currentUserUpdate = await User.updateOne(
      { email: currentUserEmail },
      { $set: { followers: updateFollowArrayCurrentuser } }
    );

    // Check if both updates were successful
    if (dynamicUserUpdate.modifiedCount > 0 && currentUserUpdate.modifiedCount > 0) {
      res.status(200).json({ message: 'Successfully followed!', modifiedCount: 1 });
    } else {
      res.status(400).json({ message: 'Failed to follow.' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSingleUser, createUser, updateUser, addedFollower }; 