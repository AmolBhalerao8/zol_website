export type VapiVoiceOption = {
  id: string;
  name: string;
  provider: "vapi";
  gender: string;
  accent: string;
  age: string;
  description: string;
  isNew?: boolean;
};

export const VAPI_VOICES: VapiVoiceOption[] = [
  {
    id: "Elliot",
    name: "Elliot",
    provider: "vapi",
    gender: "Male",
    accent: "Canadian",
    age: "20s",
    description: "Realistic, friendly, professional, and soothing.",
  },
  {
    id: "Savannah",
    name: "Savannah",
    provider: "vapi",
    gender: "Female",
    accent: "American (Southern)",
    age: "20s",
    description: "Realistic and straightforward.",
  },
  {
    id: "Rohan",
    name: "Rohan",
    provider: "vapi",
    gender: "Male",
    accent: "Indian American",
    age: "20s",
    description: "Realistic, bright, and energetic.",
  },
  {
    id: "Emma",
    name: "Emma",
    provider: "vapi",
    gender: "Female",
    accent: "Asian American",
    age: "20s",
    description: "Realistic, warm, and conversational.",
    isNew: true,
  },
  {
    id: "Clara",
    name: "Clara",
    provider: "vapi",
    gender: "Female",
    accent: "American",
    age: "30s",
    description: "Realistic, warm, and professional.",
    isNew: true,
  },
  {
    id: "Nico",
    name: "Nico",
    provider: "vapi",
    gender: "Male",
    accent: "American",
    age: "20s",
    description: "Realistic, young, casual, and natural.",
    isNew: true,
  },
  {
    id: "Kai",
    name: "Kai",
    provider: "vapi",
    gender: "Male",
    accent: "American",
    age: "30s",
    description: "Realistic, friendly, relaxed, and approachable.",
    isNew: true,
  },
  {
    id: "Sagar",
    name: "Sagar",
    provider: "vapi",
    gender: "Male",
    accent: "Indian American",
    age: "20s",
    description: "Realistic, steady, and professional.",
    isNew: true,
  },
  {
    id: "Godfrey",
    name: "Godfrey",
    provider: "vapi",
    gender: "Male",
    accent: "American",
    age: "20s",
    description: "Realistic, young, and energetic.",
    isNew: true,
  },
  {
    id: "Neil",
    name: "Neil",
    provider: "vapi",
    gender: "Male",
    accent: "Indian American",
    age: "20s",
    description: "Realistic, clear, and professional.",
    isNew: true,
  },
  {
    id: "Leo",
    name: "Leo",
    provider: "vapi",
    gender: "Male",
    accent: "American",
    age: "20s",
    description: "Clear, confident, and customer-ready.",
  },
  {
    id: "Zoe",
    name: "Zoe",
    provider: "vapi",
    gender: "Female",
    accent: "American",
    age: "20s",
    description: "Warm, polished, and approachable.",
  },
  {
    id: "Mia",
    name: "Mia",
    provider: "vapi",
    gender: "Female",
    accent: "American",
    age: "20s",
    description: "Friendly, natural, and easy to listen to.",
  },
  {
    id: "Jess",
    name: "Jess",
    provider: "vapi",
    gender: "Female",
    accent: "American",
    age: "30s",
    description: "Professional, calm, and conversational.",
  },
  {
    id: "Zac",
    name: "Zac",
    provider: "vapi",
    gender: "Male",
    accent: "American",
    age: "20s",
    description: "Relaxed, upbeat, and natural.",
  },
  {
    id: "Dan",
    name: "Dan",
    provider: "vapi",
    gender: "Male",
    accent: "American",
    age: "30s",
    description: "Steady, professional, and trustworthy.",
  },
  {
    id: "Leah",
    name: "Leah",
    provider: "vapi",
    gender: "Female",
    accent: "American",
    age: "30s",
    description: "Warm, articulate, and business-oriented.",
  },
  {
    id: "Tara",
    name: "Tara",
    provider: "vapi",
    gender: "Female",
    accent: "American",
    age: "20s",
    description: "Bright, helpful, and conversational.",
  },
];

const VAPI_VOICE_MAP = new Map(VAPI_VOICES.map((voice) => [voice.id, voice]));

export function getVapiVoice(voiceId: string): VapiVoiceOption | undefined {
  return VAPI_VOICE_MAP.get(voiceId);
}

export function isValidVapiVoiceId(voiceId: string): voiceId is string {
  return VAPI_VOICE_MAP.has(voiceId);
}

export function getVapiVoiceConfig(voiceId: string) {
  const voice = getVapiVoice(voiceId);

  if (!voice) {
    throw new Error(`Unknown Vapi voice: ${voiceId}`);
  }

  return {
    provider: voice.provider,
    voiceId: voice.id,
  };
}

export function getVapiVoiceLabel(voiceId: string | null | undefined): string {
  if (!voiceId) {
    return "Not selected";
  }

  return getVapiVoice(voiceId)?.name ?? voiceId;
}
