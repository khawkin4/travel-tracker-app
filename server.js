const path = require("path");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//load environment variables
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

//initialize app
const app = express();

//middleware
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/places", require("./routes/places"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
