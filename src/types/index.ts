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

export type BerlinDistrict = (typeof BERLIN_DISTRICTS)[number]["value"];

// ─── Price Types ──────────────────────────────────────────────────────────────

export const PRICE_TYPES = ["free", "hourly", "fixed", "negotiable"] as const;
export type PriceType = (typeof PRICE_TYPES)[number];
