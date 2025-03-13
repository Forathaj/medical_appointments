/** @format */
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const chatgptAi = async (req, res, client) => {
  if (!client) {
    console.error("❌ MongoDB client is not available");
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Database connection error" }));
  }

  const db = client.db("medicalDB");
  console.log("✅ Connected to database:", db.databaseName);

  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));

  req.on("end", async () => {
    console.log("📦 Raw request body:", body);
    const parsedBody = JSON.parse(body);
    console.log("✅ Parsed request body:", parsedBody);

    const { userId, symptoms } = parsedBody;
    console.log("🧑 User ID:", userId);
    console.log("🤒 Symptoms:", symptoms);

    try {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful medical assistant." },
          {
            role: "user",
            content: `What medical specialty should I see for these symptoms: ${symptoms}?`,
          },
        ],
        max_tokens: 100,
      });

      console.log("🧠 AI response:", aiResponse);

      const recommendations = aiResponse.choices?.[0]?.message?.content?.trim();
      console.log("✅ AI Recommendations:", recommendations);

      if (!recommendations) {
        throw new Error("No recommendations returned by AI.");
      }

      await db.collection("chatlogs").insertOne({
        userId,
        chatContent: symptoms,
        recommendations,
        timestamp: new Date(),
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ recommendations }));
    } catch (error) {
      console.error("❌ Error:", error.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Failed to get AI suggestion." }));
    }
  });
};
