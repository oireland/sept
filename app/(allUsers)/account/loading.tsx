import LoadingSkeleton from "@/components/LoadingSkeleton";
import Banner from "../../../components/banner";

export default function Loading() {
  return (
    <div>
      <Banner text="My Account" />
      <LoadingSkeleton />
    </div>
  );
}
