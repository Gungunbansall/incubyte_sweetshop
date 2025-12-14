const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const user_id = "Shiwani_23aug2002"; // Apna naam + DOB likho
const email = "shivuagarwal23@gmail.com";  // Apna email daalo
const roll_number = "22BCS15973";  // Apna roll number daalo

app.post("/bfhl", (req, res) => {
    try {
        const { data } = req.body;
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid Input" });
        }
        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));
        const highest_alphabet = alphabets.length > 0 ? [alphabets.sort().reverse()[0]] : [];

        res.json({
            is_success: true,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets,
            highest_alphabet
        });
    } catch (error) {
        res.status(500).json({ is_success: false, message: "Server Error" });
    }
});

app.get("/bfhl", (req, res) => {
    res.json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   // console.log(Server running on port ${PORT});
});