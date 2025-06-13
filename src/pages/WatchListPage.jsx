import { useContext, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Star, Trash2, RefreshCw, Search, AlertCircle } from "lucide-react";
import { UserContext } from "../context/userContext";
import { watchlistService } from "../services/WatchlistService";

export const WatchListPage = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const [watchlistCoins, setWatchlistCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch watchlist data
  const fetchWatchlistData = async () => {
    if (!isAuthenticated || !user?.id) {
      setError("Please login to view your watchlist");
      setIsLoading(false);
      return;
    }

    try {
      setError("");
      const data = await watchlistService.getWatchlistWithMarketData(user.id);
      setWatchlistCoins(data);
    } catch (err) {
      setError("Failed to fetch watchlist data. Please try again later.");
      console.error("Error fetching watchlist:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchWatchlistData();
  }, [isAuthenticated, user]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWatchlistData();
    setRefreshing(false);
  };

  // Remove from watchlist
  const handleRemoveFromWatchlist = async (coinId) => {
    try {
      await watchlistService.removeFromWatchlist(user.id, coinId);
      
      // Update local state
      setWatchlistCoins(prev => prev.filter(coin => coin.id !== coinId));
      
      // Show success message briefly
      setError("");
    } catch (err) {
      console.error("Error removing from watchlist:", err);
      setError("Failed to remove coin from watchlist. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Filter watchlist based on search
  const filteredWatchlist = watchlistCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate portfolio stats
  const totalValue = watchlistCoins.reduce((sum, coin) => sum + coin.current_price, 0);
  const gainers = watchlistCoins.filter(coin => coin.price_change_percentage_24h > 0).length;
  const losers = watchlistCoins.filter(coin => coin.price_change_percentage_24h < 0).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-gray-300 mb-6">Please login to view your watchlist</p>
          <button
            onClick={() => window.location.href = "/login"}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center">
          <RefreshCw className="h-6 w-6 mr-2 animate-spin" />
          Loading your watchlist...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Star className="h-8 w-8 text-yellow-400 mr-3" />
            My Watchlist
          </h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Total Coins</div>
            <div className="text-2xl font-bold text-white">{watchlistCoins.length}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Total Value</div>
            <div className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Gainers (24h)</div>
            <div className="text-2xl font-bold text-green-400">{gainers}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Losers (24h)</div>
            <div className="text-2xl font-bold text-red-400">{losers}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search your watchlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-4">
            <div className="flex items-center text-red-200">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {watchlistCoins.length === 0 && !error ? (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Your watchlist is empty</h3>
            <p className="text-gray-400 mb-6">Start adding cryptocurrencies to track their performance</p>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
            >
              Browse Cryptocurrencies
            </button>
          </div>
        ) : (
          <>
            {/* Watchlist Table */}
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
                        7d Change
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Market Cap
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Volume (24h)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredWatchlist.map((coin) => (
                      <tr
                        key={coin.id}
                        className="hover:bg-gray-700 transition-colors"
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`flex items-center text-sm ${
                              coin.price_change_percentage_7d_in_currency >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {coin.price_change_percentage_7d_in_currency >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(coin.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          ${coin.market_cap.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          ${coin.total_volume.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleRemoveFromWatchlist(coin.id)}
                            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                            title="Remove from watchlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mt-4 text-gray-400 text-sm">
                Showing {filteredWatchlist.length} of {watchlistCoins.length} coins
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
