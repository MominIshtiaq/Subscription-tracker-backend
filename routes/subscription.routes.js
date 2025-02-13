import { Router } from "express";
import {
  setSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.use(authorize);

subscriptionRouter.get("/", getSubscriptions);
subscriptionRouter.get("/:id", getSubscription);
subscriptionRouter.post("/", setSubscription);
subscriptionRouter.put("/:id", updateSubscription);
subscriptionRouter.delete("/:id", deleteSubscription);

subscriptionRouter.get("/user/:id", (req, res) => {
  res.send({ title: "GET all user subscription" });
});

subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({ title: "CANCEL subscription" });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ title: "GET upcoming renewals" });
});

export default subscriptionRouter;
