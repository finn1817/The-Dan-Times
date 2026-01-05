// Connection puzzles organized by difficulty
// Each puzzle has 4 categories with 4 words each

const connectionPuzzles = {
    easy: [
        {
            id: "easy_1",
            categories: [
                {
                    name: "TYPES OF FISH",
                    words: ["BASS", "FLOUNDER", "SALMON", "TROUT"],
                    difficulty: 1
                },
                {
                    name: "BREAKFAST FOODS",
                    words: ["BACON", "EGGS", "PANCAKES", "TOAST"],
                    difficulty: 2
                },
                {
                    name: "WEATHER WORDS",
                    words: ["RAIN", "SNOW", "WIND", "STORM"],
                    difficulty: 3
                },
                {
                    name: "TYPES OF CHEESE",
                    words: ["BRIE", "CHEDDAR", "GOUDA", "SWISS"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "easy_2",
            categories: [
                {
                    name: "COLORS",
                    words: ["RED", "BLUE", "GREEN", "YELLOW"],
                    difficulty: 1
                },
                {
                    name: "FRUITS",
                    words: ["APPLE", "BANANA", "ORANGE", "GRAPE"],
                    difficulty: 2
                },
                {
                    name: "ANIMALS",
                    words: ["DOG", "CAT", "BIRD", "FISH"],
                    difficulty: 3
                },
                {
                    name: "BODY PARTS",
                    words: ["ARM", "LEG", "HEAD", "FOOT"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "easy_3",
            categories: [
                {
                    name: "SEASONS",
                    words: ["SPRING", "SUMMER", "FALL", "WINTER"],
                    difficulty: 1
                },
                {
                    name: "PRECIOUS METALS",
                    words: ["GOLD", "SILVER", "PLATINUM", "BRONZE"],
                    difficulty: 2
                },
                {
                    name: "CARD SUITS",
                    words: ["CLUBS", "DIAMONDS", "HEARTS", "SPADES"],
                    difficulty: 3
                },
                {
                    name: "DAYS OF THE WEEK",
                    words: ["MONDAY", "TUESDAY", "FRIDAY", "SUNDAY"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "easy_4",
            categories: [
                {
                    name: "PLANETS",
                    words: ["MARS", "VENUS", "JUPITER", "SATURN"],
                    difficulty: 1
                },
                {
                    name: "MUSICAL INSTRUMENTS",
                    words: ["PIANO", "GUITAR", "DRUMS", "VIOLIN"],
                    difficulty: 2
                },
                {
                    name: "KITCHEN ITEMS",
                    words: ["FORK", "KNIFE", "SPOON", "PLATE"],
                    difficulty: 3
                },
                {
                    name: "SPORTS",
                    words: ["SOCCER", "TENNIS", "HOCKEY", "BASEBALL"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "easy_5",
            categories: [
                {
                    name: "VEGETABLES",
                    words: ["CARROT", "BROCCOLI", "LETTUCE", "TOMATO"],
                    difficulty: 1
                },
                {
                    name: "SCHOOL SUBJECTS",
                    words: ["MATH", "SCIENCE", "HISTORY", "ENGLISH"],
                    difficulty: 2
                },
                {
                    name: "TOOLS",
                    words: ["HAMMER", "DRILL", "WRENCH", "SCREWDRIVER"],
                    difficulty: 3
                },
                {
                    name: "COUNTRIES",
                    words: ["FRANCE", "SPAIN", "ITALY", "JAPAN"],
                    difficulty: 4
                }
            ]
        }
    ],

    medium: [
        {
            id: "medium_1",
            categories: [
                {
                    name: "UNITS OF MEASUREMENT",
                    words: ["HERTZ", "JOULE", "NEWTON", "WATT"],
                    difficulty: 1
                },
                {
                    name: "POKER HANDS",
                    words: ["FLUSH", "STRAIGHT", "PAIR", "FULL HOUSE"],
                    difficulty: 2
                },
                {
                    name: "SOCIAL MEDIA PLATFORMS",
                    words: ["FACEBOOK", "TWITTER", "INSTAGRAM", "TIKTOK"],
                    difficulty: 3
                },
                {
                    name: "___ BEAR",
                    words: ["TEDDY", "POLAR", "GUMMY", "CARE"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "medium_2",
            categories: [
                {
                    name: "PROGRAMMING LANGUAGES",
                    words: ["PYTHON", "JAVA", "RUBY", "SWIFT"],
                    difficulty: 1
                },
                {
                    name: "COFFEE DRINKS",
                    words: ["LATTE", "ESPRESSO", "CAPPUCCINO", "MOCHA"],
                    difficulty: 2
                },
                {
                    name: "___ SAUCE",
                    words: ["HOT", "SOY", "TOMATO", "APPLE"],
                    difficulty: 3
                },
                {
                    name: "THINGS WITH WINGS",
                    words: ["BIRD", "PLANE", "BUTTERFLY", "ANGEL"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "medium_3",
            categories: [
                {
                    name: "DANCE STYLES",
                    words: ["WALTZ", "TANGO", "SALSA", "SWING"],
                    difficulty: 1
                },
                {
                    name: "GREEK LETTERS",
                    words: ["ALPHA", "BETA", "GAMMA", "DELTA"],
                    difficulty: 2
                },
                {
                    name: "ROCK ___",
                    words: ["BOTTOM", "CANDY", "MUSIC", "SOLID"],
                    difficulty: 3
                },
                {
                    name: "THINGS THAT ARE ROUND",
                    words: ["BALL", "WHEEL", "COIN", "GLOBE"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "medium_4",
            categories: [
                {
                    name: "GEMSTONES",
                    words: ["DIAMOND", "EMERALD", "RUBY", "SAPPHIRE"],
                    difficulty: 1
                },
                {
                    name: "FASTENERS",
                    words: ["BUTTON", "ZIPPER", "VELCRO", "SNAP"],
                    difficulty: 2
                },
                {
                    name: "FIRE ___",
                    words: ["ANT", "DRILL", "PLACE", "WORKS"],
                    difficulty: 3
                },
                {
                    name: "PALINDROMES",
                    words: ["KAYAK", "LEVEL", "RADAR", "ROTOR"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "medium_5",
            categories: [
                {
                    name: "BOARD GAMES",
                    words: ["CHESS", "CHECKERS", "MONOPOLY", "SCRABBLE"],
                    difficulty: 1
                },
                {
                    name: "TYPES OF BREAD",
                    words: ["BAGUETTE", "SOURDOUGH", "RYE", "CIABATTA"],
                    difficulty: 2
                },
                {
                    name: "___ BALL",
                    words: ["BASKET", "FOOT", "BASE", "VOLLEY"],
                    difficulty: 3
                },
                {
                    name: "ANAGRAMS OF EACH OTHER",
                    words: ["LISTEN", "SILENT", "ENLIST", "TINSEL"],
                    difficulty: 4
                }
            ]
        }
    ],

    hard: [
        {
            id: "hard_1",
            categories: [
                {
                    name: "___WOOD (TYPES)",
                    words: ["HARD", "DRIFT", "PLY", "HOLLY"],
                    difficulty: 1
                },
                {
                    name: "THINGS WITH KEYS",
                    words: ["PIANO", "KEYBOARD", "LOCK", "MAP"],
                    difficulty: 2
                },
                {
                    name: "___ RING",
                    words: ["BOXING", "DIAMOND", "ONION", "WEDDING"],
                    difficulty: 3
                },
                {
                    name: "FOUR-LETTER WORDS WITH DOUBLE LETTERS",
                    words: ["BOOK", "DOOR", "FEET", "MOON"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "hard_2",
            categories: [
                {
                    name: "SYNONYMS FOR SMART",
                    words: ["BRIGHT", "CLEVER", "SHARP", "QUICK"],
                    difficulty: 1
                },
                {
                    name: "___PHONE",
                    words: ["CELL", "SMART", "MEGA", "MICRO"],
                    difficulty: 2
                },
                {
                    name: "WORDS ENDING IN 'URN'",
                    words: ["BURN", "CHURN", "RETURN", "TURN"],
                    difficulty: 3
                },
                {
                    name: "HOMOPHONES OF NUMBERS",
                    words: ["WON", "TOO", "FOR", "ATE"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "hard_3",
            categories: [
                {
                    name: "TYPES OF PASTA",
                    words: ["PENNE", "FUSILLI", "RIGATONI", "FARFALLE"],
                    difficulty: 1
                },
                {
                    name: "___ STREET",
                    words: ["WALL", "EASY", "SESAME", "MAIN"],
                    difficulty: 2
                },
                {
                    name: "THINGS THAT CAN BE BROKEN",
                    words: ["RECORD", "PROMISE", "HEART", "NEWS"],
                    difficulty: 3
                },
                {
                    name: "___LINE",
                    words: ["DEAD", "HEAD", "TIME", "BASE"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "hard_4",
            categories: [
                {
                    name: "SHADES OF BLUE",
                    words: ["NAVY", "COBALT", "AZURE", "TEAL"],
                    difficulty: 1
                },
                {
                    name: "___ PARK",
                    words: ["BALL", "THEME", "NATIONAL", "TRAILER"],
                    difficulty: 2
                },
                {
                    name: "THINGS WITH TEETH",
                    words: ["COMB", "SAW", "ZIPPER", "GEAR"],
                    difficulty: 3
                },
                {
                    name: "WORDS THAT SOUND LIKE LETTERS",
                    words: ["JAY", "TEA", "BEE", "PEA"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "hard_5",
            categories: [
                {
                    name: "CHESS PIECES",
                    words: ["KING", "QUEEN", "ROOK", "BISHOP"],
                    difficulty: 1
                },
                {
                    name: "___CAKE",
                    words: ["CUP", "PAN", "HOT", "SHORT"],
                    difficulty: 2
                },
                {
                    name: "THINGS WITH SHELLS",
                    words: ["TURTLE", "TACO", "SNAIL", "EGG"],
                    difficulty: 3
                },
                {
                    name: "TYPES OF BANKS",
                    words: ["RIVER", "PIGGY", "BLOOD", "CLOUD"],
                    difficulty: 4
                }
            ]
        }
    ],

    extreme: [
        {
            id: "extreme_1",
            categories: [
                {
                    name: "___ GOLD",
                    words: ["SOLID", "FOOL'S", "BLACK", "LIQUID"],
                    difficulty: 1
                },
                {
                    name: "THINGS THAT ARE BLUE",
                    words: ["SKY", "OCEAN", "JEANS", "SMURF"],
                    difficulty: 2
                },
                {
                    name: "___BAR",
                    words: ["CROW", "SAND", "ROLL", "HANDLE"],
                    difficulty: 3
                },
                {
                    name: "WORDS WITH SILENT 'K'",
                    words: ["KNIFE", "KNIGHT", "KNEE", "KNOT"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "extreme_2",
            categories: [
                {
                    name: "SYNONYMS FOR ANGRY",
                    words: ["CROSS", "LIVID", "IRATE", "HEATED"],
                    difficulty: 1
                },
                {
                    name: "___HOUSE",
                    words: ["LIGHT", "GREEN", "FULL", "OPERA"],
                    difficulty: 2
                },
                {
                    name: "THINGS WITH SPOTS",
                    words: ["DALMATIAN", "LEOPARD", "DICE", "LADYBUG"],
                    difficulty: 3
                },
                {
                    name: "WORDS INSIDE 'MATCHES'",
                    words: ["MATCH", "ACHES", "CHEST", "HEATS"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "extreme_3",
            categories: [
                {
                    name: "___ STATE",
                    words: ["SOLID", "MENTAL", "POLICE", "UNITED"],
                    difficulty: 1
                },
                {
                    name: "WORDS THAT FOLLOW 'DOUBLE'",
                    words: ["AGENT", "DUTCH", "TAKE", "WHAMMY"],
                    difficulty: 2
                },
                {
                    name: "THINGS WITH NEEDLES",
                    words: ["CACTUS", "COMPASS", "PINE TREE", "SYRINGE"],
                    difficulty: 3
                },
                {
                    name: "___TIME",
                    words: ["BED", "HALF", "PRIME", "SHOW"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "extreme_4",
            categories: [
                {
                    name: "TYPES OF ENERGY",
                    words: ["SOLAR", "WIND", "KINETIC", "NUCLEAR"],
                    difficulty: 1
                },
                {
                    name: "___CHIP",
                    words: ["MICRO", "BLUE", "POKER", "CHOCOLATE"],
                    difficulty: 2
                },
                {
                    name: "THINGS THAT FOLD",
                    words: ["CHAIR", "ORIGAMI", "HAND", "LAUNDRY"],
                    difficulty: 3
                },
                {
                    name: "WORDS BEFORE 'CAST'",
                    words: ["BROAD", "FORE", "OVER", "TYPE"],
                    difficulty: 4
                }
            ]
        },
        {
            id: "extreme_5",
            categories: [
                {
                    name: "MOVIE GENRES",
                    words: ["COMEDY", "THRILLER", "HORROR", "ROMANCE"],
                    difficulty: 1
                },
                {
                    name: "THINGS WITH RINGS",
                    words: ["SATURN", "TREE", "CIRCUS", "ONION"],
                    difficulty: 2
                },
                {
                    name: "___BOARD",
                    words: ["DASH", "KEY", "SURF", "CARD"],
                    difficulty: 3
                },
                {
                    name: "WORDS INSIDE 'BARISTA'",
                    words: ["STAR", "ARIA", "STIR", "BARS"],
                    difficulty: 4
                }
            ]
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = connectionPuzzles;
}