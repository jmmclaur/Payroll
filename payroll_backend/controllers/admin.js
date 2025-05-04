const searchPayCycles = async (req, res) => {
  try {
    const query = {};

    // Handle text search for companyCode or _id (contractId)
    if (req.query.searchTerm) {
      //$or searches for companyCode or mongodb_id (contractId)
      query.$or = [
        { companyCode: { $regex: req.query.searchTerm, $options: "i" } },
        {
          _id: mongoose.Types.ObjectId.isValid(req.query.searchTerm)
            ? mongoose.Types.ObjectId(req.query.searchTerm)
            : null,
        },
      ];
    }

    // Add other filter conditions
    if (req.query.payGroup) {
      query.payGroup = req.query.payGroup;
    }
    if (req.query.frequency) {
      query.frequency = req.query.frequency;
    }

    // Date range filters
    if (req.query.startDate) {
      query.startDate = {
        $gte: new Date(req.query.startDate),
      };
    }
    if (req.query.endDate) {
      query.endDate = {
        $lte: new Date(req.query.endDate),
      };
    }

    // Find payCycles with the query and sort by payGroup
    const payCycles = await PayCycle.find(query)
      .sort({ payGroup: 1 }) // 1 for ascending alphabetical order
      .exec();

    res.status(200).json({
      success: true,
      count: payCycles.length,
      data: payCycles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
