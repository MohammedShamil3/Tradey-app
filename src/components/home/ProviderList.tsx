import ProviderCard from "./ProviderCard";
import HorizontalScroll from "@/components/ui/HorizontalScroll";
import provider1 from "@/assets/provider-1.jpg";
import provider2 from "@/assets/provider-2.jpg";
import provider3 from "@/assets/provider-3.jpg";

const providers = [
  { id: "t1", name: "John Smith", image: provider1, rating: 4.9, reviews: 200, experience: "8 years experience" },
  { id: "t2", name: "Sophie Baker", image: provider2, rating: 4.8, reviews: 156, experience: "10 years experience" },
  { id: "t3", name: "Peter Jensen", image: provider3, rating: 4.7, reviews: 98, experience: "5 years experience" },
];

const ProviderList = () => {
  return (
    <div className="px-4">
      <HorizontalScroll
        title={<h3 className="text-lg font-bold text-foreground">Top Tradesmen</h3>}
        subtitle="Most popular professionals near you"
      >
        {providers.map((p) => (
          <ProviderCard key={p.name} {...p} />
        ))}
      </HorizontalScroll>
    </div>
  );
};

export default ProviderList;
