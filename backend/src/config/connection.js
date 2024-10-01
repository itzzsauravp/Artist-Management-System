import mysql from "mysql2/promise";
const connectionFunction = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "artistmanagementsys",
      password: "fenrir2003",
    });
    console.log("server started at port 8000\nconnnected to the database");
    return connection;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

export default connectionFunction;
