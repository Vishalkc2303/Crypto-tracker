// // services/cryptoService.js

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// class CryptoService {
  
//   // Get all cryptocurrencies
//   async getAllCryptocurrencies() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/crypto/all`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data,
//       };
//     } catch (error) {
//       console.error('Error fetching cryptocurrencies:', error);
//       return {
//         success: false,
//         error: error.message,
//         data: [],
//       };
//     }
//   }

//   // Get cryptocurrency by ID
//   async getCryptocurrencyById(id) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/crypto/${id}`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data,
//       };
//     } catch (error) {
//       console.error('Error fetching cryptocurrency:', error);
//       return {
//         success: false,
//         error: error.message,
//         data: null,
//       };
//     }
//   }

//   // Search cryptocurrencies by symbol
//   async searchBySymbol(symbol) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/crypto/search/symbol/${symbol}`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data,
//       };
//     } catch (error) {
//       console.error('Error searching by symbol:', error);
//       return {
//         success: false,
//         error: error.message,
//         data: [],
//       };
//     }
//   }

//   // Search cryptocurrencies by name
//   async searchByName(name) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/crypto/search/name/${name}`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data,
//       };
//     } catch (error) {
//       console.error('Error searching by name:', error);
//       return {
//         success: false,
//         error: error.message,
//         data: [],
//       };
//     }
//   }

//   // Get top cryptocurrencies by market cap
//   async getTopByMarketCap(limit = 10) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/crypto/top/market-cap?limit=${limit}`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data,
//       };
//     } catch (error) {
//       console.error('Error fetching top by market cap:', error);
//       return {
//         success: false,
//         error: error.message,
//         data: [],
//       };
//     }
//   }

//   // Get top cryptocurrencies by volume
//   async getTopByVolume(limit = 10) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/crypto/top/volume?limit=${limit}`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data,
//       };
//     } catch (error) {
//       console.error('Error fetching top by volume:', error);
//       return {
//         success: false,
//         error: error.message,
//         data: [],
//       };
//     }
//   }

//   // Refresh cryptocurrency data
//   async refreshData() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/crypto/refresh`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.text();
//       return {
//         success: true,
//         message: data,
//       };
//     } catch (error) {
//       console.error('Error refreshing data:', error);
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   // Get user's favorite cryptocurrencies
//   async getFavorites() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/favorites`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data,
//       };
//     } catch (error) {
//       console.error('Error fetching favorites:', error);
//       return {
//         success: false,
//         error: error.message,
//         data: [],
//       };
//     }
//   }

//   // Add cryptocurrency to favorites
//   async addToFavorites(cryptoId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/favorites/${cryptoId}`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         data: data,
//       };
//     } catch (error) {
//       console.error('Error adding to favorites:', error);
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   // Remove cryptocurrency from favorites
//   async removeFromFavorites(cryptoId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/favorites/${cryptoId}`, {
//         method: 'DELETE',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return {
//         success: true,
//       };
//     } catch (error) {
//       console.error('Error removing from favorites:', error);
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   // Toggle favorite status
//   async toggleFavorite(cryptoId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/favorites/${cryptoId}/toggle`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return {
//         success: true,
//         isFavorite: data.isFavorite,
//       };
//     } catch (error) {
//       console.error('Error toggling favorite:', error);
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   }

//   // Format currency values
//   formatCurrency(value) {
//     if (value === null || value === undefined) return '$0.00';
    
//     const numValue = parseFloat(value);
//     if (isNaN(numValue)) return '$0.00';
    
//     if (numValue >= 1e12) {
//       return `$${(numValue / 1e12).toFixed(2)}T`;
//     } else if (numValue >= 1e9) {
//       return `$${(numValue / 1e9).toFixed(2)}B`;
//     } else if (numValue >= 1e6) {
//       return `$${(numValue / 1e6).toFixed(2)}M`;
//     } else if (numValue >= 1000) {
//       return `$${(numValue / 1000).toFixed(2)}K`;
//     } else if (numValue >= 1) {
//       return `$${numValue.toFixed(2)}`;
//     } else {
//       return `$${numValue.toFixed(8)}`;
//     }
//   }

//   // Format percentage change
//   formatPercentageChange(change) {
//     if (change === null || change === undefined) return '0.00%';
    
//     const numChange = parseFloat(change);
//     if (isNaN(numChange)) return '0.00%';
    
//     return `${numChange >= 0 ? '+' : ''}${numChange.toFixed(2)}%`;
//   }

//   // Format large numbers
//   formatNumber(value) {
//     if (value === null || value === undefined) return '0';
    
//     const numValue = parseFloat(value);
//     if (isNaN(numValue)) return '0';
    
//     return new Intl.NumberFormat().format(numValue);
//   }

//   // Get price change color class
//   getPriceChangeColor(change) {
//     const numChange = parseFloat(change);
//     if (isNaN(numChange)) return 'text-gray-400';
    
//     return numChange >= 0 ? 'text-green-400' : 'text-red-400';
//   }

//   // Transform API data to match your component's expected format
//   transformCryptoData(apiData) {
//     return apiData.map(crypto => ({
//       id: crypto.id,
//       name: crypto.name,
//       symbol: crypto.symbol?.toUpperCase(),
//       price: parseFloat(crypto.currentPrice || crypto.current_price || 0),
//       change: parseFloat(crypto.priceChangePercentage24h || crypto.price_change_percentage_24h || 0),
//       marketCap: parseFloat(crypto.marketCap || crypto.market_cap || 0),
//       volume: parseFloat(crypto.volume24h || crypto.volume_24h || 0),
//       circulatingSupply: parseFloat(crypto.circulatingSupply || crypto.circulating_supply || 0),
//       isFavorite: crypto.isFavorite || false,
//       lastUpdated: crypto.lastUpdated || crypto.last_updated,
//     }));
//   }

//   // Handle API errors gracefully
//   handleError(error, fallbackData = []) {
//     console.error('CryptoService Error:', error);
    
//     // You might want to show a toast notification here
//     // or dispatch an action to update global error state
    
//     return {
//       success: false,
//       error: error.message || 'An unexpected error occurred',
//       data: fallbackData,
//     };
//   }

//   // Utility method to check if data is stale (older than 5 minutes)
//   isDataStale(lastUpdated) {
//     if (!lastUpdated) return true;
    
//     const now = new Date();
//     const updated = new Date(lastUpdated);
//     const diffMinutes = (now - updated) / (1000 * 60);
    
//     return diffMinutes > 5;
//   }

//   // Batch API calls
//   async batchFetch(requests) {
//     try {
//       const promises = requests.map(request => 
//         fetch(`${API_BASE_URL}${request.endpoint}`, {
//           method: request.method || 'GET',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             ...(request.headers || {}),
//           },
//           body: request.body ? JSON.stringify(request.body) : undefined,
//         })
//       );

//       const responses = await Promise.allSettled(promises);
      
//       const results = await Promise.allSettled(
//         responses.map(async (response, index) => {
//           if (response.status === 'fulfilled' && response.value.ok) {
//             return await response.value.json();
//           }
//           throw new Error(`Request ${index} failed`);
//         })
//       );

//       return results.map((result, index) => ({
//         success: result.status === 'fulfilled',
//         data: result.status === 'fulfilled' ? result.value : null,
//         error: result.status === 'rejected' ? result.reason.message : null,
//         request: requests[index],
//       }));
//     } catch (error) {
//       console.error('Batch fetch error:', error);
//       return requests.map(request => ({
//         success: false,
//         data: null,
//         error: error.message,
//         request,
//       }));
//     }
//   }
// }

// // Create and export a singleton instance
// export const cryptoService = new CryptoService();
export default cryptoService;