export const gameCatalog = [
  {
    key: "speed-math",
    title: "Speed Math",
    description:
      "Solve the maximum number of math questions in 35 seconds. Difficulty increases as you progress.",
    durationSeconds: 35,
    supportedEntryFees: [5, 10],
    defaultEntryFee: 5,
    status: "live",
    howItWorks: [
      "First 5 questions are very easy.",
      "Next 5 become easy.",
      "Then medium and then harder rounds follow.",
      "Player with more correct answers wins."
    ]
  },
  {
    key: "typing-race",
    title: "Typing Race",
    description:
      "Both players type the same 20 to 30 word sentence. Accuracy and speed decide the winner.",
    durationSeconds: 35,
    supportedEntryFees: [5, 10],
    defaultEntryFee: 10,
    status: "live",
    howItWorks: [
      "Both players get the same sentence.",
      "Sentence length stays between 20 and 30 words.",
      "Fastest accurate result wins."
    ]
  }
];

export const typingPrompts = [
  "Fast fingers and calm focus often decide the winner in a short one versus one typing battle online.",
  "Quick thinking and accurate typing help every player finish the same sentence before the timer expires.",
  "Steady rhythm matters more than panic when two players race through a short sentence for real cash."
];
