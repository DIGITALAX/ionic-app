import {
  NFT,
  Reaction,
  Conductor,
  Designer,
  ReactionPack,
  Purchase,
  Reviewer,
  Review,
} from "../components/Common/types/common.types";

export const DUMMY_NFTS: NFT[] = [
  {
    id: "1",
    nftId: "001",
    nftContract: "0x1234567890123456789012345678901234567890",
    tokenId: "1",
    submitter: "0xabcdef1234567890abcdef1234567890abcdef12",
    tokenType: "ERC721",
    blockNumber: "18500000",
    blockTimestamp: "1698768000",
    transactionHash:
      "0xdef456789012345678901234567890123456789012345678901234567890abc123",
    active: "true",
    appraisalCount: "0",
    totalScore: "0",
    averageScore: "0",
    metadata: {
      title: "Digital Essence #001",
      description:
        "A mesmerizing piece exploring the intersection of digital art and human emotion.",
      type: "image",
      image:
        "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop",
    },
    appraisals: [],
  },
  {
    id: "2",
    nftId: "002",
    nftContract: "0x2345678901234567890123456789012345678901",
    tokenId: "2",
    submitter: "0xbcdef01234567890bcdef01234567890bcdef012",
    tokenType: "ERC721",
    blockNumber: "18500100",
    blockTimestamp: "1698768300",
    transactionHash:
      "0xabc123456789012345678901234567890123456789012345678901234567890def",
    active: "true",
    appraisalCount: "3",
    totalScore: "240",
    averageScore: "80",
    metadata: {
      title: "Cyber Bloom #002",
      description: "Nature meets technology in this vibrant digital garden.",
      type: "image",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    },
    appraisals: [],
  },
  {
    id: "3",
    nftId: "003",
    nftContract: "0x3456789012345678901234567890123456789012",
    tokenId: "3",
    submitter: "0xcdef012345678901cdef012345678901cdef0123",
    tokenType: "ERC721",
    blockNumber: "18500200",
    blockTimestamp: "1698768600",
    transactionHash:
      "0x123456789012345678901234567890123456789012345678901234567890abcdef",
    active: "true",
    appraisalCount: "1",
    totalScore: "95",
    averageScore: "95",
    metadata: {
      title: "Quantum Dreams #003",
      description:
        "A surreal journey through quantum dimensions and abstract realities.",
      type: "image",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop",
    },
    appraisals: [],
  },
  {
    id: "4",
    nftId: "004",
    nftContract: "0x4567890123456789012345678901234567890123",
    tokenId: "4",
    submitter: "0xdef0123456789012def0123456789012def01234",
    tokenType: "ERC721",
    blockNumber: "18500300",
    blockTimestamp: "1698768900",
    transactionHash:
      "0x456789012345678901234567890123456789012345678901234567890123abcdef",
    active: "true",
    appraisalCount: "5",
    totalScore: "350",
    averageScore: "70",
    metadata: {
      title: "Neural Network #004",
      description:
        "Visualizing the connections between artificial intelligence and creativity.",
      type: "image",
      image:
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop",
    },
    appraisals: [],
  },
  {
    id: "5",
    nftId: "005",
    nftContract: "0x5678901234567890123456789012345678901234",
    tokenId: "5",
    submitter: "0xef01234567890123ef01234567890123ef012345",
    tokenType: "ERC721",
    blockNumber: "18500400",
    blockTimestamp: "1698769200",
    transactionHash:
      "0x789012345678901234567890456789012345678901234567890456789abcdef",
    active: "true",
    appraisalCount: "2",
    totalScore: "165",
    averageScore: "82.5",
    metadata: {
      title: "Ethereal Forms #005",
      description:
        "Flowing shapes and luminous colors create an otherworldly experience.",
      type: "image",
      image:
        "https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=400&h=400&fit=crop",
    },
    appraisals: [],
  },
];

export const DUMMY_USER_REACTIONS: { reaction: Reaction; count: number }[] = [
  {
    reaction: {
      reactionId: "1",
      packId: "1",
      reactionUri: "ipfs://QmReaction1",
      tokenIds: ["101", "102", "103"],
      pack: {} as any,
      reactionMetadata: {
        title: "Fire",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
        description: "Blazing hot reaction",
        model: "stable-diffusion",
        workflow: "text-to-image",
        prompt: "fire emoji abstract art",
      },
    },
    count: 3,
  },
  {
    reaction: {
      reactionId: "2",
      packId: "1",
      reactionUri: "ipfs://QmReaction2",
      tokenIds: ["104"],
      pack: {} as any,
      reactionMetadata: {
        title: "Diamond",
        image:
          "https://images.unsplash.com/photo-1609205173107-6f5b26f0b5f3?w=100&h=100&fit=crop",
        description: "Precious gem reaction",
        model: "stable-diffusion",
        workflow: "text-to-image",
        prompt: "diamond crystal abstract",
      },
    },
    count: 1,
  },
  {
    reaction: {
      reactionId: "3",
      packId: "2",
      reactionUri: "ipfs://QmReaction3",
      tokenIds: ["105", "106"],
      pack: {} as any,
      reactionMetadata: {
        title: "Rainbow",
        image:
          "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=100&h=100&fit=crop",
        description: "Colorful spectrum reaction",
        model: "midjourney",
        workflow: "text-to-image",
        prompt: "rainbow prism light",
      },
    },
    count: 2,
  },
  {
    reaction: {
      reactionId: "4",
      packId: "2",
      reactionUri: "ipfs://QmReaction4",
      tokenIds: ["107"],
      pack: {} as any,
      reactionMetadata: {
        title: "Lightning",
        image:
          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=100&h=100&fit=crop",
        description: "Electric energy reaction",
        model: "dalle-3",
        workflow: "text-to-image",
        prompt: "lightning bolt energy",
      },
    },
    count: 1,
  },
];

export const DUMMY_DESIGNERS: Designer[] = [
  {
    wallet: "0xdesigner1234567890123456789012345678901234567890",
    uri: "ipfs://QmDesigner1",
    metadata: {
      title: "Digital Artist Pro",
      description: "Specializing in abstract digital art and NFT collections",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
    },
    invitedBy: "1",
    active: "true",
    designerId: "1",
    inviteTimestamp: "1698768000",
    packCount: "12",
    reactionPacks: [],
  },
  {
    wallet: "0xdesigner2345678901234567890123456789012345678901",
    uri: "ipfs://QmDesigner2",
    metadata: {
      title: "Crypto Creator",
      description: "Creating unique reaction packs for the community",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop",
    },
    invitedBy: "1",
    active: "true",
    designerId: "2",
    inviteTimestamp: "1698769200",
    packCount: "8",
    reactionPacks: [],
  },
  {
    wallet: "0xdesigner3456789012345678901234567890123456789012",
    uri: "ipfs://QmDesigner3",
    metadata: {
      title: "",
      description: "",
      image: "",
    },
    invitedBy: "1",
    active: "false",
    designerId: "3",
    inviteTimestamp: "1698770400",
    packCount: "0",
    reactionPacks: [],
  },
];

export const DUMMY_CONDUCTOR: Conductor = {
  id: "1",
  wallet: "0xdummy1234567890123456789012345678901234567890",
  conductorId: "1",
  uri: "ipfs://QmDummyConductor1",
  blockNumber: "18500000",
  blockTimestamp: "1698768000",
  transactionHash:
    "0xdummyconductor123456789012345678901234567890123456789012345678",
  appraisalCount: "25",
  totalScore: "2000",
  averageScore: "80",
  reviewCount: "5",
  totalReviewScore: "450",
  averageReviewScore: "90",
  inviteCount: "3",
  availableInvites: "2",
  metadata: {
    title: "Master Appraiser",
    description:
      "Expert in evaluating digital art and NFT collections with focus on technical excellence and artistic merit.",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=200&fit=crop",
  },
  invitedDesigners: DUMMY_DESIGNERS,
  appraisals: [
    {
      appraiser: "0xdummy1234567890123456789012345678901234567890",
      nftId: "001",
      nftContract: "0x1234567890123456789012345678901234567890",
      conductorId: "1",
      appraisalId: "1",
      overallScore: "85",
      blockNumber: "18500100",
      blockTimestamp: "1698768300",
      transactionHash:
        "0xappraisal1234567890123456789012345678901234567890123456789012",
      uri: "ipfs://QmAppraisal1",
      reactions: [],
      conductor: {} as any,
      metadata: {
        comment:
          "Excellent digital artwork with strong composition and vibrant colors. The technical execution is flawless.",
        reactions: [
          { count: "3", emoji: "🔥" },
          { count: "2", emoji: "👏" },
          { count: "1", emoji: "💎" },
        ],
      },
    },
    {
      appraiser: "0xdummy1234567890123456789012345678901234567890",
      nftId: "002",
      nftContract: "0x2345678901234567890123456789012345678901",
      conductorId: "1",
      appraisalId: "2",
      overallScore: "92",
      blockNumber: "18500200",
      blockTimestamp: "1698768600",
      transactionHash:
        "0xappraisal2345678901234567890123456789012345678901234567890123",
      uri: "ipfs://QmAppraisal2",
      reactions: [
        {
          count: 2,
          reactionId: "1",
          reaction: {
            reactionId: "1",
            reactionUri: "ipfs://QmReaction1",
            packId: "1",
            tokenIds: ["101", "102"],
            pack: {} as any,
            reactionMetadata: {
              title: "Fire",
              description: "Blazing hot reaction",
              model: "stable-diffusion",
              workflow: "text-to-image",
              prompt: "fire emoji abstract art",
              image:
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=32&h=32&fit=crop",
            },
          },
        },
      ],
      conductor: {} as any,
      metadata: {
        comment:
          "Outstanding piece that pushes the boundaries of digital art. Innovative use of color and form.",
        reactions: [
          { count: "5", emoji: "🚀" },
          { count: "3", emoji: "🎨" },
          { count: "2", emoji: "✨" },
        ],
      },
    },
    {
      appraiser: "0xdummy1234567890123456789012345678901234567890",
      nftId: "003",
      nftContract: "0x3456789012345678901234567890123456789012",
      conductorId: "1",
      appraisalId: "3",
      overallScore: "78",
      blockNumber: "18500300",
      blockTimestamp: "1698768900",
      transactionHash:
        "0xappraisal3456789012345678901234567890123456789012345678901234",
      uri: "ipfs://QmAppraisal3",
      reactions: [],
      conductor: {} as any,
      metadata: {
        comment:
          "Good technical execution with room for artistic improvement. Shows potential for growth.",
        reactions: [
          { count: "2", emoji: "👍" },
          { count: "1", emoji: "🎯" },
        ],
      },
    },
  ],
  reviews: [
    {
      reviewId: "1",
      reviewScore: "95",
      timestamp: "1698769200",
      uri: "ipfs://QmReview1",
      conductorId: "1",
      conductor: {} as any,
      reviewer: {} as any,
      reactions: [
        {
          count: 3,
          reactionId: "2",
          reaction: {
            reactionId: "2",
            reactionUri: "ipfs://QmReaction2",
            packId: "1",
            tokenIds: ["103"],
            pack: {} as any,
            reactionMetadata: {
              title: "Diamond",
              description: "Precious gem reaction",
              model: "stable-diffusion",
              workflow: "text-to-image",
              prompt: "diamond crystal abstract",
              image:
                "https://images.unsplash.com/photo-1609205173107-6f5b26f0b5f3?w=32&h=32&fit=crop",
            },
          },
        },
      ],
      metadata: {
        comment:
          "Exceptional conductor with deep knowledge and fair evaluation standards. Highly recommended.",
        reactions: [
          { count: "4", emoji: "⭐" },
          { count: "3", emoji: "🏆" },
          { count: "2", emoji: "💯" },
        ],
      },
    },
    {
      reviewId: "2",
      reviewScore: "88",
      timestamp: "1698769500",
      uri: "ipfs://QmReview2",
      conductorId: "1",
      conductor: {} as any,
      reviewer: {} as any,
      reactions: [],
      metadata: {
        comment:
          "Professional and thorough appraisals. Good attention to detail and constructive feedback.",
        reactions: [
          { count: "3", emoji: "👌" },
          { count: "2", emoji: "📝" },
        ],
      },
    },
    {
      reviewId: "3",
      reviewScore: "92",
      timestamp: "1698769800",
      uri: "ipfs://QmReview3",
      conductorId: "1",
      conductor: {} as any,
      reviewer: {} as any,
      reactions: [
        {
          count: 1,
          reactionId: "3",
          reaction: {
            reactionId: "3",
            reactionUri: "ipfs://QmReaction3",
            packId: "2",
            tokenIds: ["201"],
            pack: {} as any,
            reactionMetadata: {
              title: "Lightning",
              description: "Electric energy reaction",
              model: "dalle-3",
              workflow: "text-to-image",
              prompt: "lightning bolt energy",
              image:
                "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=32&h=32&fit=crop",
            },
          },
        },
      ],
      metadata: {
        comment:
          "Insightful evaluations that help artists grow. Great mentor and skilled appraiser.",
        reactions: [
          { count: "2", emoji: "🌟" },
          { count: "1", emoji: "🎓" },
        ],
      },
    },
  ],
};

export const DUMMY_APPRAISALS = [
  {
    appraiser: "0xdummy1234567890123456789012345678901234567890",
    nftId: "1",
    nftContract: "0x1234567890123456789012345678901234567890",
    conductorId: "1",
    appraisalId: "1",
    overallScore: "85",
    blockNumber: "18500100",
    blockTimestamp: "1698768300",
    transactionHash:
      "0xappraisal1234567890123456789012345678901234567890123456789012",
    uri: "ipfs://QmAppraisal1",
    reactions: [],
    metadata: {
      comment:
        "Excellent digital artwork with strong composition and vibrant colors. The technical execution is flawless.",
      reactions: [
        { count: "3", emoji: "🔥" },
        { count: "2", emoji: "👏" },
        { count: "1", emoji: "💎" },
      ],
    },
  },
  {
    appraiser: "0xdummy1234567890123456789012345678901234567890",
    nftId: "2",
    nftContract: "0x2345678901234567890123456789012345678901",
    conductorId: "1",
    appraisalId: "2",
    overallScore: "72",
    blockNumber: "18500200",
    blockTimestamp: "1698768600",
    transactionHash:
      "0xappraisal2345678901234567890123456789012345678901234567890123",
    uri: "ipfs://QmAppraisal2",
    reactions: [],
    metadata: {
      comment:
        "Good concept and execution, but could benefit from more attention to detail in certain areas.",
      reactions: [
        { count: "2", emoji: "👍" },
        { count: "1", emoji: "🎨" },
      ],
    },
  },
  {
    appraiser: "0xdummy1234567890123456789012345678901234567890",
    nftId: "3",
    nftContract: "0x3456789012345678901234567890123456789012",
    conductorId: "1",
    appraisalId: "3",
    overallScore: "91",
    blockNumber: "18500300",
    blockTimestamp: "1698768900",
    transactionHash:
      "0xappraisal3456789012345678901234567890123456789012345678901234",
    uri: "ipfs://QmAppraisal3",
    reactions: [],
    metadata: {
      comment:
        "Outstanding piece that demonstrates mastery of digital art techniques. Highly innovative and aesthetically pleasing.",
      reactions: [
        { count: "4", emoji: "🔥" },
        { count: "3", emoji: "💎" },
        { count: "2", emoji: "🚀" },
      ],
    },
  },
];

export const DUMMY_REVIEWER: Reviewer = {
  wallet: "0xreviewer1234567890123456789012345678901234567890",
  uri: "ipfs://QmReviewer1",
  metadata: {
    title: "Master Reviewer",
    description:
      "Expert reviewer specializing in evaluating conductor performance and providing insightful review scores.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  reviews: [
    {
      reviewId: "1",
      reviewScore: "95",
      timestamp: "1698769200",
      uri: "ipfs://QmReview1",
      conductorId: "1",
      conductor: {} as any,
      reviewer: {} as any,
      reactions: [
        {
          count: 3,
          reactionId: "2",
          reaction: {
            reactionId: "2",
            reactionUri: "ipfs://QmReaction2",
            packId: "1",
            tokenIds: ["103"],
            pack: {} as any,
            reactionMetadata: {
              title: "Diamond",
              description: "Precious gem reaction",
              model: "stable-diffusion",
              workflow: "text-to-image",
              prompt: "diamond crystal abstract",
              image: "https://images.unsplash.com/photo-1609205173107-6f5b26f0b5f3?w=32&h=32&fit=crop",
            },
          },
        },
      ],
      metadata: {
        comment: "Exceptional conductor with deep knowledge and fair evaluation standards. Highly recommended.",
        reactions: [
          { count: "4", emoji: "⭐" },
          { count: "3", emoji: "🏆" },
          { count: "2", emoji: "💯" },
        ],
      },
    },
    {
      reviewId: "4",
      reviewScore: "87",
      timestamp: "1698770400",
      uri: "ipfs://QmReview4",
      conductorId: "2",
      conductor: {} as any,
      reviewer: {} as any,
      reactions: [],
      metadata: {
        comment: "Solid performance with good attention to detail. Room for improvement in creativity assessment.",
        reactions: [
          { count: "2", emoji: "👍" },
          { count: "1", emoji: "📈" },
        ],
      },
    },
    {
      reviewId: "7",
      reviewScore: "92",
      timestamp: "1698771600",
      uri: "ipfs://QmReview7",
      conductorId: "3",
      conductor: {} as any,
      reviewer: {} as any,
      reactions: [
        {
          count: 1,
          reactionId: "1",
          reaction: {
            reactionId: "1",
            reactionUri: "ipfs://QmReaction1",
            packId: "1",
            tokenIds: ["101"],
            pack: {} as any,
            reactionMetadata: {
              title: "Fire",
              description: "Blazing hot reaction",
              model: "stable-diffusion",
              workflow: "text-to-image",
              prompt: "fire emoji abstract art",
              image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=32&h=32&fit=crop",
            },
          },
        },
      ],
      metadata: {
        comment: "Outstanding analytical skills and comprehensive evaluation approach. Top-tier conductor.",
        reactions: [
          { count: "3", emoji: "🔥" },
          { count: "2", emoji: "🎯" },
        ],
      },
    }
  ],
  reviewCount: "15",
  totalScore: "1275",
  averageScore: "85",
  lastReviewTimestamp: "1698772800",
};

export const DUMMY_REVIEWS: Review[] = [];

export const DUMMY_DESIGNER: Designer = {
  wallet: "0xdesigner1234567890123456789012345678901234567890",
  uri: "ipfs://QmDesigner1",
  metadata: {
    title: "Master Designer",
    description:
      "Expert in creating innovative reaction packs and digital art assets.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  invitedBy: "1",
  active: "true",
  designerId: "1",
  inviteTimestamp: "1698768000",
  packCount: "3",
  reactionPacks: [
    {
      designer: "0xdesigner1234567890123456789012345678901234567890",
      packId: "1",
      currentPrice: "100000000000000000",
      maxEditions: "100",
      soldCount: "25",
      basePrice: "100000000000000000",
      priceIncrement: "10000000000000000",
      conductorReservedSpots: "10",
      active: "true",
      packUri: "ipfs://QmPack1",
      packMetadata: {
        title: "Fire Elements Pack",
        description: "A collection of fiery reaction elements perfect for expressing intensity.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
      },
      designerProfile: {} as any,
      reactions: [
        {
          reactionId: "1",
          packId: "1",
          reactionUri: "ipfs://QmReaction1",
          tokenIds: ["101", "102", "103"],
          pack: {} as any,
          reactionMetadata: {
            title: "Fire Blast",
            image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop",
            description: "Intense fire reaction",
            model: "stable-diffusion",
            workflow: "text-to-image",
            prompt: "fire blast explosion"
          }
        },
        {
          reactionId: "2",
          packId: "1", 
          reactionUri: "ipfs://QmReaction2",
          tokenIds: ["104"],
          pack: {} as any,
          reactionMetadata: {
            title: "Flame Wave",
            image: "https://images.unsplash.com/photo-1551699013-6c6efdef3cb1?w=100&h=100&fit=crop",
            description: "Flowing flame reaction",
            model: "stable-diffusion",
            workflow: "text-to-image", 
            prompt: "flame wave motion"
          }
        }
      ],
      purchases: [],
    },
    {
      designer: "0xdesigner1234567890123456789012345678901234567890",
      packId: "4",
      currentPrice: "200000000000000000",
      maxEditions: "75",
      soldCount: "18",
      basePrice: "150000000000000000",
      priceIncrement: "20000000000000000",
      conductorReservedSpots: "8",
      active: "true",
      packUri: "ipfs://QmPack4",
      packMetadata: {
        title: "Lightning Storm Pack",
        description: "Electric reactions for high-energy appraisals.",
        image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=300&fit=crop",
      },
      designerProfile: {} as any,
      reactions: [
        {
          reactionId: "9",
          packId: "4",
          reactionUri: "ipfs://QmReaction9",
          tokenIds: ["401", "402"],
          pack: {} as any,
          reactionMetadata: {
            title: "Thunder Strike",
            image: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=100&h=100&fit=crop",
            description: "Powerful thunder reaction",
            model: "stable-diffusion",
            workflow: "text-to-image",
            prompt: "thunder lightning strike"
          }
        }
      ],
      purchases: [],
    }
  ],
};

export const DUMMY_PACKS: ReactionPack[] = [
  {
    designer: "0xdesigner1234567890123456789012345678901234567890",
    packId: "1",
    currentPrice: "140000000000000000",
    maxEditions: "100",
    soldCount: "5",
    basePrice: "100000000000000000",
    priceIncrement: "10000000000000000",
    conductorReservedSpots: "10",
    active: "true",
    packUri: "ipfs://QmPack1",
    packMetadata: {
      title: "Fire Elements Pack",
      description:
        "A collection of fiery reaction elements perfect for expressing intensity.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    },
    designerProfile: {
      wallet: "0xdesigner1234567890123456789012345678901234567890",
      uri: "ipfs://QmDesigner1",
      metadata: {
        title: "Digital Artist Pro",
        description: "Specializing in abstract digital art and NFT collections",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop"
      },
      invitedBy: "0xconductor1234567890123456789012345678901234567890",
      active: "true",
      designerId: "1",
      inviteTimestamp: "1700000000",
      packCount: "3",
      reactionPacks: []
    },
    reactions: [
      {
        reactionId: "1",
        packId: "1",
        reactionUri: "ipfs://QmReaction1",
        tokenIds: ["101", "102", "103"],
        pack: {} as any,
        reactionMetadata: {
          title: "Fire Blast",
          image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop",
          description: "Intense fire reaction",
          model: "stable-diffusion",
          workflow: "text-to-image",
          prompt: "fire blast explosion"
        }
      },
      {
        reactionId: "2",
        packId: "1", 
        reactionUri: "ipfs://QmReaction2",
        tokenIds: ["104"],
        pack: {} as any,
        reactionMetadata: {
          title: "Flame Wave",
          image: "https://images.unsplash.com/photo-1551699013-6c6efdef3cb1?w=100&h=100&fit=crop",
          description: "Flowing flame reaction",
          model: "stable-diffusion",
          workflow: "text-to-image", 
          prompt: "flame wave motion"
        }
      },
      {
        reactionId: "3",
        packId: "1",
        reactionUri: "ipfs://QmReaction3",
        tokenIds: ["105"],
        pack: {} as any,
        reactionMetadata: {
          title: "Ember Glow",
          image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&h=100&fit=crop",
          description: "Glowing ember reaction",
          model: "stable-diffusion",
          workflow: "text-to-image",
          prompt: "glowing embers"
        }
      }
    ],
    purchases: [
      {
        id: "1",
        buyer: "0xbuyer1234567890123456789012345678901234567890",
        purchaseId: "1",
        packId: "1",
        price: "100000000000000000",
        editionNumber: "1",
        shareWeight: "100",
        timestamp: "1698768000",
        transactionHash: "0xpurchase1234567890123456789012345678901234567890123456789012345678",
        pack: {} as any,
      },
      {
        id: "2",
        buyer: "0xbuyer5678901234567890123456789012345678901234",
        purchaseId: "2",
        packId: "1",
        price: "110000000000000000",
        editionNumber: "2",
        shareWeight: "50",
        timestamp: "1698769800",
        transactionHash: "0xpurchase5678901234567890123456789012345678901234567890123456789012",
        pack: {} as any,
      },
      {
        id: "3",
        buyer: "0xbuyer9876543210987654321098765432109876543210",
        purchaseId: "3",
        packId: "1",
        price: "120000000000000000",
        editionNumber: "3",
        shareWeight: "33",
        timestamp: "1698770400",
        transactionHash: "0xpurchase9876543210987654321098765432109876543210987654321098765432",
        pack: {} as any,
      },
      {
        id: "4",
        buyer: "0xbuyerabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        purchaseId: "4",
        packId: "1",
        price: "130000000000000000",
        editionNumber: "4",
        shareWeight: "25",
        timestamp: "1698771000",
        transactionHash: "0xpurchaseabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefab",
        pack: {} as any,
      },
      {
        id: "5",
        buyer: "0xbuyer1111222233334444555566667777888899990000",
        purchaseId: "5",
        packId: "1",
        price: "140000000000000000",
        editionNumber: "5",
        shareWeight: "20",
        timestamp: "1698771600",
        transactionHash: "0xpurchase1111222233334444555566667777888899990000111122223333444455",
        pack: {} as any,
      }
    ],
  },
  {
    designer: "0xdesigner2345678901234567890123456789012345678901",
    packId: "2",
    currentPrice: "150000000000000000",
    maxEditions: "50",
    soldCount: "12",
    basePrice: "120000000000000000",
    priceIncrement: "15000000000000000",
    conductorReservedSpots: "5",
    active: "true",
    packUri: "ipfs://QmPack2",
    packMetadata: {
      title: "Crystal Dreams Pack",
      description:
        "Elegant crystalline reactions for sophisticated appraisals.",
      image:
        "https://images.unsplash.com/photo-1609205173107-6f5b26f0b5f3?w=300&h=300&fit=crop",
    },
    designerProfile: {
      wallet: "0xdesigner2345678901234567890123456789012345678901",
      uri: "ipfs://QmDesigner2",
      metadata: {
        title: "Crypto Creator",
        description: "Creating unique reaction packs for the community",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop"
      },
      invitedBy: "0xconductor2345678901234567890123456789012345678901",
      active: "true",
      designerId: "2",
      inviteTimestamp: "1700001000",
      packCount: "2",
      reactionPacks: []
    },
    reactions: [
      {
        reactionId: "4",
        packId: "2",
        reactionUri: "ipfs://QmReaction4",
        tokenIds: ["201", "202"],
        pack: {} as any,
        reactionMetadata: {
          title: "Diamond Shine",
          image: "https://images.unsplash.com/photo-1609205173107-6f5b26f0b5f3?w=100&h=100&fit=crop",
          description: "Brilliant diamond reaction",
          model: "stable-diffusion",
          workflow: "text-to-image",
          prompt: "diamond crystal shine"
        }
      },
      {
        reactionId: "5",
        packId: "2",
        reactionUri: "ipfs://QmReaction5", 
        tokenIds: ["203"],
        pack: {} as any,
        reactionMetadata: {
          title: "Crystal Burst",
          image: "https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=100&h=100&fit=crop",
          description: "Crystalline burst reaction",
          model: "stable-diffusion",
          workflow: "text-to-image",
          prompt: "crystal burst explosion"
        }
      }
    ],
    purchases: [],
  },
  {
    designer: "0xdesigner3456789012345678901234567890123456789012",
    packId: "3",
    currentPrice: "80000000000000000",
    maxEditions: "200",
    soldCount: "67",
    basePrice: "50000000000000000",
    priceIncrement: "5000000000000000",
    conductorReservedSpots: "20",
    active: "false",
    packUri: "ipfs://QmPack3",
    packMetadata: {
      title: "Nature Vibes Pack",
      description:
        "Organic and natural reaction elements inspired by the environment.",
      image:
        "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=300&h=300&fit=crop",
    },
    designerProfile: {
      wallet: "0xdesigner3456789012345678901234567890123456789012",
      uri: "ipfs://QmDesigner3",
      metadata: {
        title: "Eco Artist",
        description: "Creating sustainable and eco-friendly digital art experiences",
        image: "https://images.unsplash.com/photo-1494790108755-2616c57c8834?w=200&h=200&fit=crop"
      },
      invitedBy: "0xconductor3456789012345678901234567890123456789012",
      active: "true",
      designerId: "3",
      inviteTimestamp: "1700002000",
      packCount: "1",
      reactionPacks: []
    },
    reactions: [
      {
        reactionId: "6",
        packId: "3",
        reactionUri: "ipfs://QmReaction6",
        tokenIds: ["301", "302", "303", "304"],
        pack: {} as any,
        reactionMetadata: {
          title: "Forest Breeze",
          image: "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=100&h=100&fit=crop",
          description: "Natural forest reaction",
          model: "stable-diffusion",
          workflow: "text-to-image",
          prompt: "forest breeze leaves"
        }
      },
      {
        reactionId: "7",
        packId: "3",
        reactionUri: "ipfs://QmReaction7",
        tokenIds: ["305"],
        pack: {} as any,
        reactionMetadata: {
          title: "Ocean Wave",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop",
          description: "Ocean wave reaction",
          model: "stable-diffusion",
          workflow: "text-to-image",
          prompt: "ocean wave splash"
        }
      },
      {
        reactionId: "8",
        packId: "3",
        reactionUri: "ipfs://QmReaction8",
        tokenIds: ["306", "307"],
        pack: {} as any,
        reactionMetadata: {
          title: "Mountain Peak",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
          description: "Mountain peak reaction",
          model: "stable-diffusion",
          workflow: "text-to-image",
          prompt: "mountain peak summit"
        }
      }
    ],
    purchases: [],
  },
];

export const DUMMY_PURCHASES: Purchase[] = [
  {
    id: "1",
    buyer: "0xbuyer1234567890123456789012345678901234567890",
    purchaseId: "1",
    packId: "1",
    price: "100000000000000000",
    editionNumber: "1",
    shareWeight: "100",
    timestamp: "1698768000",
    transactionHash:
      "0xpurchase1234567890123456789012345678901234567890123456789012345678",
    pack: DUMMY_PACKS[0],
  },
  {
    id: "2",
    buyer: "0xbuyer1234567890123456789012345678901234567890",
    purchaseId: "2",
    packId: "2",
    price: "150000000000000000",
    editionNumber: "2",
    shareWeight: "150",
    timestamp: "1698768300",
    transactionHash:
      "0xpurchase2345678901234567890123456789012345678901234567890123456789",
    pack: DUMMY_PACKS[1],
  },
  {
    id: "3",
    buyer: "0xbuyer1234567890123456789012345678901234567890",
    purchaseId: "3",
    packId: "1",
    price: "110000000000000000",
    editionNumber: "3",
    shareWeight: "110",
    timestamp: "1698768600",
    transactionHash:
      "0xpurchase3456789012345678901234567890123456789012345678901234567890",
    pack: DUMMY_PACKS[0],
  },
  {
    id: "4",
    buyer: "0xbuyer1234567890123456789012345678901234567890",
    purchaseId: "4",
    packId: "3",
    price: "80000000000000000",
    editionNumber: "4",
    shareWeight: "80",
    timestamp: "1698768900",
    transactionHash:
      "0xpurchase4567890123456789012345678901234567890123456789012345678901",
    pack: DUMMY_PACKS[2],
  },
];
