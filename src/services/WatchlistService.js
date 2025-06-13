import { baseUriApi,coinApi } from "../components/Common/ConstantLink";

// Helper to extract token from cookies
const getTokenFromCookie = () => {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    return match ? match[2] : null;
};

export class WatchlistService {
    async addToWatchlist(userId, coinId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${baseUriApi}/watchlist/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, coinId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add to watchlist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            throw error;
        }
    }

    async removeFromWatchlist(userId, coinId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${baseUriApi}/watchlist/remove/${userId}/${coinId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove from watchlist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            throw error;
        }
    }

    async getUserWatchlist(userId) {
        try {
            const token = getTokenFromCookie();

            if (!token) {
                throw new Error('No auth token found in cookies');
            }

            const response = await fetch(`${baseUriApi}/watchlist/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 403) {
                throw new Error('Access denied — invalid token or insufficient permissions');
            }

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Failed to fetch: ${response.status} ${errText || ''}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user watchlist:', error);
            throw error;
        }
    }

    async getUserWatchlistCoinIds(userId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${baseUriApi}/watchlist/user/${userId}/coins`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch watchlist coin IDs');
            }

            const data = await response.json();
            return data.coinIds || [];
        } catch (error) {
            console.error('Error fetching watchlist coin IDs:', error);
            throw error;
        }
    }

    async toggleWatchlist(userId, coinId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${baseUriApi}/watchlist/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, coinId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to toggle watchlist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error toggling watchlist:', error);
            throw error;
        }
    }

    async isInWatchlist(userId, coinId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${baseUriApi}/watchlist/check/${userId}/${coinId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.isInWatchlist;
        } catch (error) {
            console.error('Error checking watchlist status:', error);
            return false;
        }
    }

    async getWatchlistWithMarketData(userId) {
        try {
            // First get the user's watchlist coin IDs
            const coinIds = await this.getUserWatchlistCoinIds(userId);

            if (coinIds.length === 0) {
                return [];
            }

            // Fetch market data for these coins from CoinGecko
            const coinIdsString = coinIds.join(',');
            const marketResponse = await fetch(
                `${coinApi}/markets?vs_currency=usd&ids=${coinIdsString}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d`
            );

            if (!marketResponse.ok) {
                throw new Error('Failed to fetch market data');
            }

            const marketData = await marketResponse.json();
            return marketData;
        } catch (error) {
            console.error('Error fetching watchlist with market data:', error);
            throw error;
        }
    }

    async getWatchlistStats(userId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${baseUriApi}/watchlist/user/${userId}/stats`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch watchlist stats');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching watchlist stats:', error);
            throw error;
        }
    }

    async addMultipleToWatchlist(userId, coinIds) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${baseUriApi}/watchlist/bulk-add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, coinIds })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add coins to watchlist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding multiple coins to watchlist:', error);
            throw error;
        }
    }

    async clearWatchlist(userId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${baseUriApi}/watchlist/user/${userId}/clear`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to clear watchlist');
            }

            return await response.json();
        } catch (error) {
            console.error('Error clearing watchlist:', error);
            throw error;
        }
    }
}

export const watchlistService = new WatchlistService();