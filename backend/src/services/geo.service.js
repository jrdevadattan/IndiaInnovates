const Ngo = require('../models/Ngo');
const Report = require('../models/Report');

const assignNgo = async (report) => {
  try {
    const { coordinates } = report.location;
    const { category } = report;

    // Find NGOs that handle this category within 10km, sorted by proximity
    const ngos = await Ngo.find({
      headquarters: {
        $near: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: 10000
        }
      },
      categories: category,
      isVerified: true,
      isActive: true
    }).limit(5);

    if (ngos.length === 0) {
      // Fallback: find any verified NGO within 25km
      return await Ngo.findOne({
        headquarters: {
          $near: {
            $geometry: { type: 'Point', coordinates },
            $maxDistance: 25000
          }
        },
        isVerified: true,
        isActive: true
      });
    }

    // Score NGOs: lower current load = better
    const scored = await Promise.all(ngos.map(async (ngo) => {
      const activeLoad = await Report.countDocuments({
        assignedNgoId: ngo._id,
        status: { $in: ['ASSIGNED', 'IN_PROGRESS'] }
      });
      return { ngo, score: 100 - activeLoad * 10 };
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.ngo || null;
  } catch (err) {
    console.error('Geo assignment error:', err.message);
    return null;
  }
};

module.exports = { assignNgo };
