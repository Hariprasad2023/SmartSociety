const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());


app.get("/", (req, res) => {
  res.send("SmartSociety API running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/notices", require("./routes/noticeRoutes"));
app.use("/api/facilities", require("./routes/facilityRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
