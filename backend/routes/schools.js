const express = require("express");
const router = express.Router();
const db = require("../db");

// Add School
router.post("/addSchool", (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validate input
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  });
});

module.exports = router;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (deg) => deg * (Math.PI / 180);
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

router.get("/listSchools", (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  db.query("SELECT * FROM schools", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    const schoolsWithDistance = results.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  });
});

module.exports = router;
