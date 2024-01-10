const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

// creating orders
router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: "rzp_test_Wa2s8fVV4XSYsM",
      key_secret: "SNsaqvUJJCZTMjMUlrUSjkcQ", // Replace with your actual key_secret
    });

    const options = {
      amount: req.body.totalAmount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

// payment verify
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", "SNsaqvUJJCZTMjMUlrUSjkcQ") // Replace with your actual key_secret
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature == expectedSign) {
      return res.status(200).json({ message: "Payment verified Successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

module.exports = router;
