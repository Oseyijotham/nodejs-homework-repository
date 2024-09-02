import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import { httpError } from "../helpers/httpError.js";
import "dotenv/config";
const { SECRET_KEY } = process.env;

const authenticateToken = async (req, _res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");// bearer and token values are entered in postman as header

  if (bearer !== "Bearer") {
    next(httpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(
      token,
      SECRET_KEY
    ); /* If the id and SECRET_KEY were used to create the token during login, then you should 
    be able to get the id from the token and SECRET_KEY, that is what is being done here as a form of verification that the user
    is authorized to access the path that this "const authenticateToken" funtion is attached to */

    const user = await User.findById(id);

    if (!user || user.token !== token || !user.token) {
      next(httpError(401, "Not authorized"));
    }

    req.user = user; // Very important inlogoutUser, getCurrentUsers, updateUserSubscription functions

    next();
  } catch {
    next(httpError(401, "Not authorized"));
  }
};

export { authenticateToken };
