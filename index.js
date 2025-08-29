const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const FULL_NAME = process.env.FULL_NAME || "jyothika_reddy_naru"; 
const DOB = process.env.DOB_DDMMYYYY || "12102005";
const EMAIL = process.env.EMAIL || "jyothikanaru12@gmail.com";
const ROLL = process.env.ROLL || "22BCE8256";

function isDigit(str) {
  return /^[0-9]+$/.test(str);
}
function isAlpha(str) {
  return /^[A-Za-z]+$/.test(str);
}

// ✅ Root route (for browser check)
app.get("/", (req, res) => {
  res.send("BFHL API is running ✅. Use POST /bfhl to test.");
});

// ✅ Main POST route
app.post("/bfhl", (req, res) => {
  try {
    const items = (req.body.data || []).map(String);

    let odd_numbers = [];
    let even_numbers = [];
    let alphabets = [];
    let specials = [];
    let letterStream = [];
    let total = 0;

    items.forEach((token) => {
      for (let ch of token) {
        if (/[A-Za-z]/.test(ch)) {
          letterStream.push(ch);
        }
      }

      if (isDigit(token)) {
        let num = parseInt(token);
        total += num;
        if (num % 2 === 0) {
          even_numbers.push(token);
        } else {
          odd_numbers.push(token);
        }
      }

      if (isAlpha(token)) {
        alphabets.push(token.toUpperCase());
      }

      let sp = token.match(/[^A-Za-z0-9]/g);
      if (sp) specials.push(...sp);
    });

    let rev = letterStream.reverse();
    let altCaps = rev.map((ch, i) =>
      i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()
    );
    let concat_string = altCaps.join("");

    res.json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters: specials,
      sum: total.toString(),
      concat_string,
    });
  } catch (err) {
    res.json({
      is_success: false,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
