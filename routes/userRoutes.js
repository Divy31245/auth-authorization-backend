import express from "express";
import {
  adminBoard,
  allAccess, 
  modBoard,
  userBoard,
} from "../controllers/user.js";
import authJwt from "../middlewares/authJWT.js"; 

const router = express.Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-auth,Origin,Content-Type,Accept"
  );
  next();
});

router.get("/all", allAccess);
router.get("/user", [authJwt.verifyToken], userBoard);
router.get("/mod", [authJwt.verifyToken, authJwt.isModerator], modBoard);
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);

export default router;
