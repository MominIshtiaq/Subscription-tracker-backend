import mongoose from "mongoose";
import Subscription from "../models/subscription.model.js";

export const setSubscription = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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
    if (req.user.role !== "admin") {
      const error = new Error("Unauthorized User");
      error.statusCode = 401;
      throw error;
    }
    const subscriptions = await Subscription.find();
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 401;
      throw error;
    }

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== subscription.user.toString()
    ) {
      const error = new Error("Unauthorized User");
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 401;
      throw error;
    }

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== subscription.user.toString()
    ) {
      const error = new Error("Unauthorized User");
      error.statusCode = 401;
      throw error;
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!updatedSubscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 401;
      throw error;
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "Subscription updated successfully",
      data: {
        subscription: updatedSubscription,
      },
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 401;
      throw error;
    }

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== subscription.user.toString()
    ) {
      const error = new Error("Unauthorized User");
      error.statusCode = 401;
      throw error;
    }

    const deletedSubscription = await Subscription.findByIdAndDelete(
      req.params.id
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: {
        subscription: deletedSubscription,
      },
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};
