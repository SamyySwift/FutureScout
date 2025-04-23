import express from "express";
import dotenv from "dotenv";
import { Paystack } from "paystack-sdk";
dotenv.config(); // Load environment variables

const paystackRouter = express();
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

// 1. Create a Customer
paystackRouter.post("/create-customer", async (req, res) => {
  const { email, name } = req.body;
  try {
    const customer = await paystack.customer.create({
      email,
      full_name: name,
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Create customer failed", error);
    res.status(500).json({ error: error.message });
  }
});
//get all plans from paystack
paystackRouter.get("/plans", async (req, res) => {
  try {
    const plans = await paystack.plan.list({});
    res.status(200).json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Subscribe Customer to a Plan
paystackRouter.post("/initialize-transaction-with-plan", async (req, res) => {
  try {
    let { email, amount, plan } = req.body;

    if (!email || !amount || !plan) {
      throw Error(
        "Please provide a valid customer email, amount to charge, and plan code"
      );
    }

    let initializeTransactionResponse = await paystack.transaction.initialize({
      email,
      amount,
      plan,
      channels: ["card"], // limiting the checkout to show card, as it's the only channel that subscriptions are currently available through
      callback_url: `${process.env.FRONTEND_URL}`,
    });

    if (initializeTransactionResponse.status === false) {
      return console.log(
        "Error initializing transaction: ",
        initializeTransactionResponse.message
      );
    }
    let transaction = initializeTransactionResponse.data;
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Optional: Webhook endpoint to listen to subscription updates
paystackRouter.post(
  "/webhook",
  express.raw({ type: "paystackRouterlication/json" }),
  (req, res) => {
    const hash = require("crypto")
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest("hex");

    if (hash === req.headers["x-paystack-signature"]) {
      const event = JSON.parse(req.body);
      console.log("Webhook received:", event);
    }

    res.sendStatus(200);
  }
);
// Optional: Cancel Subscription
paystackRouter.post("/cancel-subscription", async (req, res) => {
  try {
    const { subscription_code } = req.body;

    const cancellation = await paystack.subscription.disable(subscription_code);

    res.status(200).json(cancellation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

paystackRouter.get("/subscriptions/:customer_email", async (req, res) => {
  try {
    const { customer_email } = req.params;

    // Step 1: Search for customer using email
    const customerListRes = await paystack.customer.list({
      email: customer_email,
    });
    const customer = customerListRes.data?.[0];

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const customerId = customer.id;

    // Step 2: List subscriptions for the customer
    const subscriptions = await paystack.subscription.list({
      customer: customerId,
    });

    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ error: error.message });
  }
});

paystackRouter.get("/update-payment-method", async (req, res) => {
  try {
    const { subscription_code } = req.query;

    if (!subscription_code) {
      return res.status(400).json({ error: "subscription_code is required" });
    }

    const response = await paystack.subscription.generateSubscriptionLink(
      subscription_code
    );

    if (response.status === false) {
      console.log(response.message);
      return res.status(500).json({ error: response.message });
    }

    const manageSubscriptionLink = response.data.link;
    return res.redirect(manageSubscriptionLink);
  } catch (error) {
    console.error("Error generating manage subscription link:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export default paystackRouter;
