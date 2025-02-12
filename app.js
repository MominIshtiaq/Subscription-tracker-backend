import express from "express";
import connectToDatabase from "./database/mongodb.js";
import { PORT, NODE_ENV } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

// express built-in middlewares

// This allows our application to hanlde JSON data sent in Requests or API calls
app.use(express.json());

// This helps us to process the form data sent via HTML forms in a simple format
app.use(express.urlencoded({ extended: false }));

// This  helps to read cookies from the incoming requests so our application can store user data
app.use(cookieParser);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

// Custom Middleware
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Subscription tracker API!");
});

app.listen(PORT, async () => {
  console.log(
    `Subscription Tracker API is running on http://localhost:${PORT} and Environment is ${NODE_ENV}`
  );

  await connectToDatabase();
});

export default app;
