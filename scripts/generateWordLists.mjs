const DWYL_URL =
  "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt";

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

const words = await fetchWordList();
filterByLength(words);
