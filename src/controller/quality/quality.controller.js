const Quality = require("../../models/Quality");

const geAllQuality = async (req, res) => {
    try {
      const allOrder = await Quality.find();
      res.status(200).json(allOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  module.exports = { geAllQuality };