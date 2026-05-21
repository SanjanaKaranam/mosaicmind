import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const ENABLE_URL =
  "https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt";
const NORVIG_URL = "https://norvig.com/ngrams/count_1w.txt";
const PROFANITY_URL =
  "https://raw.githubusercontent.com/coffee-and-fun/google-profanity-words/main/data/list.txt";
const NAMES_URL =
  "https://raw.githubusercontent.com/dominictarr/random-name/master/first-names.txt";

const MIN_FREQ = 5_000_000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const PLACES_BLOCKLIST = new Set([
  "bangkok", "bolivia", "bristol", "buffalo", "cologne", "colorado",
  "concord", "english", "florence", "franklin", "egyptian", "emirates",
  "bengali", "persian", "russian", "african", "chinese", "mexican",
  "turkish", "israeli", "iranian", "lebanese", "swedish", "belgian",
  "denmark", "finland", "ireland", "nigeria", "ukraine", "vietnam",
]);

async function fetchWordList() {
  console.log("Fetching ENABLE word list...");
  const res = await fetch(ENABLE_URL);
  const text = await res.text();
  const words = text.split("\n").map((w) => w.trim().toLowerCase()).filter(Boolean);
  console.log(`Total words fetched: ${words.length}`);
  return words;
}

function filterByLength(words) {
  const buckets = { 4: [], 5: [], 6: [], 7: [], 8: [] };
  for (const word of words) {
    if (buckets[word.length]) buckets[word.length].push(word);
  }
  for (const [len, list] of Object.entries(buckets)) {
    console.log(`${len}-letter words: ${list.length}`);
  }
  return buckets;
}

async function fetchBlocklist() {
  console.log("\nFetching profanity + names blocklists...");
  const [profanityRes, namesRes] = await Promise.all([
    fetch(PROFANITY_URL),
    fetch(NAMES_URL),
  ]);
  const profanityText = await profanityRes.text();
  const namesText = await namesRes.text();
  const blocklist = new Set([
    ...profanityText.split("\n").map((w) => w.trim().toLowerCase()).filter(Boolean),
    ...namesText.split("\n").map((w) => w.trim().toLowerCase()).filter(Boolean),
    ...PLACES_BLOCKLIST,
  ]);
  console.log(`Blocklist size: ${blocklist.size} words`);
  return blocklist;
}

async function fetchFrequencies() {
  console.log("\nFetching Norvig frequency list...");
  const res = await fetch(NORVIG_URL);
  const text = await res.text();
  const freqMap = new Map();
  for (const line of text.split("\n")) {
    const [word, count] = line.trim().split("\t");
    if (!word || !count) continue;
    const lower = word.toLowerCase();
    freqMap.set(lower, (freqMap.get(lower) ?? 0) + parseInt(count, 10));
  }
  console.log(`Total frequency entries: ${freqMap.size}`);
  return freqMap;
}

function filterByFrequency(buckets, freqMap, blocklist, minFreq) {
  const filtered = {};
  for (const [len, list] of Object.entries(buckets)) {
    filtered[len] = list.filter(
      (w) => (freqMap.get(w) ?? 0) >= minFreq && !blocklist.has(w)
    );
    console.log(`${len}-letter words after filter: ${filtered[len].length} (sample: ${filtered[len].slice(0, 5).join(", ")})`);
  }
  return filtered;
}

async function writeWordLists(filtered) {
  for (const [len, list] of Object.entries(filtered)) {
    const outPath = join(__dirname, `../src/data/unscramble/${len}-letter.json`);
    await writeFile(outPath, JSON.stringify(list, null, 2));
    console.log(`Wrote ${list.length} words → ${len}-letter.json`);
  }
}

const words = await fetchWordList();
const buckets = filterByLength(words);
const [freqMap, blocklist] = await Promise.all([fetchFrequencies(), fetchBlocklist()]);
console.log(`\n--- Filtering at min frequency: ${MIN_FREQ.toLocaleString()} ---`);
const filtered = filterByFrequency(buckets, freqMap, blocklist, MIN_FREQ);
await writeWordLists(filtered);
