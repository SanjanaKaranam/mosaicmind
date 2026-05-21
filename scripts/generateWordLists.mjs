const DWYL_URL =
  "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt";

async function fetchWordList() {
  console.log("Fetching dwyl word list...");
  const res = await fetch(DWYL_URL);
  const text = await res.text();
  const words = text.split("\n").map((w) => w.trim().toLowerCase()).filter(Boolean);
  console.log(`Total words fetched: ${words.length}`);
  console.log(`Sample: ${words.slice(0, 10).join(", ")}`);
  return words;
}

fetchWordList();
