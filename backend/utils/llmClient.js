const fetch = require("node-fetch");

/**
 * Extracts the first valid JSON object from a text string.
 */
function extractJSON(text) {
    const firstCurly = text.indexOf('{');
    const lastCurly = text.lastIndexOf('}');
    if (firstCurly !== -1 && lastCurly !== -1 && lastCurly > firstCurly) {
        const jsonString = text.substring(firstCurly, lastCurly + 1);
        try {
            return JSON.parse(jsonString);
        } catch (err) {
            console.error("JSON parse error:", err);
            return null;
        }
    }
    return null;
}

async function verifyText(text) {
    const systemPrompt = `
You are a fake news detection AI.

Strictly respond ONLY with a VALID JSON object without any markdown, explanation, or extra text.

Format:
{
  "verdict": "Real" or "Fake",
  "reasoning": "short explanation"
}
`;

    try {
        const response = await fetch("http://127.0.0.1:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "phi3",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text }
                ],
                stream: false
            })
        });

        const data = await response.json();
        const rawContent = (data.message?.content || "").trim();

        console.log("🔹 Raw Ollama response:", rawContent);

        // Clean markdown fences if present
        let cleaned = rawContent;
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.replace(/```json\s*([\s\S]*?)```/, "$1").trim();
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/```\s*([\s\S]*?)```/, "$1").trim();
        }

        // Attempt structured extraction
        const parsed = extractJSON(cleaned);

        if (!parsed) {
            return {
                verdict: "Error",
                reasoning: "Failed to parse JSON from Ollama. Cleaned content: " + cleaned,
                sources: []
            };
        }

        return {
            verdict: parsed.verdict || "Unknown",
            reasoning: parsed.reasoning || "No reasoning provided.",
            sources: []
        };

    } catch (error) {
        console.error("Ollama connection error:", error.stack || error);
        return {
            verdict: "Error",
            reasoning: "Failed to connect to Ollama: " + error.message,
            sources: []
        };
    }
}

module.exports = { verifyText };
