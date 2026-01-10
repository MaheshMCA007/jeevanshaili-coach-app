import { useRouter } from 'expo-router';
import { Lock, LogIn, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../src/store';
import { login } from '../src/store/slices/authSlice';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgId, setOrgId] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async () => {
        if (!email || !password || !orgId) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const resultAction = await dispatch(login({ email, password, orgId }));
        if (login.fulfilled.match(resultAction)) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Login Failed', (resultAction.payload as string) || 'Invalid credentials');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-12">
                <View className="items-center mb-10">
                    <View className="w-20 h-20 bg-teal-100 rounded-2xl items-center justify-center mb-4">
                        <Image
                            source={require('@/assets/images/icon.png')}
                            className="w-16 h-16"
                            resizeMode="contain"
                        />
                    </View>
                    <Text className="text-3xl font-bold text-gray-800">Coach Panel</Text>
                    <Text className="text-gray-500 mt-2">Welcome back! Please login to continue</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-sm font-semibold text-gray-700 mb-2 ml-1">Organization ID</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <TextInput
                                className="flex-1 text-gray-800"
                                placeholder="Enter Organization ID"
                                value={orgId}
                                onChangeText={setOrgId}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <Mail size={20} color="#64748b" className="mr-3" />
                            <TextInput
                                className="flex-1 text-gray-800"
                                placeholder="coach@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-semibold text-gray-700 mb-2 ml-1">Password</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <Lock size={20} color="#64748b" className="mr-3" />
                            <TextInput
                                className="flex-1 text-gray-800"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-teal-600 rounded-xl py-4 items-center shadow-lg shadow-teal-200 mt-6"
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View className="flex-row items-center">
                                <Text className="text-white font-bold text-lg mr-2">Sign In</Text>
                                <LogIn size={20} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-auto items-center py-6">
                    <Text className="text-gray-400 text-sm">© 2026 Jeevanshaili. All rights reserved.</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
