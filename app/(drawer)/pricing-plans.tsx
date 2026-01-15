import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Check, Menu, Tag } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchPricingPlans } from '../../src/store/slices/pricingSlice';

export default function PricingPlansScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { plans, loading, error } = useSelector((state: RootState) => state.pricing);

    useEffect(() => {
        dispatch(fetchPricingPlans());
    }, [dispatch]);

    const renderPlan = (item: any) => (
        <View
            key={item._id}
            className={`bg-white p-6 rounded-[32px] border mb-6 shadow-sm ${item.isDefault ? 'border-teal-500 bg-teal-50/20' : 'border-gray-100'}`}
        >
            {item.isDefault && (
                <View className="bg-teal-500 self-start px-3 py-1 rounded-full mb-4">
                    <Text className="text-white text-[10px] font-extrabold uppercase tracking-wider">Default Plan</Text>
                </View>
            )}
            <View className="flex-row items-center justify-between mb-4">
                <View>
                    <Text className="text-gray-900 text-2xl font-black">{item.name}</Text>
                    <Text className="text-gray-500 font-medium">{item.tier.toUpperCase()}</Text>
                </View>
                <View className="bg-gray-50 p-3 rounded-2xl">
                    <Tag size={24} color="#0d9488" />
                </View>
            </View>

            <View className="flex-row items-baseline mb-6">
                <Text className="text-gray-900 text-4xl font-black">{item.currency} {item.price}</Text>
                <Text className="text-gray-500 ml-2 font-bold">/ lifetime</Text>
            </View>

            <Text className="text-gray-600 mb-6 font-medium leading-5">{item.description}</Text>

            <View className="space-y-3 mb-8">
                {item.features?.map((feature: string, idx: number) => (
                    <View key={idx} className="flex-row items-center mb-2">
                        <View className="bg-teal-100 rounded-full p-1 mr-3">
                            <Check size={12} color="#0d9488" strokeWidth={4} />
                        </View>
                        <Text className="text-gray-700 font-medium">{feature}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                className={`w-full py-4 rounded-2xl items-center ${item.isDefault ? 'bg-teal-600' : 'bg-black'}`}
            >
                <Text className="text-white font-black text-base">Select Plan</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
                <View className="mb-10 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm border border-gray-100 mr-4"
                    >
                        <Menu size={24} color="#0d4d44" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-2xl font-black text-gray-900">Pricing Plans</Text>
                        <Text className="text-gray-500 text-sm font-medium">Choose from our available plans</Text>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#0d9488" className="mt-10" />
                ) : error ? (
                    <Text className="text-red-500 text-center mt-10 font-bold">{error}</Text>
                ) : (
                    plans.map(renderPlan)
                )}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
