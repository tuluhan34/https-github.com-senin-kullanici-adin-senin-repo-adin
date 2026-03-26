import addresses from "../clean-upload/addresses.json";

const trMap = {
  c: "ç",
  g: "ğ",
  i: "ı",
  o: "ö",
  s: "ş",
  u: "ü",
};

const normalize = (value) =>
  String(value || "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const slugifyTr = (value) => normalize(value);

const uniqueBy = (items, makeKey) => {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = makeKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
};

export const neighborhoodPages = uniqueBy(
  addresses
    .filter((item) => item?.district && item?.neighborhood)
    .map((item) => ({
      district: item.district,
      neighborhood: item.neighborhood,
      street: item.street || "",
      number: item.number || "",
      description: item.description || "",
      districtSlug: slugifyTr(item.district),
      neighborhoodSlug: slugifyTr(item.neighborhood),
    })),
  (item) => `${item.districtSlug}__${item.neighborhoodSlug}`,
);

export const getNeighborhoodBySlugs = (districtSlug, neighborhoodSlug) =>
  neighborhoodPages.find(
    (item) => item.districtSlug === districtSlug && item.neighborhoodSlug === neighborhoodSlug,
  ) || null;

export const getNeighborhoodsByDistrictName = (districtName) => {
  const districtSlug = slugifyTr(districtName);
  return neighborhoodPages.filter((item) => item.districtSlug === districtSlug);
};
