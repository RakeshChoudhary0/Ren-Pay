import express from "express";
import AuthRoute from "./Routes/auth.route.js";
import PaymentRoute from "./Routes/payment.route.js";

const app = express();
app.use(express.json());

// API Routes
app.use("/api/auth", AuthRoute);
app.use("/api/payment", PaymentRoute);

export default app;
