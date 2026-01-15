import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Flame, Menu, Search, Utensils } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchFoods } from '../../src/store/slices/foodSlice';

export default function MealsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { foods, loading, error } = useSelector((state: RootState) => state.foods);

    useEffect(() => {
        dispatch(fetchFoods());
    }, [dispatch]);

    const renderFoodItem = ({ item }: any) => (
        <View className="bg-white p-4 mb-4 rounded-3xl border border-gray-100 shadow-sm">
            <View className="flex-row items-center">
                {item.foodImage ? (
                    <Image
                        source={{ uri: item.foodImage }}
                        className="w-16 h-16 rounded-2xl mr-4"
                    />
                ) : (
                    <View className="w-16 h-16 bg-orange-100 rounded-2xl mr-4 items-center justify-center">
                        <Utensils size={24} color="#f97316" />
                    </View>
                )}
                <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base mb-1">{item.foodName}</Text>
                    <View className="flex-row items-center">
                        <Flame size={14} color="#f97316" />
                        <Text className="text-gray-500 text-xs ml-1">{Math.round(item.energyKcal)} kcal • {item.servingsUnit || 'portion'}</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row mt-4 pt-4 border-t border-gray-50 justify-between">
                <View className="items-center">
                    <Text className="text-gray-400 text-[10px] uppercase font-bold">Protein</Text>
                    <Text className="text-gray-900 font-bold">{Math.round(item.protein)}g</Text>
                </View>
                <View className="items-center">
                    <Text className="text-gray-400 text-[10px] uppercase font-bold">Carbs</Text>
                    <Text className="text-gray-900 font-bold">{Math.round(item.carbs)}g</Text>
                </View>
                <View className="items-center">
                    <Text className="text-gray-400 text-[10px] uppercase font-bold">Fat</Text>
                    <Text className="text-gray-900 font-bold">{Math.round(item.fat)}g</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 py-6 flex-1">
                <View className="mb-6 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm border border-gray-100 mr-4"
                    >
                        <Menu size={24} color="#0d4d44" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-2xl font-bold text-gray-900">Food Library</Text>
                        <Text className="text-gray-500 text-sm">Browse nutrition data for meals</Text>
                    </View>
                </View>

                <View className="flex-row gap-2 mb-6">
                    <View className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 flex-row items-center h-12 shadow-sm">
                        <Search size={18} color="#94a3b8" />
                        <TextInput
                            placeholder="Search foods..."
                            className="flex-1 ml-2 text-gray-800"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                    <TouchableOpacity className="bg-black px-6 rounded-2xl items-center justify-center">
                        <Text className="text-white font-bold">Search</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#0d9488" className="mt-10" />
                ) : error ? (
                    <Text className="text-red-500 text-center mt-10">{error}</Text>
                ) : (
                    <FlatList
                        data={foods}
                        renderItem={renderFoodItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
