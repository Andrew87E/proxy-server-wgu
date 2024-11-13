const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const GEONAMES_USERNAME = "YOUR_GEONAMES_USERNAME";

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/geonames", async (req, res) => {
  const { countryCode, stateCode, featureCode, maxRows = 1 } = req.body;

  // Validate required parameters
  if (!countryCode || !stateCode || !featureCode) {
    return res.status(400).json({
      error: "Missing required fields: 'countryCode', 'stateCode', and 'featureCode'",
    });
  }

  // Construct the GeoNames URL
  const url = `http://api.geonames.org/searchJSON?country=${countryCode}&adminCode1=${stateCode}&featureCode=${featureCode}&maxRows=${maxRows}&username=${GEONAMES_USERNAME}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GeoNames API error: ${response.statusText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from GeoNames:", error);
    res.status(500).json({ error: "Failed to fetch data from GeoNames" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});