import LoadingSkeleton from "@/components/LoadingSkeleton";
import Banner from "../banner";

export default function Loading() {
  return (
    <div>
      <Banner text="Your Events" />
      <LoadingSkeleton />
    </div>
  );
}
