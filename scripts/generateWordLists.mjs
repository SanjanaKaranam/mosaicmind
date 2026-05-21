const DWYL_URL =
  "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt";
const NORVIG_URL = "https://norvig.com/ngrams/count_1w.txt";

async function fetchWordList() {
  console.log("Fetching dwyl word list...");
  const res = await fetch(DWYL_URL);
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
    console.log(`${len}-letter words: ${list.length} (sample: ${list.slice(0, 5).join(", ")})`);
  }
  return buckets;
}

async function fetchFrequencies() {
  console.log("Fetching Norvig frequency list...");
  const res = await fetch(NORVIG_URL);
  const text = await res.text();
  const freqMap = new Map();
  for (const line of text.split("\n")) {
    const [word, count] = line.trim().split("\t");
    if (word && count) freqMap.set(word.toLowerCase(), parseInt(count, 10));
  }
  console.log(`Total frequency entries: ${freqMap.size}`);
  const sample = [...freqMap.entries()].slice(0, 5);
  console.log(`Sample: ${sample.map(([w, c]) => `${w}(${c})`).join(", ")}`);
  return freqMap;
}

const words = await fetchWordList();
filterByLength(words);
await fetchFrequencies();
