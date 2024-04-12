const fs = require("fs");
const cluesImport = require("./clues.json");

const { clues } = cluesImport;

// console.log({ length: clues.length });

const newClues = clues.map((clue) => ({
  ...clue,
  id: `${clue.show_number}:${clue.round}:${clue.category}:${clue.value}`,
}));

// console.log({ clues: clues[0], newClues: newClues[0] });

console.log("writing file");
fs.writeFileSync("./clues.json", JSON.stringify({ clues: newClues }));
console.log("done writing file");
