import bcrypt from "bcryptjs";
import prisma from "../config/prisma.config.js";
import checkIdentity from "../utils/check-identity.util.js";
import createError from "../utils/create-error.util.js";
import jwt from "jsonwebtoken";
import { createUser, getUserBy } from "../services/user.service.js";

// export async function register(req, res, next) {
// 	try {
// 		const { identity, firstName, lastName, password, confirmPassword } = req.body
// 		//validation
// 		if (!(identity.trim() && firstName.trim() && lastName.trim() && password.trim() && confirmPassword.trim())) {
// 			createError(400, 'Please fill all data')
// 		}
// 		if (password !== confirmPassword) {
// 			createError(400, 'check confirm password')
// 		}
// 		// identity เป็น email หรือ mobile phone number : checkIdentity(identity) => String : 'email' | 'mobile'
// 		const identityKey = checkIdentity(identity)

// 		// หา user
// 		const foundUser = await prisma.user.findUnique({
// 			where: { [identityKey]: identity }
// 		})
// 		if (foundUser) {
// 			createError(409, `Already have this user: ${identity}`)
// 		}

// 		const newUser = {
// 			[identityKey]: identity,
// 			password: await bcrypt.hash(password, 10),
// 			firstName: firstName,
// 			lastName: lastName
// 		}

// 		const result = await prisma.user.create({ data: newUser })
// 		res.json({
// 			msg: 'Register controller',
// 			result: result
// 		})
// 	} catch (err) {
// 		next(err)
// 	}
// }

export async function registerYup(req, res, next) {
  try {
    const { email, mobile, firstName, lastName, password } = req.body;
    if (email) {
      let foundUserEmail = await getUserBy('email',email)
      if (foundUserEmail) createError(409, `email ${email} already register`);
    }
    if (mobile) {
      let foundUserMobile = await getUserBy('mobile',mobile)
      if (foundUserMobile)
        createError(409, `Mobile ${mobile} already register`);
    }
    const newUser = {
      email,
      mobile,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
    };
    const result = await createUser(newUser)

    res.json({ msg: "Register success", result });
  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  const { identity, password, email, mobile } = req.body;
  const identityKey = email ? "email" : "mobile";
  // const foundUser = await prisma.user.findUnique({
  // 	where: {[identityKey] : identity}
  // })
  const foundUser = await getUserBy(identityKey, identity);
  if (!foundUser) {
    createError(401, "invalid Login");
  }
  let passwordOk = await bcrypt.compare(password, foundUser.password);
  if (!passwordOk) {
    createError(401, "Invalid Login");
  }
  const payload = { id: foundUser.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "115d",
  });
  res.json({
    msg: "Login successful",
    token,
  });
};

export const getMe = async (req, res, next) => {
  // let numUser = await prisma.user.count();
  // console.log(numUser);
  // createError(403, "Block!!");
  // res.json({ msg: "Get me controller", numUser });
  res.json({user: req.user})
};
