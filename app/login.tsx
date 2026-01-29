import { useRouter } from 'expo-router';
import { Lock, LogIn, Mail } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../src/store';
import { login } from '../src/store/slices/authSlice';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgId, setOrgId] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const logoScale = React.useRef(new Animated.Value(1)).current;

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
                Animated.timing(logoScale, {
                    toValue: 0.6,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const handleLogin = async () => {
        if (!email || !password || !orgId) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        console.log("OrgID-", orgId, "email-", email, "password-", password)
        const resultAction = await dispatch(login({ email, password, orgId }));
        if (login.fulfilled.match(resultAction)) {
            router.replace('/(drawer)' as any);
        } else {
            Alert.alert('Login Failed', (resultAction.payload as string) || 'Invalid credentials');
        }
    };

    const scrollViewRef = React.useRef<ScrollView>(null);

    const scrollToInput = (y: number) => {
        scrollViewRef.current?.scrollTo({ y, animated: true });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-white"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: isKeyboardVisible ? 100 : 0
                }}
                className="px-6"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className={`items-center ${isKeyboardVisible ? 'mt-6 mb-2' : 'mt-12 mb-10'} bg-white`}>
                    <Animated.View
                        style={{ transform: [{ scale: logoScale }] }}
                        className={`${isKeyboardVisible ? 'w-24 h-24' : 'w-40 h-40'} bg-gray-100 rounded-full items-center justify-center mb-4 overflow-hidden`}
                    >
                        <Image
                            source={require('@/assets/images/icon.png')}
                            className={`${isKeyboardVisible ? 'w-20 h-20' : 'w-36 h-36'} rounded-full`}
                            resizeMode="contain"
                        />
                    </Animated.View>
                    <Text className={`${isKeyboardVisible ? 'text-lg' : 'text-3xl'} font-bold text-gray-800 transition-all text-center`}>Coach Panel</Text>
                    {!isKeyboardVisible && (
                        <Text className="text-gray-500 mt-2 text-center">Welcome back! Please login to continue</Text>
                    )}
                </View>

                <View className="space-y-4">
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-2 ml-1">Organization ID</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <TextInput
                                className="flex-1 text-gray-800"
                                placeholder="Enter Organization ID"
                                value={orgId}
                                onChangeText={setOrgId}
                                autoCapitalize="none"
                                onFocus={() => isKeyboardVisible && scrollToInput(0)}
                            />
                        </View>
                    </View>

                    <View className="mb-4">
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
                                onFocus={() => isKeyboardVisible && scrollToInput(100)}
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm font-semibold text-gray-700 mb-2 ml-1">Password</Text>
                        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <Lock size={20} color="#64748b" className="mr-3" />
                            <TextInput
                                className="flex-1 text-gray-800"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                onFocus={() => isKeyboardVisible && scrollToInput(250)}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-teal-600 rounded-xl py-4 items-center shadow-lg shadow-teal-200 mt-2"
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

                {!isKeyboardVisible && (
                    <View className="mt-auto items-center pb-6">
                        <Text className="text-gray-400 text-sm">© 2026 Jeevanshaili. All rights reserved.</Text>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
