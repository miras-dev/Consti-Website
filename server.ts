import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization of Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_LOCAL_DEV",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Client Profile Strategic Analysis
  app.post("/api/advice", async (req, res) => {
    try {
      const {
        name = "Valued Partner",
        assets = 1500000,
        riskTolerance = "Moderate",
        goal = "Long-term Wealth Preservation",
        timeHorizon = 15,
        regionalContext = "DACH Region (Germany/Switzerland/Austria)",
        specialtiesSelected = ["Financial Planning", "Sustainable Investing"],
      } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Safe premium mockup-fallback if API key is not yet set, avoiding application crash
        return res.json(getMockAdviceReport(name, assets, riskTolerance, goal, timeHorizon, regionalContext, specialtiesSelected));
      }

      const ai = getGeminiClient();

      const promptMsg = `You are a Senior Strategic Director at Prestige Advisory, an elite private banking and family office consultant boutique.
Generate a structured wealth architecture report tailored to our premium client.

Client Profile:
- Name: ${name}
- Total Capital Pool: €${Number(assets).toLocaleString()}
- Strategic Risk Appetite: ${riskTolerance}
- Primary Intent: ${goal}
- Investment Horizon: ${timeHorizon} years
- Geographic/Regulatory Context: ${regionalContext}
- Specialized Advice Selected: ${specialtiesSelected.join(", ")}

You MUST generate a structured JSON object complying with the following schema rules. Ensure all percentages in assetAllocation sum to exactly 100.
Structure of the returned JSON:
{
  "clientGreeting": "Personalized highly elegant executive greeting addressing the client by name and setting the tone.",
  "assetAllocation": [
    {"assetClass": "Cash & Liquidity", "percentage": 10, "rationale": "Liquidity cushion"},
    {"assetClass": "Global Equities (ESG)", "percentage": 40, "rationale": "High-conviction core equities"},
    {"assetClass": "Sovereign/Corporate Bonds", "percentage": 25, "rationale": "Fixed income yield"},
    {"assetClass": "Alternatives / Private Debt", "percentage": 15, "rationale": "Uncorrelated alpha generation"},
    {"assetClass": "Real Estate / Infrastructure", "percentage": 10, "rationale": "Inflation-hedged physical assets"}
  ],
  "strategicPillars": [
    {"title": "Pillar title", "description": "Detail description", "steps": ["Step 1", "Step 2"]}
  ],
  "regionalTactics": [
    {"name": "Tax Optimization (BaFin)", "detail": "Tactical implementation description matching German/European contexts."}
  ],
  "timelinePhases": [
    {"phase": "Phase 1: Initial Allocation", "duration": "Months 1-3", "actions": ["Reallocate capital", "Establish tax shields"]}
  ],
  "disclaimer": " BaFin regulated disclaimer. Past performance does not guarantee future results."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptMsg,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              clientGreeting: { type: Type.STRING },
              assetAllocation: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    assetClass: { type: Type.STRING },
                    percentage: { type: Type.INTEGER },
                    rationale: { type: Type.STRING },
                  },
                  required: ["assetClass", "percentage", "rationale"],
                },
              },
              strategicPillars: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["title", "description", "steps"],
                },
              },
              regionalTactics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    detail: { type: Type.STRING },
                  },
                  required: ["name", "detail"],
                },
              },
              timelinePhases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phase: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    actions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["phase", "duration", "actions"],
                },
              },
              disclaimer: { type: Type.STRING },
            },
            required: [
              "clientGreeting",
              "assetAllocation",
              "strategicPillars",
              "regionalTactics",
              "timelinePhases",
              "disclaimer",
            ],
          },
        },
      });

      const text = response.text || "{}";
      const parsedData = JSON.parse(text);
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini advice API error:", error);
      res.status(500).json({ error: "Failed to generate bespoke strategic architecture report." });
    }
  });

  // Client Chat with Senior Advisory Partner
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages = [], context = {} } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          text: `Thank you for your inquiry regarding your portfolio. [DEMO MODE: API Key Not Yet Configured] Based on a ${context.riskTolerance || "Moderate"} risk appetite and a capital pool of €${(context.assets || 1500000).toLocaleString()}, we suggest structuring your assets with a strong focus on core global equities, localized tax optimization within German investment laws (Spezial-Sondervermögen alternatives), and high-liquidity cash buffers. Our advisory team will follow up on this structure. What specific asset class of your portfolio would you like to review next?`,
        });
      }

      const ai = getGeminiClient();

      // Format current history for Gemini
      const formattedContents = messages.map((m: any) => ({
        role: m.sender === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.text }],
      }));

      const sysInstruction = `You are Senior Wealth Director Markus von Preußen, a seasoned family office architect and leading partner at Prestige Advisory.
Your tone is serious, elite, highly knowledgeable, polite, and reassuring.
You deal with high-net-worth clients who value confidentiality, institutional precision, and long-term risk preservation.
Keep your responses succinct, structured, and profoundly strategic. Do not write generic conversational introductory sentences.
The client context is:
- Name: ${context.name || "Partner"}
- Net investable wealth: €${Number(context.assets || 1000000).toLocaleString()}
- Alignment goals: ${context.goal || "Capital Growth"}
- Selected advisory lens: ${context.specialty || "Comprehensive Portfolio Alignment"}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini chat API error:", error);
      res.status(500).json({ error: "Strategic transmission was temporarily interrupted." });
    }
  });

  // Serve static UI / Integrate Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Prestige Advisory portal online at http://0.0.0.0:${PORT}`);
  });
}

// Highly realistic mock generator to serve as fallback when API key is unconfigured
function getMockAdviceReport(
  name: string,
  assets: number,
  riskTolerance: string,
  goal: string,
  timeHorizon: number,
  regionalContext: string,
  specialties: string[]
) {
  const assetsNum = Number(assets);
  const isAggressive = riskTolerance.toLowerCase().includes("aggressive") || riskTolerance.toLowerCase().includes("high");
  const isConservative = riskTolerance.toLowerCase().includes("conservative") || riskTolerance.toLowerCase().includes("low");

  const stocksPercent = isAggressive ? 65 : isConservative ? 25 : 45;
  const bondsPercent = isAggressive ? 15 : isConservative ? 45 : 25;
  const alternativesPercent = isAggressive ? 15 : isConservative ? 10 : 15;
  const cashPercent = 100 - (stocksPercent + bondsPercent + alternativesPercent);

  return {
    clientGreeting: `Dear ${name}, it is our absolute privilege to present this bespoke Financial Architecture proposal. For a target horizon of ${timeHorizon} years, with your net investable capital pool of €${assetsNum.toLocaleString()}, we have structured a diversified, high-conviction allocation scheme designed to preserve legacy capital while tactical allocations secure uncorrelated alpha under the ${regionalContext} jurisdiction.`,
    assetAllocation: [
      {
        assetClass: "Global Equities (ESG-aligned Core)",
        percentage: stocksPercent,
        rationale: "Optimized broad global index allocation emphasizing high dividend resilience and carbon-efficient leadership profiles.",
      },
      {
        assetClass: "Institutional Sovereign & Corporate Debt",
        percentage: bondsPercent,
        rationale: "Laddered European and US treasuries to secure stable, predictable yield while protecting liquidity reserves.",
      },
      {
        assetClass: "Alternative Investments & Private Placements",
        percentage: alternativesPercent,
        rationale: "Direct real estate trust stakes and ESG-focused venture pools to achieve low correlation to public equity benchmarks.",
      },
      {
        assetClass: "Tactical Cash & Capital Preservation Reserves",
        percentage: cashPercent,
        rationale: "Immediate capital availability to execute on cyclical market dislocations and preserve extreme systemic flexibility.",
      },
    ],
    strategicPillars: [
      {
        title: "Pillar I: Comprehensive Tax Optimization & BaFin Structural Shielding",
        description: "Restructuring asset holding companies or leveraging German Spezialfonds models to heavily minimize capital tax drag.",
        steps: [
          "Establish high-net-worth holding frameworks to capitalize capital gains.",
          "Restructure global dividend flows through low-holding tax agreements.",
          "Consult regional tax specialist to audit legacy assets.",
        ],
      },
      {
        title: "Pillar II: Multi-Generational Legacy Structure & Estate Architecture",
        description: "Implementing long-term trust constructs to shield core family wealth from sudden inheritance valuation spikes or transition crises.",
        steps: [
          "Draft specialized corporate governance codes for family holdings.",
          "Incorporate milestone-based equity transfer models to legal heirs.",
          "Align legacy private equity allocations with ESG sustainability score guidelines.",
        ],
      },
    ],
    regionalTactics: [
      {
        name: "German Tax Optimization (Sondervermögen Shield)",
        detail: "Using specific German asset structures (like Section 26 of the Investment Code) to achieve structural deferral of capital gains tax under current local tax regulations.",
      },
      {
        name: "ESG Climate Alignment Plan",
        detail: "Screening 100% of public equities using SFDR Article 9 indicators to protect assets from oncoming regulatory pricing of carbon exposure.",
      },
    ],
    timelinePhases: [
      {
        phase: "Phase 1: Capital Auditing & Rebalancing Initiation",
        duration: "Months 1 - 2",
        actions: [
          "Execute full auditing protocol on existing stock holdings & debt portfolios.",
          "Identify and offload redundant high-fee commercial mutual funds.",
          "Initiate high-yield tactical capital placement reserves.",
        ],
      },
      {
        phase: "Phase 2: Structured Shield Integration",
        duration: "Months 3 - 6",
        actions: [
          "Form legal foundations / trust structures according to global governance targets.",
          "Stagger Core Global Equity purchase orders inside dedicated tax-friendly accounts.",
        ],
      },
    ],
    disclaimer: "BaFin notice: High-net-worth consulting services are subject to market volatility. The strategic projections above do not guarantee actual returns. Past performance yields are not illustrative of future capital growth. This is a private corporate advisory blueprint.",
  };
}

startServer();
