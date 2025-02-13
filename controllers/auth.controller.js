import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  const session = await mongoose.startSession(); // This start a session of mongoose transaction
  session.startTransaction(); // This perform atomic updates

  try {
    const { name, email, password, role } = req.body;

    // Check if a user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409; // 409 means user already exists
      throw error;
    }

    // Hash password
    // Get access to Salt, this is like a complexity you want to use for randomizing hashed password
    // When bcrypt hash method to hash the String aka password

    /* generate salt by using bcrypt.genSalt method. 
    it takes a single integer argument default is 10. 
    the higher the number the complex the salt */
    const salt = await bcrypt.genSalt(10);

    /* then use bcrypt.hash method to generate randomized password or string.
    it takes to 2 arguments first is the string and second is the salt generated using bcrypt.genSalt method */
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          role: role || "user",
        },
      ],
      /* We attach this session here. So If something goes wrong this will abort the session transaction
       and if everything goes well the session transaction will commit */
      { session }
    );

    // To create a token we will use the jsonwebtoken sign method which takes arguments
    // an object, the JWT_SECRET and we can pass options as the third argument like expiresIn
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "user created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    // If something goes wrong
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // the bcrypt.compare the hash the first argument password and match it with the user password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/*
////// Atomic Operations / Atomic Updates //////
Database operations that update the state are atomic. All or nothing

Insert either works completely or it doesn't
Update either works completely or it doesn't
You never get half an operation

Reason why operations may not work
One or more constraints violated.
Datatype mismatch
Syntax error

////// Request Body //////
Request.body or req.body is an object containing data from the client (specifically the POST request)
*/
