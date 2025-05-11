import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../utils/ApiPath';
import { useAuthenticated } from '../contexts/AuthenticatedContext';
import { ActivityIndicator } from 'react-native';
import { set } from 'date-fns';
import { getFCMToken } from '../services/firebaseService';

export default function LoginRegister() {
    const { login } = useAuthenticated();
    const [view, setView] = useState('main');
    const [country, setCountry] = useState('Vietnam');
    const [agreed, setAgreed] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    /*
    {
        "email": "a@gmail.com",
        "password": "123456",
        "firstName": "Hoang",
        "lastName": "Nguyen",
        "phoneNumber": "0878888",
        "address": "ha noi",
        "fmcToken": "sàhksckdshjghj"
    }
    */
    const [phoneNumber, setPhoneNumber] = useState(''); 
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [fmcToken, setFmcToken] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('Vui lòng nhập thông tin');

    const handleBack = () => setView('main');
    const handleAuth = async () => {
        setLoading(true);
        console.log('API: ', apiUrl);
        if (view === 'login') {
            console.log('Login:', 'Username:', username, 'Password:', password);
            fetch(apiUrl + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim()
                })
            })
                .then(res => {
                        return res.json();
                })
                .then(async data => {
                    console.log(data);
                    setLoading(false);
                    if (data.token) {
                        await AsyncStorage.setItem('token', data.token);
                        await AsyncStorage.setItem('refreshToken', data.refreshToken);
                        login(data.token);
                    } else {
                        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
                    }
                })
                .catch(err => {
                    setLoading(false);
                    setError('Đã xảy ra lỗi, vui lòng thử lại.' + err);
                    console.log(err);
                });
        } else {
            console.log('Register:', 'Username:', username, 'Password:', password);
            const fmcToken = await getFCMToken();
            fetch(apiUrl + '/api/noauth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim(),
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    phoneNumber: phoneNumber.trim(),
                    address: address.trim(),
                    email: email.trim(),
                    fmcToken: fmcToken,
                })
            })
                .then(res => {
                        return res.json();
                })
                .then(async data => {
                    console.log(data);
                    setLoading(false);  
                    if (data.token) {
                        await AsyncStorage.setItem('token', data.token);
                        await AsyncStorage.setItem('refreshToken', data.refreshToken);
                        login(data.token);
                    } else {
                        setError('Đăng ký không thành công.');
                    }
                })
                .catch(err => {
                    setLoading(false);
                    setError('Đã xảy ra lỗi, vui lòng thử lại.' + err);
                    console.log(err);
                });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {view === 'main' && (
                <View style={styles.mainView}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/logo.jpg')}
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => setView('login')}
                            style={styles.loginButton}
                        >
                            <Text style={styles.loginButtonText}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setView('register')}
                            style={styles.registerButton}
                        >
                            <Text style={styles.registerButtonText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {(view === 'login' || view === 'register') && (
                <View style={styles.authView}>
                    <TouchableOpacity className='text-black' onPress={handleBack} style={styles.backButton}>
                        <Text className='text-black'>Quay lại</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{view === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
                    <View style={styles.inputContainer}>
                        {view === 'login' ? (
                            <>
                                <Text className='text-center text-gray-800'>{error}</Text>
                                <TextInput
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Vui lòng nhập tài khoản"
                                    style={styles.input}
                                    placeholderTextColor='gray'
                                    borderColor='#d1d5db'
                                    borderWidth={1}
                                />
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Mật khẩu"
                                    secureTextEntry
                                    style={styles.input}
                                    placeholderTextColor='gray'
                                    borderColor='#d1d5db'
                                    borderWidth={1}
                                />
                            </>
                        ) : (
                            <>
                                <TextInput
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="Họ"
                                    style={styles.input}
                                />
                                <TextInput
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Tên"
                                    style={styles.input}
                                />
                                <TextInput
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    placeholder="Số điện thoại"
                                    style={styles.input}
                                />
                                <TextInput
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholder="Địa chỉ"
                                    style={styles.input}
                                />
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Số điện thoại/Email"
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                />
                            </>
                        )}
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                onPress={() => setAgreed(!agreed)}
                                style={styles.checkbox}
                            >
                                {agreed && <View style={styles.checkboxInner} />}
                            </TouchableOpacity>
                            <Text style={styles.checkboxLabel}>
                                Tôi đồng ý{' '}
                                <Text style={styles.link}>Chính sách bảo mật</Text> Và{' '}
                                <Text style={styles.link}>Đồng ý dịch vụ</Text>
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.authButton, !agreed && styles.authButtonDisabled]}
                            disabled={!agreed}
                            onPress={handleAuth}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.authButtonText}>{
                                    view === 'login' ? 'Đăng nhập' : 'Đăng ký'
                                }</Text>
                            )}
                        </TouchableOpacity>
                        {view === 'login' && (
                            <TouchableOpacity>
                                <Text style={styles.forgotPassword}>Quên mật khẩu</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
        color: 'black',
    },
    mainView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 32,
    },
    logoContainer: {
        width: 176,
        height: 176,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 48,
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 88,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 48,
    },
    loginButton: {
        width: '100%',
        padding: 12,
        backgroundColor: '#10b981',
        borderRadius: 8,
        marginBottom: 16,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    registerButton: {
        width: '100%',
        padding: 12,
        backgroundColor: 'white',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 8,
    },
    registerButtonText: {
        color: '#10b981',
        fontWeight: '600',
        textAlign: 'center',
    },
    authView: {
        flex: 1,
        padding: 24,
        backgroundColor: 'white',
    },
    backButton: {
        alignSelf: 'flex-start',
        color: 'black',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: 'black',
    },
    inputContainer: {
        gap: 16,
    },
    input: {
        width: '100%',
        padding: 12,
        backgroundColor: '#f3f4f6',
        color: 'black',
        borderRadius: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: '#10b981',
        borderRadius: 2,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#4b5563',
    },
    link: {
        color: '#3b82f6',
    },
    authButton: {
        width: '100%',
        padding: 12,
        backgroundColor: '#10b981',
        borderRadius: 8,
    },
    authButtonDisabled: {
        backgroundColor: '#d1d5db',
    },
    authButtonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    forgotPassword: {
        color: '#3b82f6',
        textAlign: 'center',
    },
});