const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const galleryDir = path.join(root, "public", "gallery");
const outputPath = path.join(root, "src", "lib", "generated-gallery-assets.json");

const actualExtensions = [".webp", ".jpg", ".jpeg", ".png"];
const placeholderExtension = ".svg";
const slotCount = 8;
const envFiles = [".env.local", ".env"];
const unsplashQueries = [
  "istiklal avenue istanbul shops",
  "istanbul shopping mall interior",
  "galata istanbul street shops",
  "karakoy istanbul waterfront city",
  "istanbul street cat neighborhood",
  "istanbul seagulls ferry bosphorus",
  "nisantasi istanbul shopping street night",
  "istanbul courtyard pigeons",
];

const readEnvValue = (key) => {
  for (const envFile of envFiles) {
    const envPath = path.join(root, envFile);

    if (!fs.existsSync(envPath)) {
      continue;
    }

    const content = fs.readFileSync(envPath, "utf8");
    const line = content
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith(`${key}=`));

    if (!line) {
      continue;
    }

    return line.slice(line.indexOf("=") + 1).trim();
  }

  return process.env[key] || "";
};

const isImageFile = (name) => /\.(webp|jpg|jpeg|png|svg)$/i.test(name);

const toPublicPath = (fileName) => `/gallery/${fileName.replace(/\\/g, "/")}`;

const byPreferredExtension = (left, right) => {
  const leftIndex = actualExtensions.indexOf(path.extname(left).toLowerCase());
  const rightIndex = actualExtensions.indexOf(path.extname(right).toLowerCase());
  return leftIndex - rightIndex;
};

const fetchUnsplashAssets = async () => {
  const accessKey = readEnvValue("UNSPLASH_ACCESS_KEY");

  if (!accessKey) {
    return null;
  }

  try {
    const assets = {};

    for (let index = 0; index < slotCount; index += 1) {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?orientation=landscape&content_filter=high&query=${encodeURIComponent(unsplashQueries[index])}`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
            "Accept-Version": "v1",
          },
        },
      );

      if (!response.ok) {
        return null;
      }

      const imageItem = await response.json();
      const imageUrl = imageItem?.urls?.regular || imageItem?.urls?.full;

      if (!imageUrl) {
        return null;
      }

      assets[`photo-${index + 1}`] = imageUrl;
    }

    return assets;
  } catch {
    return null;
  }
};

const buildLocalAssets = () => {
  const galleryFiles = fs.existsSync(galleryDir)
    ? fs.readdirSync(galleryDir).filter((file) => isImageFile(file))
    : [];

  const explicitMatches = new Map();

  for (let index = 1; index <= slotCount; index += 1) {
    const key = `photo-${index}`;
    const candidates = galleryFiles
      .filter((file) => path.parse(file).name === key && actualExtensions.includes(path.extname(file).toLowerCase()))
      .sort(byPreferredExtension);

    if (candidates.length > 0) {
      explicitMatches.set(key, candidates[0]);
    }
  }

  const fallbackRealFiles = galleryFiles
    .filter((file) => actualExtensions.includes(path.extname(file).toLowerCase()))
    .filter((file) => ![...explicitMatches.values()].includes(file))
    .sort((left, right) => left.localeCompare(right, "tr"));

  const assets = {};
  let fallbackIndex = 0;

  for (let index = 1; index <= slotCount; index += 1) {
    const key = `photo-${index}`;
    const explicitFile = explicitMatches.get(key);

    if (explicitFile) {
      assets[key] = toPublicPath(explicitFile);
      continue;
    }

    if (fallbackIndex < fallbackRealFiles.length) {
      assets[key] = toPublicPath(fallbackRealFiles[fallbackIndex]);
      fallbackIndex += 1;
      continue;
    }

    assets[key] = `/gallery/${key}${placeholderExtension}`;
  }

  return assets;
};

const readExistingManifest = () => {
  if (!fs.existsSync(outputPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(outputPath, "utf8"));
  } catch {
    return null;
  }
};

const writeManifest = async () => {
  const existingManifest = readExistingManifest();
  const unsplashAssets = await fetchUnsplashAssets();
  const localAssets = buildLocalAssets();
  const localHasRealPhotos = Object.values(localAssets).some((value) => !String(value).endsWith(".svg"));
  const existingHasRealPhotos = Object.values(existingManifest?.assets || {}).some(
    (value) => !String(value).endsWith(".svg"),
  );
  const assets = unsplashAssets || (localHasRealPhotos ? localAssets : existingHasRealPhotos ? existingManifest.assets : localAssets);
  const usingRealPhotos = Object.values(assets).some((value) => !String(value).endsWith(".svg"));

  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        usingRealPhotos,
        generatedAt: new Date().toISOString(),
        assets,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );

  console.log(
    `Gallery asset manifest updated: ${unsplashAssets ? "unsplash-remote" : usingRealPhotos ? "local-real-photos" : "svg-placeholders"}`,
  );
};

writeManifest().catch((error) => {
  console.error("Gallery asset sync failed:", error);
  process.exitCode = 1;
});