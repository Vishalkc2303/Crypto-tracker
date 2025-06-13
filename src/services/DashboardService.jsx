import { useContext, useEffect, useState } from "react";
import { TrendingUp, TrendingDown, LogOut, Star } from "lucide-react";
import { UserContext } from "../../context/userContext";
import { authService } from "../../services/authService";

const handleLogout = async () => {
  const result = await authService.logout();

  if (result.success) {
    // Redirect after logout
    window.location.href = "/login"; // or use navigate('/login') if using useNavigate()
  } else {
    console.error("Logout failed");
  }
};

export const Dashboard = () => {
  const { user} = useContext(UserContext);
  const [cryptoData, setCryptoData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock crypto data - replace with actual API call
  useEffect(() => {
    const mockData = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        price: 45250.3,
        change: 2.45,
        isFavorite: false,
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        price: 3120.8,
        change: -1.2,
        isFavorite: true,
      },
      {
        id: "cardano",
        name: "Cardano",
        symbol: "ADA",
        price: 0.85,
        change: 5.3,
        isFavorite: false,
      },
      {
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        price: 95.4,
        change: -3.1,
        isFavorite: false,
      },
      {
        id: "polkadot",
        name: "Polkadot",
        symbol: "DOT",
        price: 12.75,
        change: 1.85,
        isFavorite: true,
      },
    ];

    setTimeout(() => {
      setCryptoData(mockData);
      setFavorites(mockData.filter((coin) => coin.isFavorite));
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleFavorite = async (coinId) => {
    try {
      // This would be an API call to your backend
      const response = await fetch(`/api/favorites/${coinId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setCryptoData((prev) =>
          prev.map((coin) =>
            coin.id === coinId
              ? { ...coin, isFavorite: !coin.isFavorite }
              : coin
          )
        );
        setFavorites((prev) => {
          const updated = cryptoData.find((coin) => coin.id === coinId);
          if (updated?.isFavorite) {
            return prev.filter((coin) => coin.id !== coinId);
          } else {
            return [...prev, { ...updated, isFavorite: true }];
          }
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
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
            <span className="text-gray-300">
              Welcome, {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Favorites Section */}
        {favorites.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              Your Favorites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((coin) => (
                <div
                  key={coin.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{coin.name}</h3>
                    <span className="text-gray-400 text-sm">{coin.symbol}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${coin.price.toLocaleString()}
                    </span>
                    <div
                      className={`flex items-center ${
                        coin.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {coin.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(coin.change).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Coins Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">All Cryptocurrencies</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {cryptoData.map((coin) => (
                    <tr
                      key={coin.id}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {coin.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {coin.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">
                          ${coin.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`flex items-center text-sm ${
                            coin.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {coin.change >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(coin.change).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFavorite(coin.id)}
                          className={`p-2 rounded-full transition-colors ${
                            coin.isFavorite
                              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                              : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                          }`}
                        >
                          <Star
                            className="h-4 w-4"
                            fill={coin.isFavorite ? "currentColor" : "none"}
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

