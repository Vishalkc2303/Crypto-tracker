import React, { useContext, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, LogOut, Star, Search, ArrowLeft, ExternalLink, Activity, DollarSign, BarChart3 } from "lucide-react";

// Mock UserContext for demo
const UserContext = React.createContext({
  user: { name: "Demo User", email: "demo@example.com" }
});

const handleLogout = async () => {
  console.log("Logout clicked");
  // In real app: await authService.logout();
  // window.location.href = "/login";
};

// Individual Coin Detail Component
 export const CoinDetail = ({ coin, onBack }) => {
  const [coinDetail, setCoinDetail] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinDetail = async () => {
      try {
        setLoading(true);
        
        // Fetch detailed coin data
        const detailResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
        );
        const detailData = await detailResponse.json();
        
        // Fetch price history (7 days)
        const historyResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=7&interval=daily`
        );
        const historyData = await historyResponse.json();
        
        setCoinDetail(detailData);
        setPriceHistory(historyData.prices || []);
      } catch (error) {
        console.error("Error fetching coin details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetail();
  }, [coin.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading coin details...</div>
        </div>
      </div>
    );
  }

  if (!coinDetail) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <button
          onClick={onBack}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <div className="text-center text-red-400">Failed to load coin details</div>
      </div>
    );
  }

  const marketData = coinDetail.market_data;
  const priceChange24h = marketData?.price_change_percentage_24h || 0;
  const priceChange7d = marketData?.price_change_percentage_7d || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center space-x-4">
          {coinDetail.image?.large && (
            <img 
              src={coinDetail.image.large} 
              alt={coinDetail.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{coinDetail.name}</h1>
            <p className="text-gray-400 text-lg">{coinDetail.symbol?.toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Price Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Current Price</h3>
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-3xl font-bold">
              ${marketData?.current_price?.usd?.toLocaleString() || 'N/A'}
            </p>
            <div className={`flex items-center mt-2 ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange24h >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(priceChange24h).toFixed(2)}% (24h)
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Market Cap</h3>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold">
              ${marketData?.market_cap?.usd?.toLocaleString() || 'N/A'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Rank #{marketData?.market_cap_rank || 'N/A'}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">24h Volume</h3>
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold">
              ${marketData?.total_volume?.usd?.toLocaleString() || 'N/A'}
            </p>
            <div className={`flex items-center mt-2 ${priceChange7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange7d >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(priceChange7d).toFixed(2)}% (7d)
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Price Range (24h)</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Low:</span>
                <span className="font-semibold">${marketData?.low_24h?.usd?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High:</span>
                <span className="font-semibold">${marketData?.high_24h?.usd?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">All Time High:</span>
                <span className="font-semibold">${marketData?.ath?.usd?.toLocaleString() || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Supply Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Circulating:</span>
                <span className="font-semibold">
                  {marketData?.circulating_supply?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Supply:</span>
                <span className="font-semibold">
                  {marketData?.total_supply?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Supply:</span>
                <span className="font-semibold">
                  {marketData?.max_supply?.toLocaleString() || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {coinDetail.description?.en && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h3 className="text-lg font-semibold mb-4">About {coinDetail.name}</h3>
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: coinDetail.description.en.split('.')[0] + '.' 
              }}
            />
          </div>
        )}

        {/* Links */}
        {(coinDetail.links?.homepage?.[0] || coinDetail.links?.blockchain_site?.[0]) && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Official Links</h3>
            <div className="flex flex-wrap gap-4">
              {coinDetail.links.homepage?.[0] && (
                <a
                  href={coinDetail.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Website
                </a>
              )}
              {coinDetail.links.blockchain_site?.[0] && (
                <a
                  href={coinDetail.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Explorer
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};