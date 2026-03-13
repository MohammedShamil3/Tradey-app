import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProviderCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  experience: string;
}

const ProviderCard = ({ id, name, image, rating, reviews, experience }: ProviderCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/traders/${id}`)}
      className="min-w-[200px] shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-card card-shadow transition-all hover:card-shadow-hover active:scale-[0.98]">
      
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover" />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 backdrop-blur-sm">
          <Star className="h-3 w-3 fill-star text-star" />
          <span className="text-xs font-bold text-foreground">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-bold text-foreground text-sm">{name}</h4>
        <p className="text-xs text-muted-foreground">{experience}</p>
      </div>
    </div>);

};

export default ProviderCard;