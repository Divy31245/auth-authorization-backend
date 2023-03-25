import Joi from "joi";
import userSchema from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import roleSchema from "../models/role.model.js";
const loginSchema = Joi.object({
  email: Joi.string().email().min(6).required(),
  password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
  username: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  roles: Joi.array().items(Joi.string()),
});

export const loginController = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  //check if the user is in the database or not
  const validUser = userSchema
    .findOne({ email: req.body.email })
    .populate("roles", "-__v")
    .then((user) => {
      // console.log(user);
      const validPass = bcrypt.compare(req.body.password, user.password);
      if (!validPass) res.status(400).send("email or password is wrong");

      const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);

      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
  if (!validUser) res.status(400).send("email or password is wrong");
};

export const registerController = async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  //gernerating hash password using jwt
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(req.body.password, salt);

  const newUser = new userSchema({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const user = await newUser.save();
    if (req.body.roles) {
      const roles = await roleSchema.find({ name: { $in: req.body.roles } });
      user.roles = roles.map((role) => role._id);
      user.save().then(() => res.status(200).send("user reg successfully."));
    } else {
      const role = roleSchema.findOne({ name: "user" });
      user.roles = [role._id];
      user.save().then(() => res.status(200).send("user reg successfully."));
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//check if user already exists or not
// const validUser = await userSchema.findOne({ email: req.body.email });
// if (!validUser) res.status(400).send("user already exists in the database..");

// user = await newUser.save().then((err, user) => {
//   if (err) {
//     res.status(500).send({ message: err.message });
//     return;
//   }
//   if (req.body.roles) {
//     roleSchema
//       .find({ name: { $in: req.body.roles } })
//       .then((err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err.message });
//           return;
//           ``;
//         }
//         user.roles = roles.map((role) => role._id);
//         user.save().then((err) => {
//           if (err) {
//             res.status(500).send({ message: err });
//             return;
//           }

//           res.send({ message: "User was registered successfully!" });
//         });
//       });
//   } else {
//     roleSchema.findOne({ name: "user" }).then((err, role) => {
//       if (err) {
//         res.status(500).send({ message: err });
//         return;
//       }

//       user.roles = [role._id];
//       user.save().then((err) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         res.send({ message: "User was registered successfully!" });
//       });
//     });
//   }
// });
