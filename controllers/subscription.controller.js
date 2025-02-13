import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";

export const setSubscription = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log("Request body:", req.body);
  try {
    const subscription = await Subscription.create(
      [{ ...req.body, user: req.user?._id }],
      { session }
    );
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: {
        subscription: subscription[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};
