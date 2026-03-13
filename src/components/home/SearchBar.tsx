import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/services?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4">
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-card px-4 py-3 card-shadow">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="What service are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
    </form>
  );
};

export default SearchBar;
