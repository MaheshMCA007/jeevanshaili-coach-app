import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Check, Menu } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchPricingPlans } from '../../src/store/slices/pricingSlice';

const PRIMARY_COLOR = "#E07A5F";

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
            className={`bg-white p-7 rounded-[40px] border mb-6 shadow-sm overflow-hidden relative ${item.isDefault ? 'border-[#E07A5F] border-2 shadow-orange-100' : 'border-slate-50'}`}
        >
            {item.isDefault && (
                <View className="bg-[#E07A5F] absolute top-0 right-0 px-6 py-2 rounded-bl-3xl">
                    <Text className="text-white text-[10px] font-black uppercase tracking-wider">Most Popular</Text>
                </View>
            )}

            <View className="mb-6">
                <Text className="text-slate-800 text-2xl font-serif font-bold mb-1">{item.name}</Text>
                <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{item.tier}</Text>
            </View>

            <View className="flex-row items-baseline mb-6">
                <Text className="text-slate-900 text-5xl font-serif font-semibold">{item.currency} {item.price}</Text>
                <Text className="text-slate-400 ml-2 font-bold text-xs uppercase tracking-wider">/ lifetime</Text>
            </View>

            <Text className="text-slate-500 mb-8 font-medium leading-6 text-sm">{item.description}</Text>

            <View className="space-y-4 mb-8 bg-slate-50 p-5 rounded-3xl">
                {item.features?.map((feature: string, idx: number) => (
                    <View key={idx} className="flex-row items-start mb-1">
                        <View className="bg-white rounded-full p-1 mr-3 mt-0.5 border border-slate-100">
                            <Check size={10} color={PRIMARY_COLOR} strokeWidth={4} />
                        </View>
                        <Text className="text-slate-600 font-semibold text-sm flex-1">{feature}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                className={`w-full py-4 rounded-2xl items-center shadow-lg active:opacity-90 ${item.isDefault ? 'bg-[#E07A5F] shadow-orange-200' : 'bg-slate-800 shadow-slate-200'}`}
            >
                <Text className="text-white font-bold text-base tracking-wide">Select Plan</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
                <View className="mb-8 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100 mr-4"
                    >
                        <Menu size={22} color="#1e293b" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">Subscriptions</Text>
                        <Text className="text-3xl font-serif font-semibold text-slate-800">Pricing Plans</Text>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} className="mt-10" />
                ) : error ? (
                    <Text className="text-red-400 text-center mt-10 font-bold">{error}</Text>
                ) : (
                    plans.map(renderPlan)
                )}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
