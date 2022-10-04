// JSON list of home maintenance suggestions

const suggestions = [
  {
    item: "refrigerator",
    suggestions: [
      {
        name: "Clean the condenser coils",
        description:
          "The condenser coils are located behind the refrigerator. They are usually covered by a removable panel. Clean the coils with a vacuum cleaner or a brush. If the coils are dirty, the refrigerator will have to work harder to keep the food cold, which will increase your energy bill.",
        difficulty: "easy",
        frequency: "monthly",
        cost: 0,
        time: 15,
      },
      {
        name: "Change Filters",
        description:
          "Change the air filter in your refrigerator every 6 months. This will help keep the refrigerator running efficiently and prevent the buildup of dust and dirt.",
        difficulty: "easy",
        frequency: "6 months",
        cost: 10,
        time: 15,
      },
      {
        name: "Clean the gasket",
        description:
          "The gasket is the rubber seal around the door. It keeps the cold air in and the warm air out. If the gasket is dirty or damaged, it will not seal properly. Clean the gasket with a mild detergent and warm water. If the gasket is damaged, replace it.",
        difficulty: "medium",
        frequency: "monthly",
        cost: 10,
        time: 15,
      },
      {
        name: "Defrost the freezer",
        description:
          "Defrost the freezer every 6 months. This will help keep the freezer running efficiently and prevent the buildup of ice.",
        difficulty: "medium",
        frequency: "6 months",
        cost: 0,
        time: 60,
      },
    ],
  },
  {
    item: "dryer",
    suggestions: [
      {
        name: "Clean the lint trap",
        description:
          "Clean the lint trap after every load of laundry. This will help prevent a fire.",
        difficulty: "easy",
        frequency: "daily",
        cost: 0,
        time: 2,
      },
    ],
  },
  {
    item: "sofa",
    suggestions: [
      {
        name: "Vacuum the sofa",
        description:
          "Vacuum the sofa every week to remove dust and dirt. This will help keep the sofa looking new.",
        difficulty: "easy",
        frequency: "weekly",
        cost: 0,
        time: 15,
        supplies: ["vacuum"],
      },
    ],
  },
  {
    item: "oven",
    suggestions: [
      {
        name: "Clean the oven",
        description:
          "Clean the oven every 6 months to remove grease and dirt. This will prevent a fire.",
        difficulty: "medium",
        frequency: "6 months",
        cost: 0,
        time: 30,
        supplies: ["oven cleaner"],
        steps: [
          "Spray the oven with oven cleaner",
          "Let the oven cleaner sit for 10 minutes",
          "Scrub the oven with a sponge",
          "Rinse the oven with water",
          "Dry the oven with a towel",
        ],
      },
      {
        name: "Clean the oven racks",
        description:
          "Clean the oven racks every 6 months to remove grease and dirt",
        difficulty: "easy",
        frequency: "6 months",
        cost: 0,
        time: 30,
        supplies: ["oven cleaner"],
        steps: [
          "Remove the racks from the oven",
          "Soak the racks in a solution of hot water and dish soap",
          "Scrub the racks with a sponge",
          "Rinse the racks with hot water",
          "Dry the racks with a towel",
        ],
      },
    ],
  },
];

const miscSuggestions = [
  {
    name: "Clean the air vents",
    description:
      "Clean the air vents every 6 months to remove dust and dirt. This will help keep the air vents working efficiently.",
    fact: "Dirty air vents can cause your air conditioner to work harder, which will increase your energy bill.",
    difficulty: "easy",
    frequency: "6 months",
    cost: 0,
    time: 15,
    supplies: ["vacuum", "new air filter"],
  },
  {
    name: "Clear out the gutters",
    description:
      "Clear out the gutters every 6 months to remove leaves and dirt. This will help prevent water damage.",
    fact: "Clogged gutters can cause water damage to your home.",
    difficulty: "medium",
    frequency: "6 months",
    cost: 0,
    time: 120,
    supplies: ["gutter cleaner"],
    steps: [
      "Remove the downspout if necessary",
      "Remove the gutter guards",
      "Remove the debris",
      "Replace the gutter guards",
      "Replace the downspout if necessary",
    ],
  },
  {
    name: "Seal window gaps",
    description:
      "Seal window gaps every 6 months to prevent air leaks and save money. This will help keep the house warm in the winter and cool in the summer.",
    fact: "Sealing window gaps can save you up to $100 a year on your energy bill.",
    difficulty: "medium",
    frequency: "annually",
    cost: 0,
    time: 60,
    supplies: ["window caulk", "putty knife"],
    steps: [
      "Use a caulk gun to apply caulk to the window frame",
      "Use a putty knife to smooth the caulk",
    ],
  },
  {
    name: "Inspect your attic",
    description: "Check your attic for leaks and insulation every 6 months.",
    fact: "A leaky attic can cause water damage to your home. Insufficient insulation can cause your air conditioner to work harder, which will increase your energy bill.",
    warning:
      "Be careful when inspecting your attic. Attic insulation can be itchy, and may cause an allergic reaction.",
    difficulty: "medium",
    frequency: "6 months",
    cost: 0,
    time: 30,
    supplies: ["flashlight"],
    steps: [
      "Turn off the lights",
      "Climb into the attic",
      "Inspect the insulation",
      "Inspect the roof",
      "Inspect the vents",
      "Inspect the pipes",
      "Inspect the ducts",
      "Inspect the windows",
      "Inspect the doors",
      "Inspect the chimney",
      "Inspect the skylights",
      "Inspect the walls",
      "Inspect the floor",
      "Inspect the ceiling",
      "Inspect the electrical wiring",
      "Inspect the plumbing",
    ],
  },
  {
    name: "Clean your driveway",
    description:
      "Clean your driveway every 6 months to remove dirt and stains. This will help keep your driveway looking new.",
    fact: "Algae and oil will erode your concrete over time. With regular power washing, you can prevent cracks and untimely aging, so your concrete surface lasts for much longer.",
    difficulty: "medium",
    frequency: "monthly",
    cost: 0,
    time: 60,
    supplies: ["power washer"],
    steps: [
      "Turn on the  power washer",
      "Spray the driveway with water",
      "Spray the driveway with detergent",
      "Scrub the driveway with a brush",
      "Rinse the driveway with water",
      "Let the driveway dry under the sun",
    ],
  },
];

export const getSuggestions = () => {
  return {
    byItem: suggestions,
    misc: miscSuggestions,
  };
};
