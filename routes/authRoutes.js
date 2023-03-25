import express from "express";
import { loginController, registerController } from "../controllers/auth.js";
// import authJwt from "../middlewares/authJWT.js";
import verifySignUp from "../middlewares/verifySignup.js";
const userRouter = express.Router();

userRouter.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-auth,Origin,Content-Type,Accept"
  );
  next(); 
});

userRouter.post("/login", loginController);
userRouter.post(
  "/register",
  [verifySignUp.checkDupusernameOrEmail, verifySignUp.checkRolesExisted],
  registerController
);

export default userRouter;
