import DistrictPage from "../components/district-page";
import { districts, buildDistrictContent } from "../lib/district-data";

const district = buildDistrictContent(
  districts.find((item) => item.slug === "bagcilar-moto-kurye")
);

export default function Page() {
  return <DistrictPage district={district} />;
}
