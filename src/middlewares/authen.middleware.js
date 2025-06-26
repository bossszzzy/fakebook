import jwt from "jsonwebtoken";
import createError from "../utils/create-error.util.js";
import { getUserBy } from "../services/user.service.js";

export default async function (req, res, next) {
  const authorization = req.headers.authorization;
  console.log(authorization);
  if (!authorization || !authorization.startsWith("Bearer")) {
    createError(401, "have no authorization header");
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    createError(401, "Unathorization");
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const foundUser = await getUserBy("id", payload.id);
  if (!foundUser) {
    createError(401, "Unathorized");
  }
  const { password, createAt, updateAt, ...userData } = foundUser;
  req.user = userData;

  console.log(req.user);

  // res.json({
  //   msg: "we have authorization header",
  //   token: authorization ,
  //   payload,
  //   foundUser
  // });

  next();
}
