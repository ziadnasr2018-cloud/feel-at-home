import { GoogleGenAI } from '@google/genai';

// Realistic Egyptian student accommodation photo pool for instant preview and fallback
export const EGYPTIAN_STUDENT_PRESET_PHOTOS = [
  {
    title: 'Dokki Sunny Student Bedroom & Study Desk',
    url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
    description: 'Natural afternoon Cairo sunlight, sturdy wooden study desk, ceiling fan, and classic Egyptian mosaic floor tiles (balat).',
  },
  {
    title: 'Warm Egyptian Family Homestay & Living Salon',
    url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1200&q=80',
    description: 'Traditional Egyptian family salon with warm oriental carpets, family dining table for home-cooked meals, and books.',
  },
  {
    title: 'Cairo Balcony & Historic Street View',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    description: 'Wrought-iron balcony overlooking quiet tree-lined Dokki street with potted jasmine and morning breeze.',
  },
  {
    title: 'Nasr City Student Room with High Ceilings',
    url: 'https://images.unsplash.com/photo-1502005229762-ae1b46d3383e?auto=format&fit=crop&w=1200&q=80',
    description: 'Bright Cairo apartment bedroom with classic wooden shutters, high ceilings, split AC, and wardrobe.',
  },
  {
    title: 'Shubra Student Flat Twin Bedroom',
    url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    description: 'Clean, budget-friendly twin student beds near Metro Line 2 for engineering and medical students.',
  },
  {
    title: 'Egyptian Family Home Dining & Kitchen',
    url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    description: 'Equipped Cairo kitchen where host families prepare daily molokhia, mahshi, and fresh Egyptian breakfast for hosted students.',
  },
  {
    title: 'New Cairo Villa Garden Student Room',
    url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    description: 'Quiet garden-facing master bedroom near GUC & AUC with private bath and study desk.',
  },
  {
    title: 'Sheikh Zayed Modern Student Flat',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    description: 'Modern student flat with balcony, study nook, and proximity to Nile University & Smart Village.',
  },
];


// Helper to get active API key
function getApiKey(): string {
  return (
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.GEMINI_API_KEY ||
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    ''
  );
}

// 1. AI Listing Assistant for Property Hosts
export async function generateListingDescription(details: {
  title: string;
  type: string;
  neighborhood: string;
  city: string;
  governorate: string;
  bedrooms: number;
  priceEgp: number;
  amenities: string[];
}): Promise<string> {
  const apiKey = getApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert student housing specialist in Greater Cairo, Egypt.
Write an authentic, warm, realistic property description (120-150 words) for Egyptian university students and young relocating professionals.
Listing details:
- Title: ${details.title}
- Type: ${details.type}
- Location: ${details.neighborhood}, ${details.city}, ${details.governorate}
- Monthly Rent: ${details.priceEgp} EGP
- Bedrooms: ${details.bedrooms}
- Amenities: ${details.amenities.join(', ')}

Highlight Egyptian student daily realities: walking distance to Cairo Metro lines (Line 1/2/3) or campus microbuses, quiet study hours, natural gas availability, water pressure, and clear lease terms. Write with authentic Cairo warmth.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini description generation fallback:', err);
    }
  }

  // Authentic Egyptian Student Template Fallback
  return `Spacious, sunlit ${details.type.toLowerCase().replace('_', ' ')} located in a safe, quiet residential street in ${details.neighborhood}, ${details.city} (${details.governorate}).

Specifically arranged for university students and young professionals seeking an honest, study-friendly home. Features ${details.bedrooms} bedroom(s) with solid ventilation, natural sunlight, and reliable amenities including ${details.amenities.slice(0, 4).join(', ')}.

Conveniently located within a short walk to Cairo Metro connections, local microbus routes, supermarkets, and quiet study cafes. Monthly rent is ${details.priceEgp.toLocaleString()} EGP with transparent terms. Serious students are invited to schedule an in-person viewing.`;
}

// 2. Natural Language Housing Search
export async function parseNaturalLanguageSearch(query: string): Promise<{
  governorate?: string;
  city?: string;
  type?: string;
  maxPrice?: number;
  extractedKeywords: string;
}> {
  const q = query.toLowerCase();
  let governorate = 'ALL';
  let city = 'ALL';
  let type = 'ALL';
  let maxPrice: number | undefined;

  if (
    q.includes('cairo') ||
    q.includes('nasr city') ||
    q.includes('new cairo') ||
    q.includes('maadi') ||
    q.includes('abbaseya') ||
    q.includes('tagamoa')
  ) {
    governorate = 'Cairo';
  } else if (
    q.includes('giza') ||
    q.includes('dokki') ||
    q.includes('zayed') ||
    q.includes('october') ||
    q.includes('mohandessin')
  ) {
    governorate = 'Giza';
  } else if (q.includes('qalyubia') || q.includes('shubra') || q.includes('benha')) {
    governorate = 'Qalyubia';
  }

  if (q.includes('room') && !q.includes('apartment') && !q.includes('flat')) {
    type = 'PRIVATE_ROOM';
  } else if (q.includes('shared')) {
    type = 'SHARED_ROOM';
  } else if (q.includes('apartment') || q.includes('flat')) {
    type = 'PRIVATE_APARTMENT';
  }

  const priceMatch = query.match(/(\d{1,2}[,\.]?\d{3})/);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1].replace(/[,.]/, ''));
  }

  return {
    governorate,
    city,
    type,
    maxPrice,
    extractedKeywords: query,
  };
}

// 3. Egyptian Student Housing Image Generator (gemini-nano-banana-2.1)
export async function generateEgyptianStudentImage(params: {
  prompt: string;
  resolution?: '1K' | '2K' | '4K';
}): Promise<{ imageUrl: string; description: string }> {
  const apiKey = getApiKey();
  const refinedPrompt = `A realistic, authentic photograph of an Egyptian student apartment accommodation in Greater Cairo: ${params.prompt}. Warm afternoon Egyptian sunlight coming through balcony doors, Cairo architectural details, authentic Egyptian tiled floor, wooden student study desk with Arabic & English textbooks and study lamp, cozy single bed, natural ventilation, ceiling fan, realistic university student living environment. Photorealistic, warm golden hour lighting, 8k resolution.`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [{ text: refinedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
            imageSize: params.resolution || '1K',
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          return {
            imageUrl: `data:${mime};base64,${part.inlineData.data}`,
            description: params.prompt,
          };
        }
      }
    } catch (err) {
      console.warn('Gemini image generation fallback:', err);
    }
  }

  // Pick the most relevant preset image based on keyword
  const p = params.prompt.toLowerCase();
  let selected = EGYPTIAN_STUDENT_PRESET_PHOTOS[0];
  if (p.includes('balcony') || p.includes('view') || p.includes('street')) {
    selected = EGYPTIAN_STUDENT_PRESET_PHOTOS[1];
  } else if (p.includes('salon') || p.includes('living') || p.includes('nasr')) {
    selected = EGYPTIAN_STUDENT_PRESET_PHOTOS[2];
  } else if (p.includes('shubra') || p.includes('shared') || p.includes('twin')) {
    selected = EGYPTIAN_STUDENT_PRESET_PHOTOS[3];
  } else if (p.includes('new cairo') || p.includes('villa') || p.includes('guc') || p.includes('auc')) {
    selected = EGYPTIAN_STUDENT_PRESET_PHOTOS[4];
  } else if (p.includes('benha') || p.includes('med') || p.includes('study')) {
    selected = EGYPTIAN_STUDENT_PRESET_PHOTOS[5];
  }

  return {
    imageUrl: selected.url,
    description: `${selected.title} — ${selected.description}`,
  };
}

// 4. Multi-turn Cairo Student Housing Advisor Chatbot
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export async function askCairoHousingAdvisor(
  history: ChatMessage[],
  newMessage: string
): Promise<string> {
  const apiKey = getApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are "Amm Gamal" (عم جمال), a kind, savvy, trustworthy Greater Cairo housing advisor for "Feel at Home" (Official Slogan: "A home easy to find, safe to stay.").
You specialize in helping university students (Cairo University, Ain Shams, GUC, AUC, Benha, Shoubra Engineering) and young relocating professionals find safe housing in Cairo, Giza, and Qalyubia.
Key knowledge:
- Dokki & Mesaha: Best for Cairo Univ students (walk to campus, Line 2 Dokki Metro, 3,000-5,000 EGP rooms).
- Abbaseya: Best for Ain Shams Univ (Line 3 Metro, Demerdash, 2,500-4,000 EGP).
- Shubra El-Kheima: Budget-friendly (Line 2 Metro terminus, 1,500-2,500 EGP shared beds, close to Shoubra Eng).
- New Cairo / 5th Settlement: GUC & AUC hubs (duplexes, 4,500-8,000 EGP).
- Sheikh Zayed: Smart Village tech engineers (Hyper One, modern compounds).
- Anti-scam rule: Emphasize to NEVER wire money via Vodafone Cash or InstaPay before inspecting in person and signing a formal contract.
Respond warmly, helpfully, and concisely (2-4 paragraphs). Support both English and Egyptian Arabic words seamlessly.`;

      const contents = history.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));
      contents.push({
        role: 'user',
        parts: [{ text: newMessage }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
        },
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini chat fallback:', err);
    }
  }

  // Intelligent Cairo Housing Advisory Fallback
  const q = newMessage.toLowerCase();
  if (q.includes('cairo univ') || q.includes('dokki') || q.includes('giza')) {
    return `For **Cairo University**, Dokki (especially around Mesaha Square, Tahrir St, and Dokki Metro Line 2) is the #1 choice for students. You can walk to the campus in 7-10 minutes, saving daily commute stress. Furnished student rooms average 3,200 to 4,500 EGP/month. Remember: Always inspect the water pressure and water heater in person before giving any deposit!`;
  } else if (q.includes('ain shams') || q.includes('abbaseya')) {
    return `For **Ain Shams University**, look in Abbaseya (near Abbaseya Metro Line 3 and Al-Demerdash) or District 7 in Nasr City. Abbaseya allows you to walk straight into the science or medical campus. Rooms generally range from 2,500 to 3,800 EGP/month.`;
  } else if (q.includes('scam') || q.includes('safe') || q.includes('deposit') || q.includes('money')) {
    return `⚠️ **Crucial Greater Cairo Rental Rule:** Never send any booking fee or deposit via **Vodafone Cash or InstaPay** before seeing the unit and landlord in person! Legitimate hosts will happily meet you at the flat, show you around, and sign a paper lease agreement with national ID copies.`;
  } else {
    return `Welcome to Greater Cairo! Whether you study at Cairo University, Ain Shams, GUC, AUC, or Benha, the key to safe housing is choosing a flat within a 10-minute walk of a **Cairo Metro station** or direct microbus route. Tell me your university campus and monthly budget in EGP, and I'll calculate your best location match!`;
  }
}
