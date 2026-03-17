export const demoUser = {
  _id: "user-demo-1",
  name: "Nova Lane",
  username: "novalane",
  email: "nova@spark.app",
  age: 23,
  gender: "Woman",
  bio: "Late-night playlists, rooftop ramen, and random airport tickets.",
  interests: ["Music", "Travel", "Photography", "Fitness"],
  location: {
    label: "Bengaluru, India",
    city: "Bengaluru",
    country: "India",
  },
  profilePhotos: [
    {
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
      isPrimary: true,
    },
  ],
  followers: ["u2", "u3", "u4", "u5"],
  following: ["u2", "u6", "u7"],
  matches: ["m1", "m2", "m3"],
  subscription: {
    isPremium: true,
    plan: "gold",
  },
};

export const demoStories = [
  {
    _id: "story-1",
    author: {
      _id: "u2",
      username: "zyra",
      name: "Zyra Noor",
      profilePhotos: [
        {
          url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    media: {
      url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80",
      type: "image",
    },
    caption: "Neon coffee date mood",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    _id: "story-2",
    author: {
      _id: "user-demo-1",
      username: "novalane",
      name: "Nova Lane",
      profilePhotos: demoUser.profilePhotos,
    },
    media: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      type: "image",
    },
    caption: "Golden hour and zero plans",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "story-3",
    author: {
      _id: "u3",
      username: "kairo",
      name: "Kairo Reed",
      profilePhotos: [
        {
          url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    media: {
      url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
      type: "image",
    },
    caption: "Gym, code, repeat",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export const demoPosts = [
  {
    _id: "post-1",
    author: {
      _id: "u2",
      username: "zyra",
      name: "Zyra Noor",
      profilePhotos: demoStories[0].author.profilePhotos,
      location: { label: "Mumbai, India" },
    },
    media: [
      {
        url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=1200&q=80",
        type: "image",
      },
    ],
    caption: "Soft launch of a very good week. #citylights #maincharacter",
    hashtags: ["citylights", "maincharacter"],
    likes: ["user-demo-1", "u4", "u5", "u7"],
    comments: [
      {
        _id: "c1",
        user: {
          username: "novalane",
          profilePhotos: demoUser.profilePhotos,
        },
        comment: "You absolutely ate this.",
      },
    ],
    shareCount: 4,
    createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
  },
  {
    _id: "post-2",
    author: {
      _id: "u3",
      username: "kairo",
      name: "Kairo Reed",
      profilePhotos: demoStories[2].author.profilePhotos,
      location: { label: "Delhi, India" },
    },
    media: [
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
        type: "image",
      },
    ],
    caption: "Need a co-op teammate and a dinner plan.",
    hashtags: ["gaming", "latenight"],
    likes: ["u1", "u2"],
    comments: [],
    shareCount: 1,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "post-3",
    author: {
      _id: "user-demo-1",
      username: "novalane",
      name: "Nova Lane",
      profilePhotos: demoUser.profilePhotos,
      location: { label: "Bengaluru, India" },
    },
    media: [
      {
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
        type: "image",
      },
    ],
    caption: "If you know a hidden jazz bar, your move.",
    hashtags: ["jazz", "dating", "weekend"],
    likes: ["u2", "u6", "u8"],
    comments: [
      {
        _id: "c2",
        user: {
          username: "zyra",
          profilePhotos: demoStories[0].author.profilePhotos,
        },
        comment: "Sending one immediately.",
      },
    ],
    shareCount: 8,
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
];

export const demoDiscoverUsers = [
  {
    _id: "u4",
    name: "Mira Sol",
    username: "mirasol",
    age: 24,
    gender: "Woman",
    bio: "Film photos, beach towns, and shamelessly good flirting.",
    interests: ["Photography", "Travel", "Fashion"],
    distanceKm: 4.6,
    sharedInterests: ["Photography", "Travel"],
    profilePhotos: [
      {
        url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    location: { label: "Indiranagar" },
    subscription: { plan: "gold" },
  },
  {
    _id: "u5",
    name: "Leo Hart",
    username: "leohart",
    age: 26,
    gender: "Man",
    bio: "Boxing class, vinyl Sundays, and questionable karaoke confidence.",
    interests: ["Music", "Fitness", "Nightlife"],
    distanceKm: 7.9,
    sharedInterests: ["Music", "Fitness"],
    profilePhotos: [
      {
        url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    location: { label: "Koramangala" },
    subscription: { plan: "platinum" },
  },
  {
    _id: "u6",
    name: "Ari Vale",
    username: "arivale",
    age: 22,
    gender: "Non-binary",
    bio: "Streetwear thrift hunts and overly serious cafe rankings.",
    interests: ["Fashion", "Travel", "Food"],
    distanceKm: 11.2,
    sharedInterests: [],
    profilePhotos: [
      {
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    location: { label: "HSR Layout" },
    subscription: { plan: "free" },
  },
];

export const demoMatches = [
  {
    _id: "m1",
    matchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    partner: demoDiscoverUsers[0],
    lastMessage: "You still owe me that coffee spot.",
    lastMessageAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
  },
  {
    _id: "m2",
    matchedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    partner: demoDiscoverUsers[1],
    lastMessage: "Tonight or tomorrow?",
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "m3",
    matchedAt: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString(),
    partner: demoDiscoverUsers[2],
    lastMessage: "Sending the playlist now.",
    lastMessageAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  },
];

export const demoConversations = demoMatches.map((match, index) => ({
  ...match,
  unreadCount: index === 0 ? 2 : 0,
}));

export const demoMessages = {
  m1: [
    {
      _id: "msg-1",
      senderId: demoMatches[0].partner._id,
      receiverId: demoUser._id,
      message: "You still owe me that coffee spot.",
      messageType: "text",
      seenStatus: true,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "msg-2",
      senderId: demoUser._id,
      receiverId: demoMatches[0].partner._id,
      message: "Only if you bring the rooftop playlist.",
      messageType: "text",
      seenStatus: true,
      createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    },
  ],
  m2: [
    {
      _id: "msg-3",
      senderId: demoMatches[1].partner._id,
      receiverId: demoUser._id,
      message: "Tonight or tomorrow?",
      messageType: "text",
      seenStatus: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export const demoNotifications = [
  {
    _id: "n1",
    type: "match",
    title: "You matched with Mira Sol",
    body: "Start chatting now.",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actor: {
      username: "mirasol",
      profilePhotos: demoDiscoverUsers[0].profilePhotos,
    },
  },
  {
    _id: "n2",
    type: "follow",
    title: "zyra followed you",
    body: "Your vibe made the cut.",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    actor: demoStories[0].author,
  },
  {
    _id: "n3",
    type: "message",
    title: "Leo Hart sent you a message",
    body: "Tonight or tomorrow?",
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    actor: {
      username: "leohart",
      profilePhotos: demoDiscoverUsers[1].profilePhotos,
    },
  },
];

export const demoSuggestions = [
  demoDiscoverUsers[0],
  demoDiscoverUsers[1],
  demoStories[0].author,
].map((user, index) => ({
  ...user,
  distanceKm: user.distanceKm ?? index * 3 + 2,
}));

export const demoSearchResults = [
  demoDiscoverUsers[0],
  demoDiscoverUsers[1],
  demoDiscoverUsers[2],
  {
    _id: "u7",
    name: "Sage Kim",
    username: "sagekim",
    age: 25,
    bio: "Cafe architecture and weekend drives.",
    interests: ["Travel", "Photography"],
    distanceKm: 16.3,
    profilePhotos: [
      {
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    location: { label: "Whitefield" },
  },
];
