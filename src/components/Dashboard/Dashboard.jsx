import { useContext, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, LogOut, LogIn, Star, Search } from "lucide-react";
import { UserContext } from "../../context/userContext";
import { authService } from "../../services/authService";
import { watchlistService } from "../../services/WatchlistService";
import { CoinDetail } from "../../pages/Cointdetail";
import { coinApi } from "../Common/ConstantLink";

const handleLogout = async () => {
  const result = await authService.logout();

  if (result.success) {
    window.location.href = "/login";
  } else {
    console.error("Logout failed");
  }
};

const handleLogin = async () => {
  window.location.href = "/login";
};

export const Dashboard = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const [cryptoData, setCryptoData] = useState([]);
  const [watchlistCoinIds, setWatchlistCoinIds] = useState(new Set()); // Changed from favorites
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);

  // Fetch real crypto data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${coinApi}/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h,7d`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setCryptoData(data);
      } catch (err) {
        setError(
          "Failed to fetch cryptocurrency data. Please try again later."
        );
        console.error("Error fetching crypto data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch user watchlist when authenticated
  useEffect(() => {
    const fetchUserWatchlist = async () => {
      if (isAuthenticated && user) {
        try {
          const coinIds = await watchlistService.getUserWatchlistCoinIds(user.id);
          setWatchlistCoinIds(new Set(coinIds));
        } catch (err) {
          console.error("Error fetching user watchlist:", err);
        }
      } else {
        // Load watchlist from localStorage for non-authenticated users
        const savedWatchlist = localStorage.getItem('cryptoWatchlist');
        if (savedWatchlist) {
          setWatchlistCoinIds(new Set(JSON.parse(savedWatchlist)));
        }
      }
    };

    fetchUserWatchlist();
  }, [isAuthenticated, user]);

  const toggleWatchlist = async (coinId) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
      return;
    }

    try {
      const result = await watchlistService.toggleWatchlist(user.id, coinId);
      
      // Update local state based on server response
      setWatchlistCoinIds(prev => {
        const newWatchlist = new Set(prev);
        if (result.added) {
          newWatchlist.add(coinId);
        } else {
          newWatchlist.delete(coinId);
        }
        return newWatchlist;
      });
    } catch (err) {
      console.error("Error updating watchlist:", err);
      // Show error message to user
      setError(`Failed to update watchlist. Please try again.`);
      setTimeout(() => setError(""), 3000);
    }
  };

  const filteredData = cryptoData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const watchlistCoins = filteredData.filter((coin) => watchlistCoinIds.has(coin.id));

  if (selectedCoin) {
    return (
      <CoinDetail coin={selectedCoin} onBack={() => setSelectedCoin(null)} />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Loading live cryptocurrency data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-yellow-400 mr-3" />
            <h1 className="text-2xl font-bold">Crypto Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <span className="text-gray-300">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={() => window.location.href = "/watchlist"}
                  className="flex items-center bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Star className="h-4 w-4 mr-2" />
                  My Watchlist ({watchlistCoinIds.size})
                </button>
              </>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Watchlist Section - Only show if user is authenticated and has watchlist items */}
        {isAuthenticated && watchlistCoins.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              Your Watchlist ({watchlistCoins.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlistCoins.map((coin) => (
                <div
                  key={coin.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => setSelectedCoin(coin)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 mr-2"
                      />
                      <div>
                        <h3 className="font-semibold">{coin.name}</h3>
                        <span className="text-gray-400 text-sm">
                          {coin.symbol.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(coin.id);
                      }}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <Star className="h-4 w-4" fill="currentColor" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${coin.current_price.toLocaleString()}
                    </span>
                    <div
                      className={`flex items-center ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Login prompt for watchlist */}
        {!isAuthenticated && (
          <div className="mb-8 bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg p-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-200">
                Login to save your favorite cryptocurrencies to your watchlist and access them across devices!
              </span>
            </div>
          </div>
        )}

        {/* All Coins Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            All Cryptocurrencies ({filteredData.length})
          </h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Cryptocurrency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      24h Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Market Cap
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredData.map((coin) => (
                    <tr
                      key={coin.id}
                      className="hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => setSelectedCoin(coin)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        #{coin.market_cap_rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-8 h-8 mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-white">
                              {coin.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {coin.symbol.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">
                          ${coin.current_price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`flex items-center text-sm ${
                            coin.price_change_percentage_24h >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {coin.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ${coin.market_cap.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(coin.id);
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            watchlistCoinIds.has(coin.id)
                              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                              : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                          } ${!isAuthenticated ? "hover:bg-blue-600" : ""}`}
                          title={!isAuthenticated ? "Login to save to watchlist" : "Toggle watchlist"}
                        >
                          <Star
                            className="h-4 w-4"
                            fill={watchlistCoinIds.has(coin.id) ? "currentColor" : "none"}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;