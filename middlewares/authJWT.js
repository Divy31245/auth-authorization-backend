import jwt from "jsonwebtoken";
import userSchema from "../models/user.js";
import roleSchema from "../models/role.model.js";
const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-auth"];

  if (!token) {
    return res.status(500).send({ message: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(500).send({ message: "unauthorized" });
    }
    req.userId = decoded._id;
    console.log(decoded)
    next();
  });
};

const isAdmin = async (req, res, next) => {
  userSchema.findById(req.userId).then((user) => {
    if (!user) {
      return res.status(500).send({ message: "User not found" });
    }

    roleSchema.find({ _id: { $in: user.roles } }).then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      return res.status(403).send({ message: "Require Admin Role!" });
    });
  });
};

const isModerator = async (req, res, next) => {
  console.log(req.userId)
  userSchema.findById(req.userId).then((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    roleSchema
      .find({
        _id: { $in: user.roles },
      })
      .then((err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "mod") {
            next();
            return;
          }
        }

        return res.status(403).send({ message: "Require Moderator Role!" });
      });
  });
};

const authJwt = { isAdmin, isModerator, verifyToken };

export default authJwt;
