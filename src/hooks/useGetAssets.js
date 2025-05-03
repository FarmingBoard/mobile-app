import {useState, useEffect} from 'react';
import axios from 'axios';
import {apiUrl} from '../utils/ApiPath';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useGetAssets(assetType) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('token');   
                const response = await axios.get(`${apiUrl}/api/customer/assets?pageSize=10&page=0&type=${assetType}`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Authorization': `Bearer ${token}`,
                    },  
                });                
                setAssets(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, [refresh]);

    return {assets, loading, setRefresh};
};
