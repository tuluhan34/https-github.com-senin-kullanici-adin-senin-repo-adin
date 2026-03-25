const turkishCharMap: Record<string, string> = {
  c: "c",
  C: "c",
  g: "g",
  G: "g",
  i: "i",
  I: "i",
  o: "o",
  O: "o",
  s: "s",
  S: "s",
  u: "u",
  U: "u",
  "ç": "c",
  "Ç": "c",
  "ğ": "g",
  "Ğ": "g",
  "ı": "i",
  "İ": "i",
  "ö": "o",
  "Ö": "o",
  "ş": "s",
  "Ş": "s",
  "ü": "u",
  "Ü": "u",
};

export const hashString = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

export const createSeededRandom = (seed: number) => {
  let localSeed = seed || 1;

  return () => {
    localSeed |= 0;
    localSeed = (localSeed + 0x6d2b79f5) | 0;
    let value = Math.imul(localSeed ^ (localSeed >>> 15), 1 | localSeed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const pickOne = <T>(items: readonly T[], random: () => number) => {
  return items[Math.floor(random() * items.length)] as T;
};

export const pickMany = <T>(items: readonly T[], count: number, random: () => number) => {
  const pool = [...items];
  const results: T[] = [];

  while (pool.length > 0 && results.length < count) {
    const index = Math.floor(random() * pool.length);
    results.push(pool.splice(index, 1)[0]);
  }

  return results;
};

export const slugify = (value: string) => {
  return value
    .split("")
    .map((character) => turkishCharMap[character] ?? character)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
};

export const stripHtml = (value: string) => {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

export const getWordCount = (value: string) => {
  const plainText = stripHtml(value);

  if (!plainText) {
    return 0;
  }

  return plainText.split(/\s+/).filter(Boolean).length;
};

export const excerptFromHtml = (value: string, maxLength: number) => {
  const plainText = stripHtml(value);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength - 1).trim()}...`;
};

export const truncateAtWordBoundary = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  const sliced = value.slice(0, maxLength + 1);
  const lastSpace = sliced.lastIndexOf(" ");

  if (lastSpace < Math.floor(maxLength * 0.6)) {
    return value.slice(0, maxLength).trim();
  }

  return sliced.slice(0, lastSpace).trim();
};

export const formatBlogDate = (value: string) => {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

export const getIstanbulClock = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const dateKey = `${values.year}-${values.month}-${values.day}`;
  const timeKey = `${values.hour}:${values.minute}`;

  return {
    dateKey,
    timeKey,
  };
};

export const sleep = async (milliseconds: number) => {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};