import express from "express";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import { PDFParse } from "pdf-parse";


dotenv.config();

// Lazy initialization of OpenAI SDK
let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    openaiClient = new OpenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_LOCAL_DEV",
    });
  }
  return openaiClient;
}

const app = express();
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
        lang = "en"
      } = req.body;

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        // Safe premium mockup-fallback if API key is not yet set, avoiding application crash
        return res.json(getMockAdviceReport(name, assets, riskTolerance, goal, timeHorizon, regionalContext, specialtiesSelected, lang));
      }

      const ai = getOpenAIClient();

      const promptMsg = `You are a Senior Strategic Director at Prestige Advisory, an elite private banking and family office consultant boutique.
Generate a structured wealth architecture report tailored to our premium client.
CRITICAL: You MUST write the entire report content (including clientGreeting, assetClass, rationale, title, description, steps, name, detail, phase, actions, and disclaimer) in ${lang === "de" ? "GERMAN" : "ENGLISH"} language.

Client Profile:
- Name: ${name}
- Total Capital Pool: €${Number(assets).toLocaleString()}
- Strategic Risk Appetite: ${riskTolerance}
- Primary Intent: ${goal}
- Investment Horizon: ${timeHorizon} years
- Geographic/Regulatory Context: ${regionalContext}
- Specialized Advice Selected: ${specialtiesSelected.join(", ")}

You MUST generate a structured JSON object complying with the schema rules. Ensure all percentages in assetAllocation sum to exactly 100.`;

      const response = await ai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a Senior Strategic Director at Prestige Advisory, an elite private banking and family office consultant boutique. You deliver bespoked strategic financial plans. All responses must strictly conform to the requested JSON schema.`
          },
          {
            role: "user",
            content: promptMsg
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "wealth_architecture_report",
            strict: true,
            schema: {
              type: "object",
              properties: {
                clientGreeting: { type: "string" },
                assetAllocation: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      assetClass: { type: "string" },
                      percentage: { type: "integer" },
                      rationale: { type: "string" }
                    },
                    required: ["assetClass", "percentage", "rationale"],
                    additionalProperties: false
                  }
                },
                strategicPillars: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      steps: {
                        type: "array",
                        items: { type: "string" }
                      }
                    },
                    required: ["title", "description", "steps"],
                    additionalProperties: false
                  }
                },
                regionalTactics: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      detail: { type: "string" }
                    },
                    required: ["name", "detail"],
                    additionalProperties: false
                  }
                },
                timelinePhases: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      phase: { type: "string" },
                      duration: { type: "string" },
                      actions: {
                        type: "array",
                        items: { type: "string" }
                      }
                    },
                    required: ["phase", "duration", "actions"],
                    additionalProperties: false
                  }
                },
                disclaimer: { type: "string" }
              },
              required: [
                "clientGreeting",
                "assetAllocation",
                "strategicPillars",
                "regionalTactics",
                "timelinePhases",
                "disclaimer"
              ],
              additionalProperties: false
            }
          }
        }
      });

      const text = response.choices[0].message?.content || "{}";
      const parsedData = JSON.parse(text);
      res.json(parsedData);
    } catch (error: any) {
      console.error("OpenAI advice API error:", error);
      res.status(500).json({ error: "Failed to generate bespoke strategic architecture report." });
    }
  });

function copyRecursive(src: string, dest: string) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((child) => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else if (exists) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

function getWritablePath(relativePath: string): string {
  if (process.env.VERCEL) {
    const tmpPath = path.join("/tmp", relativePath);
    if (!fs.existsSync(tmpPath)) {
      const originalPath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(originalPath)) {
        try {
          copyRecursive(originalPath, tmpPath);
        } catch (e) {
          console.error(`Failed to copy ${relativePath} to /tmp:`, e);
        }
      } else {
        const dir = path.dirname(tmpPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      }
    }
    return tmpPath;
  }
  return path.join(process.cwd(), relativePath);
}

function extractName(text: string): string | null {
  const myNameIs = text.match(/my name is\s+([a-zA-Z\s]+?)(?:\.|\s|$|and|my|your|phone|number|email)/i);
  if (myNameIs) return myNameIs[1].trim();
  
  const iAm = text.match(/\bi am\s+([a-zA-Z\s]+?)(?:\.|\s|$|and|my|your|phone|number|email)/i);
  if (iAm) {
    const name = iAm[1].trim();
    const lowerName = name.toLowerCase();
    if (!["interested", "here", "looking", "ready", "seeking", "a", "an", "trying", "sure", "happy", "want"].includes(lowerName)) {
      return name;
    }
  }
  
  const nameIs = text.match(/name is\s+([a-zA-Z\s]+?)(?:\.|\s|$|and|my|your|phone|number|email)/i);
  if (nameIs) return nameIs[1].trim();

  const nameColon = text.match(/name:\s*([a-zA-Z\s]+?)(?:\.|\s|$|and|my|your|phone|number|email)/i);
  if (nameColon) return nameColon[1].trim();

  const commonNames = ["alex", "john", "mary", "sarah", "markus", "elene", "gabriel", "constantin", "nixdorff", "miras", "mujeeb"];
  for (const name of commonNames) {
    if (new RegExp(`\\b${name}\\b`, "i").test(text)) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }

  return null;
}

function extractPhone(text: string): string | null {
  const phoneMatch = text.match(/\+?\d[\d\s-]{5,14}\d/);
  if (phoneMatch) return phoneMatch[0].trim();
  
  const phoneColon = text.match(/phone:\s*(\+?\d[\d\s-]{5,14}\d)/i);
  if (phoneColon) return phoneColon[1].trim();
  
  const numberIs = text.match(/(?:number is|phone number is)\s*(\+?\d[\d\s-]{5,14}\d)/i);
  if (numberIs) return numberIs[1].trim();

  return null;
}

function extractDate(text: string): string | null {
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "januar", "februar", "märz", "maerz", "juni", "juli", "oktober", "dezember"];
  for (const m of months) {
    if (new RegExp(`\\b\\d{1,2}\\s+${m}\\b`, "i").test(text)) {
      const match = text.match(new RegExp(`\\b\\d{1,2}\\s+${m}(?:\\s+\\d{4})?`, "i"));
      if (match) return match[0];
    }
    if (new RegExp(`\\b${m}\\s+\\d{1,2}\\b`, "i").test(text)) {
      const match = text.match(new RegExp(`\\b${m}\\s+\\d{1,2}(?:\\s+\\d{4})?`, "i"));
      if (match) return match[0];
    }
  }
  
  if (/\btomorrow\b/i.test(text)) return "Tomorrow";
  if (/\bmorgen\b/i.test(text)) return "Morgen";
  if (/\bnext week\b/i.test(text)) return "Next week";
  if (/\bnext monday\b/i.test(text)) return "Next Monday";
  if (/\bnaechsten montag\b/i.test(text)) return "Nächsten Montag";

  const datePattern = text.match(/\b\d{1,2}\.\d{1,2}(?:\.\d{2,4})?\b/);
  if (datePattern) return datePattern[0];

  const dateWord = text.match(/(?:date|datum):\s*([^\n,]+)/i);
  if (dateWord) return dateWord[1].trim();

  return null;
}

function extractPurpose(text: string): string | null {
  const purposeMatch = text.match(/(?:purpose|reason|topic|notes):\s*([^\n,]+)/i);
  if (purposeMatch) return purposeMatch[1].trim();

  const regardingMatch = text.match(/\bregarding\s+([^\n,\.]+)/i);
  if (regardingMatch) return regardingMatch[1].trim();

  const discussMatch = text.match(/\bto discuss\s+([^\n,\.]+)/i);
  if (discussMatch) return discussMatch[1].trim();

  const uberMatch = text.match(/\büber\s+([^\n,\.]+)/i);
  if (uberMatch) return uberMatch[1].trim();

  const keywords = ["planning", "tax", "compounding", "advisory", "audit", "portfolio", "review", "wealth", "structuring", "investment", "investing", "consultation", "inheritance", "bafin", "capital", "growth", "preservation", "governance", "beratung", "gespraech", "finanzplanung", "anlage"];
  for (const kw of keywords) {
    if (new RegExp(`\\b${kw}\\b`, "i").test(text)) {
      return kw.charAt(0).toUpperCase() + kw.slice(1);
    }
  }
  
  return null;
}

  // Client Chat with Senior Advisory Partner
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages = [], context = {}, lang = "en" } = req.body;

      // 1. Load active settings config
      let config = {
        instructions: `You are Senior Wealth Director Markus von Preußen, a seasoned family office architect and leading partner at Prestige Advisory.
Your tone is serious, elite, highly knowledgeable, polite, and reassuring.
You deal with high-net-worth clients who value confidentiality, institutional precision, and long-term risk preservation.
Keep your responses succinct, structured, and profoundly strategic. Do not write generic conversational introductory sentences.`,
        model: "gpt-4o-mini",
        temperature: 0.7
      };

      const configPath = getWritablePath(path.join("src", "data", "chatbot_config.json"));
      if (fs.existsSync(configPath)) {
        try {
          config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        } catch (e) {
          // Fallback to default
        }
      }

      // 2. Simple keyword-matching RAG context lookup
      let retrievedContext = "";
      const resourcesDir = getWritablePath(path.join("src", "data", "resources"));
      if (fs.existsSync(resourcesDir)) {
        const files = fs.readdirSync(resourcesDir).filter(f => f.endsWith(".txt"));
        const allParagraphs: { file: string; text: string }[] = [];

        for (const file of files) {
          try {
            const content = fs.readFileSync(path.join(resourcesDir, file), "utf-8");
            const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
            for (const p of paragraphs) {
              allParagraphs.push({ file, text: p });
            }
          } catch (err) {
            console.error("Error reading resource file:", file, err);
          }
        }

        if (allParagraphs.length > 0) {
          const userQuery = messages.length > 0 ? messages[messages.length - 1].text : "";
          const stopwords = new Set(["the", "a", "an", "is", "are", "was", "were", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "of", "about", "what", "how", "why", "who", "where", "which", "you", "your", "my", "me", "i", "we", "he", "she", "it", "they", "them", "this", "that", "these", "those"]);

          const queryTokens = userQuery
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .split(/\s+/)
            .filter(t => t.length > 2 && !stopwords.has(t));

          if (queryTokens.length > 0) {
            const scoredParagraphs = allParagraphs.map(p => {
              const pTextLower = p.text.toLowerCase();
              let score = 0;
              for (const token of queryTokens) {
                if (pTextLower.includes(token)) {
                  score += 1;
                }
              }
              return { paragraph: p, score };
            });

            const matchingParagraphs = scoredParagraphs
              .filter(item => item.score > 0)
              .sort((a, b) => b.score - a.score)
              .slice(0, 10);

            if (matchingParagraphs.length > 0) {
              retrievedContext = "\n\n=== RETRIEVED CONTEXT FROM KNOWLEDGE BASE ===\n";
              for (const item of matchingParagraphs) {
                retrievedContext += `[From Resource: ${item.paragraph.file.replace(".txt", "")}]\n${item.paragraph.text}\n\n`;
              }
              retrievedContext += "=============================================";
            }
          }
        }
      }

      // 3. Construct final system instruction prompt
      let sysInstruction = config.instructions || `You are Senior Wealth Director Markus von Preußen, a seasoned family office architect and leading partner at Prestige Advisory.
Your tone is serious, elite, highly knowledgeable, polite, and reassuring.
You deal with high-net-worth clients who value confidentiality, institutional precision, and long-term risk preservation.
Keep your responses succinct, structured, and profoundly strategic. Do not write generic conversational introductory sentences.`;
      
      sysInstruction += `\n\nCRITICAL: You MUST write your reply in the ${lang === "de" ? "GERMAN" : "ENGLISH"} language.`;
      sysInstruction += `\n\nThe client context is:
- Name: ${context.name || "Partner"}
- Net investable wealth: €${Number(context.assets || 1000000).toLocaleString()}
- Alignment goals: ${context.goal || "Capital Growth"}
- Selected advisory lens: ${context.specialty || "Comprehensive Portfolio Alignment"}
- Today's date reference: ${new Date().toDateString()}`;

      if (retrievedContext) {
        sysInstruction += retrievedContext;
      }

      sysInstruction += `\n\nCRITICAL PERSISTENCE REQUIREMENT:
You also extract booking or lead inquiries. If the client explicitly requests an appointment (in-person or virtual) and provides ALL four of the following details, extract them into "extractedLead" and set "hasLeadInfo" to true:
1. Client's Name (name)
2. Client's Phone Number (phone)
3. Date & Time of the appointment (meetingDate and meetingTime)
4. Purpose of the appointment (notes - e.g. tax structuring, wealth review, allocation audit)

If any of these details are not yet provided by the user, you MUST set "hasLeadInfo" to false and fill the "extractedLead" fields with empty strings "".
Never make up values.

APPOINTMENT CONSTRAINTS:
When a client requests to book a meeting, you MUST collect their Name, Phone Number, Date & Time, and Purpose of the meeting BEFORE confirming the appointment.
Do not confirm or state that the appointment is booked in the database until they have provided all these four items.
If they only provide some of the details (e.g. name and phone), you must politely ask them for the missing details (e.g. date & purpose) in your response.
Once and ONLY once you have collected all four details, you may confirm the appointment booking and mention it is finalized in our database.`;

      // 4. Handle Mock Fallback when API Key is unconfigured
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        let textDe = `Vielen Dank für Ihre Anfrage bezüglich Ihres Portfolios. [DEMOMODUS: API-Schlüssel noch nicht konfiguriert] Basierend auf einer Risikobereitschaft von "${context.riskTolerance || "Moderat"}" und einem Kapitalpool von €${(context.assets || 1500000).toLocaleString()} empfehlen wir eine Strukturierung Ihres Vermögens mit starkem Fokus auf globale Kernaktien, lokalisierte Steueroptimierung nach deutschem Recht (Spezial-Sondervermögen-Alternativen) und hochliquide Barmittelpuffer. Unser Beratungsteam wird diese Struktur mit Ihnen besprechen. Welche spezifische Anlageklasse Ihres Portfolios möchten Sie als nächstes überprüfen?`;
        
        let textEn = `Thank you for your inquiry regarding your portfolio. [DEMO MODE: API Key Not Yet Configured] Based on a ${context.riskTolerance || "Moderate"} risk appetite and a capital pool of €${(context.assets || 1500000).toLocaleString()}, we suggest structuring your assets with a strong focus on core global equities, localized tax optimization within German investment laws (Spezial-Sondervermögen alternatives), and high-liquidity cash buffers. Our advisory team will follow up on this structure. What specific asset class of your portfolio would you like to review next?`;

        if (retrievedContext) {
          textDe += `\n\n[DEMO RAG AKTIV] Relevante Informationen aus der Wissensdatenbank gefunden:\n${retrievedContext}`;
          textEn += `\n\n[DEMO RAG ACTIVE] Matching text retrieved from knowledge base:\n${retrievedContext}`;
        }

        // Add a simple mock parser for demonstration when API Key is empty
        const lastMsgText = messages.length > 0 ? messages[messages.length - 1].text : "";
        const isBookingAttempt = lastMsgText.toLowerCase().includes("meeting") || 
                                 lastMsgText.toLowerCase().includes("appointment") || 
                                 lastMsgText.toLowerCase().includes("june") || 
                                 lastMsgText.toLowerCase().includes("uhr") || 
                                 lastMsgText.toLowerCase().includes("am") ||
                                 lastMsgText.toLowerCase().includes("person") ||
                                 lastMsgText.toLowerCase().includes("video") ||
                                 lastMsgText.toLowerCase().includes("tomorrow") ||
                                 lastMsgText.toLowerCase().includes("10");

        const allUserText = messages
          .filter((m: any) => m.sender === "user")
          .map((m: any) => m.text)
          .join(" ");

        const exName = extractName(allUserText);
        const exPhone = extractPhone(allUserText);
        const exDate = extractDate(allUserText);
        const exPurpose = extractPurpose(allUserText);

        const isBookingActive = isBookingAttempt || exName || exPhone || exDate || exPurpose;

        if (isBookingActive) {
          const missingFields: string[] = [];
          if (!exName) missingFields.push(lang === "de" ? "Name" : "Name");
          if (!exPhone) missingFields.push(lang === "de" ? "Telefonnummer" : "Phone Number");
          if (!exDate) missingFields.push(lang === "de" ? "Datum des Termins" : "Date of the appointment");
          if (!exPurpose) missingFields.push(lang === "de" ? "Zweck des Treffens" : "Purpose of the meeting");

          if (missingFields.length > 0) {
            // Ask for missing details
            const fieldsStr = missingFields.join(lang === "de" ? " und " : " and ");
            if (lang === "de") {
              textDe = `Ich würde dieses Treffen gerne für Sie eintragen. [DEMOMODUS] Bitte teilen Sie mir noch folgende Details mit: ${fieldsStr}.`;
            } else {
              textEn = `I would be happy to schedule this meeting for you. [DEMO MODE] Please provide the following details: ${fieldsStr}.`;
            }
          } else {
            // All 4 fields are provided, save the lead!
            const leadsPath = getWritablePath("leads.json");
            let leads: any[] = [];
            if (fs.existsSync(leadsPath)) {
              try {
                leads = JSON.parse(fs.readFileSync(leadsPath, "utf-8"));
              } catch (err) {
                leads = [];
              }
            }

            const mockLead = {
              id: "demo-" + Math.random().toString(36).substring(2, 7),
              timestamp: new Date().toISOString(),
              name: exName,
              email: "client@demo.prestige.com",
              phone: exPhone,
              meetingDate: exDate,
              meetingTime: "10:00 AM",
              meetingType: allUserText.toLowerCase().includes("person") ? "in-person" : "virtual",
              notes: exPurpose,
              status: "New"
            };

            leads.push(mockLead);
            fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2), "utf-8");
            
            if (lang === "de") {
              textDe = `Vielen Dank, Herr/Frau ${exName}. Ihr Treffen zum Thema "${exPurpose}" am ${exDate} wurde erfolgreich registriert. Wir werden uns unter der Nummer ${exPhone} mit Ihnen in Verbindung setzen. [DEMO DATENBANK-LOG AKTIV]`;
              textEn = textDe;
            } else {
              textEn = `Thank you, ${exName}. Your meeting regarding "${exPurpose}" on ${exDate} has been successfully registered. We will contact you at ${exPhone} shortly. [DEMO PERSISTENCE ACTIVE]`;
              textDe = textEn;
            }
          }
        }

        return res.json({
          text: lang === "de" ? textDe : textEn,
        });
      }

      const ai = getOpenAIClient();

      // Format current history for OpenAI Chat Completions messages
      const formattedMessages = [
        { role: "system" as const, content: sysInstruction },
        ...messages.map((m: any) => ({
          role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
          content: m.text,
        })),
      ];

      const response = await ai.chat.completions.create({
        model: config.model || "gpt-4o-mini",
        messages: formattedMessages,
        temperature: config.temperature !== undefined ? config.temperature : 0.7,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "chat_response",
            strict: true,
            schema: {
              type: "object",
              properties: {
                text: { type: "string" },
                extractedLead: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    meetingDate: { type: "string" },
                    meetingTime: { type: "string" },
                    meetingType: { type: "string" },
                    notes: { type: "string" }
                  },
                  required: ["name", "email", "phone", "meetingDate", "meetingTime", "meetingType", "notes"],
                  additionalProperties: false
                },
                hasLeadInfo: { type: "boolean" }
              },
              required: ["text", "extractedLead", "hasLeadInfo"],
              additionalProperties: false
            }
          }
        }
      });

      const rawContent = response.choices[0].message?.content || "{}";
      console.log("DEBUG: Raw OpenAI Response Content:", rawContent);
      const resObj = JSON.parse(rawContent);
      const responseText = resObj.text || "";

      const lead = resObj.extractedLead;
      const hasAllRequiredInfo = lead &&
        lead.name && lead.name.trim() !== "" && !lead.name.toLowerCase().includes("unknown") &&
        lead.phone && lead.phone.trim() !== "" && !lead.phone.toLowerCase().includes("unknown") &&
        ((lead.meetingDate && lead.meetingDate.trim() !== "" && !lead.meetingDate.toLowerCase().includes("unknown")) ||
         (lead.meetingTime && lead.meetingTime.trim() !== "" && !lead.meetingTime.toLowerCase().includes("unknown"))) &&
        lead.notes && lead.notes.trim() !== "" && !lead.notes.toLowerCase().includes("unknown");

      if (hasAllRequiredInfo) {
        const leadsPath = getWritablePath("leads.json");
        let leads: any[] = [];
        if (fs.existsSync(leadsPath)) {
          try {
            leads = JSON.parse(fs.readFileSync(leadsPath, "utf-8"));
          } catch (err) {
            leads = [];
          }
        }
        
        // Prevent duplicate bookings within 15 seconds
        const now = new Date();
        const isDuplicate = leads.some((l: any) => {
          const timeDiff = Math.abs(now.getTime() - new Date(l.timestamp).getTime());
          return timeDiff < 15000 && l.meetingDate === lead.meetingDate && l.meetingTime === lead.meetingTime;
        });

        if (!isDuplicate) {
          const newLead = {
            id: Math.random().toString(36).substring(2, 11),
            timestamp: now.toISOString(),
            name: lead.name,
            email: lead.email || "",
            phone: lead.phone,
            meetingDate: lead.meetingDate || "",
            meetingTime: lead.meetingTime || "",
            meetingType: lead.meetingType || "unknown",
            notes: lead.notes || "",
            status: "New"
          };

          leads.push(newLead);
          fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2), "utf-8");
          console.log("Real Lead Saved to DB:", newLead);
        }
      }

      res.json({ text: responseText });
    } catch (error: any) {
      console.error("OpenAI chat API error:", error);
      res.status(500).json({ error: "Strategic transmission was temporarily interrupted." });
    }
  });

  // Get Admin CRM Leads list
  app.get("/api/admin/leads", (req, res) => {
    const leadsPath = getWritablePath("leads.json");
    try {
      if (fs.existsSync(leadsPath)) {
        const raw = fs.readFileSync(leadsPath, "utf-8");
        return res.json(JSON.parse(raw));
      }
      return res.json([]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read leads database." });
    }
  });

  // Update Admin CRM Lead Status
  app.post("/api/admin/leads/status", (req, res) => {
    const { id, status } = req.body;
    const leadsPath = getWritablePath("leads.json");
    try {
      if (fs.existsSync(leadsPath)) {
        const leads = JSON.parse(fs.readFileSync(leadsPath, "utf-8"));
        const lead = leads.find((l: any) => l.id === id);
        if (lead) {
          lead.status = status;
          fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2), "utf-8");
          return res.json({ success: true });
        }
      }
      return res.status(404).json({ error: "Lead not found." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update lead status." });
    }
  });

  // Delete Admin CRM Lead
  app.delete("/api/admin/leads/:id", (req, res) => {
    const { id } = req.params;
    const leadsPath = getWritablePath("leads.json");
    try {
      if (fs.existsSync(leadsPath)) {
        let leads = JSON.parse(fs.readFileSync(leadsPath, "utf-8"));
        const filtered = leads.filter((l: any) => l.id !== id);
        fs.writeFileSync(leadsPath, JSON.stringify(filtered, null, 2), "utf-8");
        return res.json({ success: true });
      }
      return res.status(404).json({ error: "Leads database is empty." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete lead entry." });
    }
  });

  // Admin Authentication
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin123") {
      return res.json({ success: true, token: "prestige_admin_session_token_2026" });
    }
    return res.status(401).json({ error: "Invalid credentials" });
  });

  // Get Chatbot Config
  app.get("/api/chatbot/config", (req, res) => {
    const configPath = getWritablePath(path.join("src", "data", "chatbot_config.json"));
    try {
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, "utf-8");
        return res.json(JSON.parse(raw));
      }
      return res.json({
        instructions: `You are Senior Wealth Director Markus von Preußen, a seasoned family office architect and leading partner at Prestige Advisory.
Your tone is serious, elite, highly knowledgeable, polite, and reassuring.
You deal with high-net-worth clients who value confidentiality, institutional precision, and long-term risk preservation.
Keep your responses succinct, structured, and profoundly strategic. Do not write generic conversational introductory sentences.`,
        model: "gpt-4o-mini",
        temperature: 0.7
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read chatbot config" });
    }
  });

  // Save Chatbot Config
  app.post("/api/chatbot/config", (req, res) => {
    const { instructions, model, temperature } = req.body;
    const configPath = getWritablePath(path.join("src", "data", "chatbot_config.json"));
    try {
      const config = { instructions, model, temperature: parseFloat(temperature) || 0.7 };
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save chatbot config" });
    }
  });

  // List Chatbot Resources
  app.get("/api/chatbot/resources", (req, res) => {
    const resourcesDir = getWritablePath(path.join("src", "data", "resources"));
    try {
      if (!fs.existsSync(resourcesDir)) {
        return res.json([]);
      }
      const files = fs.readdirSync(resourcesDir).filter(f => f.endsWith(".txt"));
      const list = files.map(file => {
        const filePath = path.join(resourcesDir, file);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, "utf-8");
        const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
        return {
          name: file.replace(".txt", ""),
          size: stats.size,
          wordCount
        };
      });
      return res.json(list);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to list resources" });
    }
  });

  // Add Chatbot Resource (Base64 PDF or TXT)
  app.post("/api/chatbot/resources", async (req, res) => {
    const { name, type, data } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: "Filename and file data are required" });
    }
    const resourcesDir = getWritablePath(path.join("src", "data", "resources"));
    if (!fs.existsSync(resourcesDir)) {
      fs.mkdirSync(resourcesDir, { recursive: true });
    }

    const buffer = Buffer.from(data, "base64");
    let textContent = "";

    try {
      if (type === "application/pdf" || name.toLowerCase().endsWith(".pdf")) {
        const parser = new PDFParse(new Uint8Array(buffer));
        const parsed = await parser.getText();
        textContent = parsed.text || "";
      } else {
        textContent = buffer.toString("utf-8");
      }

      if (!textContent.trim()) {
        return res.status(400).json({ error: "Extracted content is empty." });
      }

      // Sanitize filename: replace non-alphanumeric with underscores to prevent directory traversal
      const safeName = name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const txtName = safeName.replace(/\.[^/.]+$/, "") + ".txt";
      fs.writeFileSync(path.join(resourcesDir, txtName), textContent, "utf-8");
      return res.json({ success: true, name: txtName });
    } catch (err: any) {
      console.error("Error parsing file resource:", err);
      return res.status(500).json({ error: err.message || "Failed to process resource file" });
    }
  });

  // Delete Chatbot Resource
  app.delete("/api/chatbot/resources/:name", (req, res) => {
    const { name } = req.params;
    const resourcesDir = getWritablePath(path.join("src", "data", "resources"));
    const safeName = name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const txtName = safeName.endsWith(".txt") ? safeName : `${safeName}.txt`;
    const filePath = path.join(resourcesDir, txtName);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ success: true });
      }
      return res.status(404).json({ error: "Resource not found" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete resource" });
    }
  });

  // Get Active Content
  app.get("/api/content", (req, res) => {
    const filePath = getWritablePath(path.join("src", "data", "site_content.json"));
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        return res.json(JSON.parse(raw));
      }
      return res.status(404).json({ error: "Content file not found" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to read content" });
    }
  });

  // Save Content Version
  app.post("/api/content/save", (req, res) => {
    const { content, description } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const contentPath = getWritablePath(path.join("src", "data", "site_content.json"));
    const versionsPath = getWritablePath(path.join("src", "data", "content_versions.json"));

    try {
      // 1. Write to active site_content.json
      fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), "utf-8");

      // 2. Load and update history
      let versions: any[] = [];
      if (fs.existsSync(versionsPath)) {
        const raw = fs.readFileSync(versionsPath, "utf-8");
        try {
          versions = JSON.parse(raw);
        } catch (e) {
          versions = [];
        }
      }

      const newVersion = {
        id: `v_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Admin",
        description: description || "Updated text content via CRM Dashboard",
        content: content
      };

      versions.unshift(newVersion); // Newest first
      fs.writeFileSync(versionsPath, JSON.stringify(versions, null, 2), "utf-8");

      return res.json({ success: true, versionId: newVersion.id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save content version" });
    }
  });

  // Get Version History List
  app.get("/api/content/versions", (req, res) => {
    const versionsPath = getWritablePath(path.join("src", "data", "content_versions.json"));
    try {
      if (fs.existsSync(versionsPath)) {
        const raw = fs.readFileSync(versionsPath, "utf-8");
        const versions = JSON.parse(raw);
        // Exclude snapshot content to save size in listing
        const list = versions.map((v: any) => ({
          id: v.id,
          timestamp: v.timestamp,
          author: v.author,
          description: v.description
        }));
        return res.json(list);
      }
      return res.json([]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to get versions" });
    }
  });

  // Restore Version
  app.post("/api/content/restore", (req, res) => {
    const { versionId } = req.body;
    if (!versionId) {
      return res.status(400).json({ error: "Version ID is required" });
    }

    const contentPath = getWritablePath(path.join("src", "data", "site_content.json"));
    const versionsPath = getWritablePath(path.join("src", "data", "content_versions.json"));

    try {
      if (!fs.existsSync(versionsPath)) {
        return res.status(404).json({ error: "No version history exists" });
      }

      const rawVersions = fs.readFileSync(versionsPath, "utf-8");
      const versions = JSON.parse(rawVersions);
      const targetVersion = versions.find((v: any) => v.id === versionId);

      if (!targetVersion) {
        return res.status(404).json({ error: "Version not found" });
      }

      // Write target snapshot content to site_content.json
      fs.writeFileSync(contentPath, JSON.stringify(targetVersion.content, null, 2), "utf-8");

      // Log the restore event in the history too!
      const newVersion = {
        id: `v_${Date.now()}`,
        timestamp: new Date().toISOString(),
        author: "Admin",
        description: `Restored back to version ${versionId} (${targetVersion.description})`,
        content: targetVersion.content
      };
      versions.unshift(newVersion);
      fs.writeFileSync(versionsPath, JSON.stringify(versions, null, 2), "utf-8");

      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to restore version" });
    }
  });

  // Serve static UI / Integrate Vite dev server
  async function initLocalServer() {
    const PORT = parseInt(process.env.PORT || "3001");
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
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

  if (!process.env.VERCEL) {
    initLocalServer();
  }

// Highly realistic mock generator to serve as fallback when API key is unconfigured
function getMockAdviceReport(
  name: string,
  assets: number,
  riskTolerance: string,
  goal: string,
  timeHorizon: number,
  regionalContext: string,
  specialties: string[],
  lang: string = "en"
) {
  const assetsNum = Number(assets);
  const isAggressive = riskTolerance.toLowerCase().includes("aggressive") || riskTolerance.toLowerCase().includes("high");
  const isConservative = riskTolerance.toLowerCase().includes("conservative") || riskTolerance.toLowerCase().includes("low");

  const stocksPercent = isAggressive ? 65 : isConservative ? 25 : 45;
  const bondsPercent = isAggressive ? 15 : isConservative ? 45 : 25;
  const alternativesPercent = isAggressive ? 15 : isConservative ? 10 : 15;
  const cashPercent = 100 - (stocksPercent + bondsPercent + alternativesPercent);

  if (lang === "de") {
    return {
      clientGreeting: `Sehr geehrte(r) ${name}, es ist uns eine außerordentliche Ehre, Ihnen diesen maßgeschneiderten Vorschlag zur Finanzarchitektur vorzulegen. Für einen Zielhorizont von ${timeHorizon} Jahren haben wir mit Ihrem anlegbaren Nettovermögen von €${assetsNum.toLocaleString()} eine diversifizierte, überzeugende Allokationsstruktur entworfen, die darauf ausgelegt ist, das Kernkapital zu erhalten, während taktische Allokationen unkorreliertes Alpha unter der Gerichtsbarkeit von ${regionalContext} sichern.`,
      assetAllocation: [
        {
          assetClass: "Globale Aktien (ESG-konformer Kern)",
          percentage: stocksPercent,
          rationale: "Optimierte globale Indexallokation mit Schwerpunkt auf hoher Dividendenausschüttung und CO2-effizienten Führungsprofilen.",
        },
        {
          assetClass: "Institutionelle Staats- & Unternehmensanleihen",
          percentage: bondsPercent,
          rationale: "Gestaffelte europäische und US-amerikanische Staatsanleihen zur Sicherung stabiler, vorhersehbarer Renditen bei gleichzeitigem Schutz der Liquiditätsreserven.",
        },
        {
          assetClass: "Alternative Anlagen & Direktplatzierungen",
          percentage: alternativesPercent,
          rationale: "Direkte Beteiligungen an Immobilien-Trusts und ESG-fokussierten Venture-Pools zur Erzielung einer geringen Korrelation zu öffentlichen Aktien-Benchmarks.",
        },
        {
          assetClass: "Taktische Liquidität & Kapitalschutzreserven",
          percentage: cashPercent,
          rationale: "Sofortige Kapitalverfügbarkeit zur Ausnutzung zyklischer Marktverwerfungen und zur Wahrung extremer systemischer Flexibilität.",
        },
      ],
      strategicPillars: [
        {
          title: "Pfeiler I: Umfassende Steueroptimierung & BaFin-Strukturschutz",
          description: "Restrukturierung von Vermögensverwaltungsgesellschaften oder Nutzung deutscher Spezialfondsmodelle zur erheblichen Minimierung der Kapitalsteuerbelastung.",
          steps: [
            "Einrichtung von Holding-Strukturen zur Thesaurierung von Kursgewinnen.",
            "Umstrukturierung globaler Dividendenflüsse durch Quellensteuerminderungsabkommen.",
            "Konsultation regionaler Steuerspezialisten zur Prüfung von Altvermögen.",
          ],
        },
        {
          title: "Pfeiler II: Generationenübergreifende Nachfolgestruktur & Nachlassarchitektur",
          description: "Implementierung langfristiger Treuhandkonstrukte, um das familiäre Kernvermögen vor plötzlichen Erbschaftsteuerbewertungsspitzen oder Übergangskrisen zu schützen.",
          steps: [
            "Entwurf spezieller Corporate-Governance-Kodizes für Familiengesellschaften.",
            "Einbindung von meilensteinbasierten Übertragungsmodellen für gesetzliche Erben.",
            "Ausrichtung von Private-Equity-Investitionen an ESG-Nachhaltigkeitsrichtlinien.",
          ],
        },
      ],
      regionalTactics: [
        {
          name: "Deutsche Steueroptimierung (Sondervermögen-Schutz)",
          detail: "Nutzung spezifischer deutscher Vermögensstrukturen (wie § 26 KAGB) zur Erzielung eines strukturellen Aufschubs der Kapitalertragsteuer nach den geltenden örtlichen Steuervorschriften.",
        },
        {
          name: "ESG-Klimaanpassungsplan",
          detail: "Screening von 100 % der öffentlich gehandelten Aktien anhand von SFDR-Artikel-9-Indikatoren, um Vermögenswerte vor der drohenden Bepreisung von CO2-Emissionen zu schützen.",
        },
      ],
      timelinePhases: [
        {
          phase: "Phase 1: Vermögensprüfung & Rebalancing-Einleitung",
          duration: "Monate 1 - 2",
          actions: [
            "Durchführung eines vollständigen Prüfprotokolls für bestehende Aktienbestände und Rentenportfolios.",
            "Identifizierung und Veräußerung redundanter, gebührenintensiver Publikumsfonds.",
            "Initiierung hochverzinslicher taktischer Liquiditätsrücklagen.",
          ],
        },
        {
          phase: "Phase 2: Integration des Strukturschutzes",
          duration: "Monate 3 - 6",
          actions: [
            "Gründung rechtlicher Stiftungen / Treuhandstrukturen gemäß den globalen Governance-Zielen.",
            "Staffelung von Kaufaufträgen für globale Kernaktien innerhalb steuerlich begünstigter Konten.",
          ],
        },
      ],
      disclaimer: "BaFin-Hinweis: Beratungsleistungen für sehr vermögende Kunden unterliegen der Marktvolatilität. Die obigen strategischen Projektionen garantieren keine tatsächlichen Renditen. Erträge aus der Vergangenheit sind kein Indikator für zukünftiges Kapitalwachstum. Dies ist ein privater Entwurf der Unternehmensberatung.",
    };
  }

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

export default app;
