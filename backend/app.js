const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
require("./models/User");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        message: "Expense App backend is running"
    });
});

app.use("/user", userRoutes);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL database connected");

        await sequelize.sync();
        console.log("Users table is ready");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error.message);
    }
};

startServer();
