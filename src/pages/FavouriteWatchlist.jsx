// pages/Watchlist.jsx

import { useContext, useEffect, useState } from "react";
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft, 
  RefreshCw, 
  Trash2,
  AlertCircle,
  PlusCircle
} from "lucide-react";
import { UserContext } from "../context/userContext";
import { favoriteService } from "../services/favoriteService";
import { useNavigate } from "react-router-dom";

export const Watchlist = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch user favorites with market data
  const fetchFavorites = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const [favoritesData, statsData] = await Promise.all([
        favoriteService.getUserFavoritesWithMarketData(user.id),
        favoriteService.getFavoriteStats(user.id)
      ]);

      setFavorites(favoritesData);
      setStats(statsData);
    } catch (err) {
      setError("Failed to fetch your watchlist. Please try again.");
      console.error("Error fetching favorites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated, user]);

  // Refresh favorites
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFavorites();
    setIsRefreshing(false);
  };

  // Remove favorite
  const removeFavorite = async (coinId) => {
    try {
      await favoriteService.removeFavorite(user.id, coinId);
      setFavorites(prev => prev.filter(fav => fav.coinId !== coinId));
      
      // Update stats
      if (stats) {
        setStats(prev => ({
          ...prev,
          totalFavorites: prev.totalFavorites - 1
        }));
      }
    } catch (err) {
      setError("Failed to remove from watchlist. Please try again.");
      console.error("Error removing favorite:", err);
    }
  };

  // Calculate portfolio stats
  const calculatePortfolioStats = () => {
    if (!favorites.length) return null;

    const validFavorites = favorites.filter(fav => fav.marketData);
    
    if (!validFavorites.length) return null;

    const totalValue = validFavorites.reduce((sum, fav) => {
      return sum + (fav.marketData.current_price || 0);
    }, 0);

    const totalChange24h = validFavorites.reduce((sum, fav) => {
      return sum + (fav.marketData.price_change_24h || 0);
    }, 0);

    const avgChangePercentage = validFavorites.reduce((sum, fav) => {
      return sum + (fav.marketData.price_change_percentage_24h || 0);
    }, 0) / validFavorites.length;

    return {
      totalValue,
      totalChange24h,
      avgChangePercentage,
      coinsCount: validFavorites.length
    };
  };

  const portfolioStats = calculatePortfolioStats();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-gray-300 mb-4">
            Please login to view your cryptocurrency watchlist.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium"
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
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
          <div className="text-white text-xl">Loading your watchlist...</div>
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
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Star className="h-8 w-8 text-yellow-400 mr-3" />
            <h1 className="text-2xl font-bold">My Watchlist</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {error && (
          <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Portfolio Stats */}
        {portfolioStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Total Coins</div>
              <div className="text-2xl font-bold text-white">
                {portfolioStats.coinsCount}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Combined Value</div>
              <div className="text-2xl font-bold text-white">
                ${portfolioStats.totalValue.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">24h Change</div>
              <div className={`text-2xl font-bold flex items-center ${
                portfolioStats.totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioStats.totalChange24h >= 0 ? (
                  <TrendingUp className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-1" />
                )}
                ${Math.abs(portfolioStats.totalChange24h).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-gray-400 text-sm">Avg Change %</div>
              <div className={`text-2xl font-bold flex items-center ${
                portfolioStats.avgChangePercentage >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioStats.avgChangePercentage >= 0 ? (
                  <TrendingUp className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-1" />
                )}
                {Math.abs(portfolioStats.avgChangePercentage).toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Star className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-300 mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Start adding cryptocurrencies to your watchlist to track them here.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium mx-auto"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Browse Cryptocurrencies
            </button>
          </div>
        ) : (
          <>
            {/* Watchlist Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Your Cryptocurrencies ({favorites.length})
              </h2>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add More
              </button>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {favorites.map((favorite) => {
                const marketData = favorite.marketData;
                const hasMarketData = marketData !== null;

                return (
                  <div
                    key={favorite.id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img
                          src={favorite.coinImage || '/api/placeholder/32/32'}
                          alt={favorite.coinName}
                          className="w-10 h-10 mr-3"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/32/32';
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{favorite.coinName}</h3>
                          <span className="text-gray-400 text-sm">
                            {favorite.coinSymbol.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFavorite(favorite.coinId)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {hasMarketData ? (
                      <>
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-white mb-1">
                            ${marketData.current_price.toLocaleString()}
                          </div>
                          <div className={`flex items-center text-sm ${
                            marketData.price_change_percentage_24h >= 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}>
                            {marketData.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(marketData.price_change_percentage_24h).toFixed(2)}%
                            <span className="ml-2 text-gray-400">
                              (${Math.abs(marketData.price_change_24h).toFixed(2)})
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Market Cap:</span>
                            <span className="text-white">
                              ${marketData.market_cap.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Volume (24h):</span>
                            <span className="text-white">
                              ${marketData.total_volume.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rank:</span>
                            <span className="text-white">
                              #{marketData.market_cap_rank}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="text-xs text-gray-400">
                            Added on: {new Date(favorite.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <div className="text-gray-400 text-sm">
                          Market data unavailable
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Added on: {new Date(favorite.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Watchlist Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-700">
                <h3 className="text-lg font-semibold">Detailed View</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {favorites.map((favorite) => {
                      const marketData = favorite.marketData;
                      const hasMarketData = marketData !== null;

                      return (
                        <tr key={favorite.id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={favorite.coinImage || '/api/placeholder/32/32'}
                                alt={favorite.coinName}
                                className="w-8 h-8 mr-3"
                                onError={(e) => {
                                  e.target.src = '/api/placeholder/32/32';
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {favorite.coinName}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {favorite.coinSymbol.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasMarketData ? (
                              <div className="text-sm font-semibold text-white">
                                ${marketData.current_price.toLocaleString()}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">N/A</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasMarketData ? (
                              <div className={`flex items-center text-sm ${
                                marketData.price_change_percentage_24h >= 0
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }`}>
                                {marketData.price_change_percentage_24h >= 0 ? (
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                {Math.abs(marketData.price_change_percentage_24h).toFixed(2)}%
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">N/A</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasMarketData && marketData.price_change_percentage_7d_in_currency ? (
                              <div className={`flex items-center text-sm ${
                                marketData.price_change_percentage_7d_in_currency >= 0
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }`}>
                                {marketData.price_change_percentage_7d_in_currency >= 0 ? (
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                {Math.abs(marketData.price_change_percentage_7d_in_currency).toFixed(2)}%
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">N/A</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {hasMarketData ? (
                              <div className="text-sm text-white">
                                ${marketData.market_cap.toLocaleString()}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">N/A</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => removeFavorite(favorite.coinId)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-lg transition-colors"
                              title="Remove from watchlist"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};