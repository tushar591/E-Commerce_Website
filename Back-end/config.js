import dotenv from "dotenv";

dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD

export default {JWT_USER_PASSWORD,JWT_ADMIN_PASSWORD};
