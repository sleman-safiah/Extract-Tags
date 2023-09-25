const fs = require("fs");
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

let wordA = "";
let wordB = "";
const TAGS = [...];

let memo = Array.from({ length: 20 }, () => new Array(20).fill(0));

function compareStrings(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) {
    return 0;
  }

  if (a.length === 0) {
    return b.length;
  }

  if (b.length === 0) {
    return a.length;
  }

  if (a[0] === b[0]) {
    return (
      memo[wordA.length - a.length][wordB.length - b.length] +
      compareStrings(a.slice(1), b.slice(1))
    );
  }
  let res =
    memo[wordA.length - a.length][wordB.length - b.length] +
    Math.min(
      compareStrings(a.slice(1), b) + 1,
      compareStrings(a, b.slice(1)) + 1,
      compareStrings(a.slice(1), b.slice(1)) + 1
    );
  return (memo[wordA.length - a.length][wordB.length - b.length] =
    res as never);
}

function testOneDescription(desc: string) {
  const words = desc
    .replace(/[.,\/#!$%\^&\*;:{}=\_~()]/g, " ")
    .split(" ")
    .filter((v) => v.length > 3);

  //   words.forEach((word) => {
  //     wordA = word;
  //     Object.entries(existedTags).forEach((en) => {
  //       en[1].forEach((e) => {
  //         memo = Array.from({ length: 20 }, () => new Array(20).fill(0));
  //         wordB = e;
  //         if (
  //              compareStrings(word.toLocaleLowerCase(), e.toLocaleLowerCase()) <= 1
  //         ) {
  //           console.log(word, e);
  //         }
  //       });
  //     });
  //   });
  const uniqueTags = new Set<string>();
  words.forEach((word) => {
    TAGS.forEach((tag) => {
      if (word.toLocaleLowerCase() === tag.toLocaleLowerCase()) {
        uniqueTags.add(tag);
      }
    });
  });
  return Array.from(uniqueTags);
}

function main() {
  let content = [];
  fs.createReadStream("./pd.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", (row) => {
      let keys = testOneDescription(row[1]);
      content.push([row[0], keys.join(",")]);
    })
    .on("end", () => {
      stringify(content, {}, (err, output) => {
        if (err) throw err;
        fs.writeFile("my.csv", output, (err) => {
          if (err) throw err;
          console.log("my.csv saved.");
        });
      });
    });
}

main();
