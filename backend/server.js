const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const client = new MongoClient(process.env.MONGODB_URI);
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function startServer() {
    try {
        await client.connect();

        console.log("MongoDB connected successfully.");

        const database = client.db("portfolioDB");
        const contacts = database.collection("contacts");

        app.get("/", (req, res) => {
            res.send("Portfolio backend is running.");
        });

        app.post("/contact", async (req, res) => {
            try {
                const { name, email, message } = req.body;

                if (!name || !email || !message) {
                    return res.status(400).json({
                        message: "Please fill in all fields."
                    });
                }

                
                await contacts.insertOne({
                     name,
                     email,
                     message,
                     createdAt: new Date()
          });

               await transporter.sendMail({
               from: process.env.EMAIL_USER,
               to: process.env.EMAIL_USER,
               replyTo: email,
               subject: `New Portfolio Message from ${name}`,
               text: `
               Name: ${name}
               Email: ${email}

             Message:
             ${message}
           `
           });

console.log("New contact message saved and email sent.");

                res.json({
                    message: "Message received successfully."
                });

            } catch (error) {
                console.error("Error saving message:", error);

                res.status(500).json({
                    message: "Unable to save message."
                });
            }
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

startServer();