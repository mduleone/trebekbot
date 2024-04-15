const fs = require("fs");
const cluesImport = require("./clues.json");

const { clues } = cluesImport;

// const clues = [
//   {
//     category: "NOT A CURRENT NATIONAL CAPITAL",
//     air_date: "2006-02-06",
//     question: "'Istanbul,<br />Ottawa,<br />Amman'",
//     value: "$800",
//     answer: "Istanbul",
//     round: "Double Jeopardy!",
//     show_number: "4931",
//     id: "4931:Double Jeopardy!:NOT A CURRENT NATIONAL CAPITAL:$800",
//   },
//   {
//     category: "U.S. WINTER OLYMPIANS",
//     air_date: "2006-02-06",
//     question:
//       '\'(<a href="http://www.j-archive.com/media/2006-02-06_DJ_23.jpg" target="_blank">Jimmy of the Clue Crew puts some lines on the ice in the Olympic Oval rink at Park City, UT.</a>)  In 1998, <a href="http://www.j-archive.com/media/2006-02-06_DJ_23a.jpg" target="_blank">this U.S. skater</a> was 2nd at Nagano; in 2002, she was 3rd here in Utah\'',
//     value: "$800",
//     answer: "Michelle Kwan",
//     round: "Double Jeopardy!",
//     show_number: "4931",
//     id: "4931:Double Jeopardy!:U.S. WINTER OLYMPIANS:$800",
//   },
//   {
//     category: "MATHEM-ATTACK!",
//     air_date: "2009-05-08",
//     question:
//       "'The symbol <i>i</i> is used to represent the imaginary square root of this number'",
//     value: "$1600",
//     answer: "-1",
//     round: "Double Jeopardy!",
//     show_number: "5690",
//     id: "5690:Double Jeopardy!:MATHEM-ATTACK!:$1600",
//   },
// ];

// console.log({ length: clues.length });

const singleQuoteRegex = /^'(.*)'$/;
const doubleQuoteRegex = /\"/g;
const anchorRegexGlobal = /<a[^>]*>([^<]+)<\/a[^>]*>/g;
const iRegexGlobal = /<i[^>]*>([^<]+)<\/i>/g;
const bigRegexGlobal = /<big[^>]*>([^<]+)<\/big>/g;
const brRegexGlobal = /<br \/>/g;
const doubleBrRegexGlobal = /<br \/><br \/>/g;
const linkRegexGlobal = /href='([^']*)'/g;
const linkRegexReplace = /href='([^']*)'/g;

const anchorRegex = /<a[^>]*>([^<]+)<\/a[^>]*>/;
const iRegex = /<i[^>]*>([^<]+)<\/i>/;
const bigRegex = /<big[^>]*>([^<]+)<\/big>/;
const brRegex = /<br \/>/;
const doubleBrRegex = /<br \/>/;
const linkRegex = /href='([^']*)'/g;

const sanitizeQuestion = (question) => {
  let newQuestion = question;
  let links = [];
  newQuestion = newQuestion.replace(singleQuoteRegex, "$1");
  newQuestion = newQuestion.replace(doubleQuoteRegex, "'");
  const linkMatches = newQuestion.match(linkRegex);
  if (linkMatches) {
    links = (newQuestion.match(linkRegexGlobal) || []).map((str) =>
      str.replace(linkRegexReplace, "$1")
    );
  }
  const doubleBrMatches = newQuestion.match(doubleBrRegex);
  if (doubleBrMatches) {
    newQuestion = newQuestion.replace(doubleBrRegexGlobal, " ");
  }
  const brMatches = newQuestion.match(brRegex);
  if (brMatches) {
    newQuestion = newQuestion.replace(brRegexGlobal, " | ");
  }
  const iMatches = newQuestion.match(iRegex);
  if (iMatches) {
    newQuestion = newQuestion.replace(iRegexGlobal, "$1");
  }
  const bigMatches = newQuestion.match(bigRegex);
  if (bigMatches) {
    newQuestion = newQuestion.replace(bigRegexGlobal, "$1");
  }
  const anchorMatches = newQuestion.match(anchorRegex);
  if (anchorMatches) {
    newQuestion = newQuestion.replace(anchorRegexGlobal, "$1");
  }

  return {
    question: newQuestion,
    links,
  };
};

const newClues = clues.map((clue) => {
  const { question, show_number: showNumber, round, category, value } = clue;
  const { question: sanitizedQuestion, links } = sanitizeQuestion(question);
  return {
    ...clue,
    id: `${showNumber}:${round}:${category}:${value}`,
    // orig: question,
    question: sanitizedQuestion,
    links,
  };
});

// console.log({ clues: clues[0], newClues: newClues[0] });

console.log("writing file");
fs.writeFileSync("./clues2.json", JSON.stringify({ clues: newClues }));
console.log("done writing file");
