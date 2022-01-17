import "./env.js";
import app from "./app.js";

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;

app.listen(PORT, HOST, () => {
  console.log(`started server on http://${HOST}:${PORT}`);
});
