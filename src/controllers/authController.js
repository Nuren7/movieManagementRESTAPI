import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

//REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //Check if user already exist

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "User already exists with this email" });
  }

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  const token = generateToken(user.id);

  res.status(201).json({
    status: "Success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
      token,
    },
  });
};

//LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  //Check if user email exists in the table
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  //verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  //Generate JWT token
  const token = generateToken(user.id);

  res.status(201).json({
    status: "Success",
    data: {
      user: {
        id: user.id,
        email: email,
      },
      token,
    },
  });
};

export { register, login };
