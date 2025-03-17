import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Function to fetch token suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 1) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        // Using CoinGecko API to search for cryptocurrencies
        const response = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${query}`
        );
        const data = await response.json();
        
        // Extract coins from the response
        const coins = data.coins || [];
        
        // Prioritize major cryptocurrencies like Solana in results
        const sortedCoins = coins.sort((a: any, b: any) => {
          // Prioritize exact matches to the query
          if (a.name.toLowerCase() === query.toLowerCase() || 
              a.symbol.toLowerCase() === query.toLowerCase()) return -1;
          if (b.name.toLowerCase() === query.toLowerCase() || 
              b.symbol.toLowerCase() === query.toLowerCase()) return 1;
          
          // Then prioritize by market cap rank
          return (a.market_cap_rank || 1000) - (b.market_cap_rank || 1000);
        });
        
        setSuggestions(sortedCoins.slice(0, 8)); // Limit to 8 suggestions
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call to prevent too many requests
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
    setShowSuggestions(false);
    // Here you would implement the actual search functionality
  };

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    console.log("Selected cryptocurrency:", suggestion);
    // Implement what happens when a suggestion is selected
  };

  // For clicking outside the suggestions to close them
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 lg:px-8">
      <form 
        onSubmit={handleSearch} 
        className="max-w-3xl mx-auto flex items-center gap-2 relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicking form from closing suggestions
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for cryptocurrencies (e.g., Solana, BTC, ETH)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-10"
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && (query.length > 0) && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 rounded-md shadow-lg max-h-64 overflow-auto border border-slate-200 dark:border-slate-700">
              {loading ? (
                <div className="p-2 text-center text-slate-500">Loading...</div>
              ) : suggestions.length > 0 ? (
                <ul>
                  {suggestions.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item.thumb && (
                        <img src={item.thumb} alt={item.name} className="w-6 h-6 rounded-full" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.symbol.toUpperCase()}</div>
                      </div>
                      {item.market_cap_rank && (
                        <div className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          #{item.market_cap_rank}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-2 text-center text-slate-500">No results found</div>
              )}
            </div>
          )}
        </div>
        <Button type="submit">Search</Button>
      </form>
    </div>
  );
};

export default SearchBar;