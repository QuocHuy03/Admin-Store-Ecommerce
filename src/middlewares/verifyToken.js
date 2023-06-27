import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const getById = await fetchUserById(decoded.userId);
    return getById;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    throw new Error("Invalid token");
  }
};
