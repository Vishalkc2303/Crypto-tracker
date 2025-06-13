const API_BASE_URL = 'http://localhost:8080/api';

// Helper to extract token from cookies
// const getTokenFromCookie = () => {
//     const cookie = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('authToken='));
//          console.log(cookie);
//     return cookie ? cookie.split('=')[1] : null;
// };


const getTokenFromCookie = () => {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    return match ? match[2] : null;
};


export class FavoriteService {
    async addFavorite(favoriteData) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${API_BASE_URL}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(favoriteData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add favorite');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    }

    async removeFavorite(userId, coinId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${API_BASE_URL}/favorites/${userId}/${coinId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove favorite');
            }

            return { success: true };
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    }

    async getUserFavorites(userId) {

        try {
            const token = getTokenFromCookie();

            if (!token) {
                throw new Error('No auth token found in cookies');
            }

            const response = await fetch(`${API_BASE_URL}/favorites/user/${userId}`, {
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
            console.error('Error fetching user favorites:', error);
            throw error;
        }
    }


    async getUserFavoritesWithMarketData(userId) {
        try {
            const favorites = await this.getUserFavorites(userId);

            if (favorites.length === 0) {
                return [];
            }

            const coinIds = favorites.map(fav => fav.coinId).join(',');

            const marketResponse = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d`
            );

            if (!marketResponse.ok) {
                throw new Error('Failed to fetch market data');
            }

            const marketData = await marketResponse.json();

            const favoritesWithMarketData = favorites.map(favorite => {
                const marketInfo = marketData.find(coin => coin.id === favorite.coinId);
                return {
                    ...favorite,
                    marketData: marketInfo || null
                };
            });

            return favoritesWithMarketData;
        } catch (error) {
            console.error('Error fetching favorites with market data:', error);
            throw error;
        }
    }

    async isFavorite(userId, coinId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${API_BASE_URL}/favorites/${userId}/${coinId}/exists`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error('Error checking favorite status:', error);
            return false;
        }
    }

    async addMultipleFavorites(userId, coinIds) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${API_BASE_URL}/favorites/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId,
                    coinIds
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add favorites');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding multiple favorites:', error);
            throw error;
        }
    }

    async getFavoriteStats(userId) {
        try {
            const token = getTokenFromCookie();
            const response = await fetch(`${API_BASE_URL}/favorites/user/${userId}/stats`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch favorite stats');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching favorite stats:', error);
            throw error;
        }
    }
}

export const favoriteService = new FavoriteService();
