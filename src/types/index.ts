import type {
  User,
  Profile,
  Listing,
  Category,
  Review,
  Conversation,
  ConversationParticipant,
  Message,
} from "@prisma/client";

// ─── Extended Types ───────────────────────────────────────────────────────────

export type UserWithProfile = User & {
  profile: Profile | null;
};

export type ListingWithDetails = Listing & {
  user: {
    id: string;
    name: string | null;
    profile: {
      avatarUrl: string | null;
      district: string | null;
      averageRating: number;
      reviewCount: number;
    } | null;
  };
  category: Category;
  _count: { reviews: number };
};

export type ConversationWithDetails = Conversation & {
  participants: (ConversationParticipant & {
    user: { id: string; name: string | null; profile: { avatarUrl: string | null } | null };
  })[];
  messages: MessageWithSender[];
  listing: { id: string; title: string } | null;
};

export type MessageWithSender = Message & {
  sender: {
    id: string;
    name: string | null;
    profile: { avatarUrl: string | null } | null;
  };
};

export type ReviewWithAuthor = Review & {
  author: {
    id: string;
    name: string | null;
    profile: { avatarUrl: string | null } | null;
  };
};

// ─── Berlin Districts ─────────────────────────────────────────────────────────

export const BERLIN_DISTRICTS = [
  { value: "mitte", labelKey: "districts.mitte" },
  { value: "friedrichshain-kreuzberg", labelKey: "districts.friedrichshainKreuzberg" },
  { value: "pankow", labelKey: "districts.pankow" },
  { value: "charlottenburg-wilmersdorf", labelKey: "districts.charlottenburgWilmersdorf" },
  { value: "spandau", labelKey: "districts.spandau" },
  { value: "steglitz-zehlendorf", labelKey: "districts.steglitzZehlendorf" },
  { value: "tempelhof-schoeneberg", labelKey: "districts.tempelhofSchoeneberg" },
  { value: "neukoelln", labelKey: "districts.neukoelln" },
  { value: "treptow-koepenick", labelKey: "districts.treptowKoepenick" },
  { value: "marzahn-hellersdorf", labelKey: "districts.marzahnHellersdorf" },
  { value: "lichtenberg", labelKey: "districts.lichtenberg" },
  { value: "reinickendorf", labelKey: "districts.reinickendorf" },
] as const;

export const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  "mitte":                      { lat: 52.5200, lng: 13.4050 },
  "friedrichshain-kreuzberg":   { lat: 52.5003, lng: 13.4494 },
  "pankow":                     { lat: 52.5733, lng: 13.4124 },
  "charlottenburg-wilmersdorf": { lat: 52.5010, lng: 13.3040 },
  "spandau":                    { lat: 52.5350, lng: 13.2002 },
  "steglitz-zehlendorf":        { lat: 52.4380, lng: 13.3260 },
  "tempelhof-schoeneberg":      { lat: 52.4680, lng: 13.3830 },
  "neukoelln":                  { lat: 52.4810, lng: 13.4350 },
  "treptow-koepenick":          { lat: 52.4430, lng: 13.5720 },
  "marzahn-hellersdorf":        { lat: 52.5400, lng: 13.5780 },
  "lichtenberg":                { lat: 52.5230, lng: 13.4980 },
  "reinickendorf":              { lat: 52.5890, lng: 13.3350 },
};

export type BerlinDistrict = (typeof BERLIN_DISTRICTS)[number]["value"];

// ─── Price Types ──────────────────────────────────────────────────────────────

export const PRICE_TYPES = ["free", "hourly", "fixed", "negotiable"] as const;
export type PriceType = (typeof PRICE_TYPES)[number];
