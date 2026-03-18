import {
  Bell,
  Compass,
  House,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";

export const navigationItems = [
  { label: "Home", path: "/home", icon: House },
  { label: "Discover", path: "/discover", icon: Compass },
  { label: "Matches", path: "/matches", icon: Sparkles },
  { label: "Messages", path: "/messages", icon: MessageCircle },
  { label: "Notifications", path: "/notifications", icon: Bell },
  { label: "Search", path: "/search", icon: Search },
  { label: "Create", path: "/create", icon: PlusSquare },
  { label: "Profile", path: "/profile/:username", icon: UserRound },
  { label: "Settings", path: "/settings", icon: Settings },
];

export const quickStats = [
  { label: "Likes Left", value: "Unlimited" },
  { label: "Nearby", value: "34" },
  { label: "Boost", value: "1 Active" },
];

export const interestOptions = [
  "Music",
  "Travel",
  "Photography",
  "Fitness",
  "Fashion",
  "Gaming",
  "Food",
  "Nightlife",
  "Movies",
  "Books",
];

export const settingSections = [
  "Edit profile",
  "Privacy settings",
  "Blocked users",
  "Change password",
  "Logout",
];

export const authHighlights = [
  "Real-time matching and chat",
  "Nearby discovery with premium filters",
  "Stories, posts, and social profiles",
];

export const logoutAction = {
  label: "Logout",
  icon: LogOut,
};
