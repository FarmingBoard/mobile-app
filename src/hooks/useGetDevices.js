import { useState, useEffect } from 'react';
import { apiUrl } from '../utils/ApiPath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const useGetDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 10;

  const fetchDevices = async (pageNumber = 0, shouldRefresh = false) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(apiUrl + `/api/customer/devices?pageSize=${pageSize}&page=${pageNumber}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`,
        },
      });

      const newDevices = response.data.data;
      if (shouldRefresh) {
        setDevices(newDevices);
        setPage(0);
      } else {
        setDevices(prev => [...prev, ...newDevices]);
      }
      
      setHasMore(newDevices.length === pageSize);
      setError(null);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Không thể tải danh sách thiết bị');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetchDevices(0, true);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchDevices(page + 1);
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return { 
    devices, 
    loading, 
    refreshing, 
    error, 
    refresh, 
    loadMore, 
    hasMore, 
    loadingMore 
  };
};
