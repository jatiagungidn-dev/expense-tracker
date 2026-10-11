import app from "./app";

const PORT = 3000;

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Expense Tracker is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
