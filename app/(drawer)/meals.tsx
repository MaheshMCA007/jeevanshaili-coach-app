import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Flame, Menu, Search, Utensils } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchFoods } from '../../src/store/slices/foodSlice';

const PRIMARY_COLOR = "#E07A5F";

export default function MealsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { foods, loading, error } = useSelector((state: RootState) => state.foods);

    useEffect(() => {
        dispatch(fetchFoods());
    }, [dispatch]);

    const renderFoodItem = ({ item }: any) => (
        <View className="bg-white p-5 mb-4 rounded-[32px] border border-slate-50 shadow-sm">
            <View className="flex-row items-center">
                {item.foodImage ? (
                    <Image
                        source={{ uri: item.foodImage }}
                        className="w-16 h-16 rounded-2xl mr-4"
                    />
                ) : (
                    <View className="w-16 h-16 bg-slate-50 rounded-2xl mr-4 items-center justify-center border border-slate-100">
                        <Utensils size={24} color={PRIMARY_COLOR} />
                    </View>
                )}
                <View className="flex-1">
                    <Text className="text-slate-800 font-serif font-bold text-lg mb-1">{item.foodName}</Text>
                    <View className="flex-row items-center">
                        <View className="bg-orange-50 px-2 py-0.5 rounded-md flex-row items-center">
                            <Flame size={10} color="#f97316" />
                            <Text className="text-orange-600 text-[10px] font-bold ml-1">{Math.round(item.energyKcal)} kcal</Text>
                        </View>
                        <Text className="text-slate-400 text-xs ml-2 font-medium">•  {item.servingsUnit || 'portion'}</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row mt-5 pt-5 border-t border-slate-50 justify-between">
                <View className="items-center flex-1 border-r border-slate-50">
                    <Text className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-0.5">Protein</Text>
                    <Text className="text-slate-800 font-bold text-sm">{Math.round(item.protein)}g</Text>
                </View>
                <View className="items-center flex-1 border-r border-slate-50">
                    <Text className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-0.5">Carbs</Text>
                    <Text className="text-slate-800 font-bold text-sm">{Math.round(item.carbs)}g</Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-0.5">Fat</Text>
                    <Text className="text-slate-800 font-bold text-sm">{Math.round(item.fat)}g</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 py-6 flex-1">
                <View className="mb-8 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100 mr-4"
                    >
                        <Menu size={22} color="#1e293b" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">Nutrition</Text>
                        <Text className="text-3xl font-serif font-semibold text-slate-800">Food Library</Text>
                    </View>
                </View>

                <View className="flex-row items-center bg-white rounded-full px-6 py-3.5 border border-slate-100 shadow-sm mb-8">
                    <Search size={20} color="#94a3b8" className="mr-3" />
                    <TextInput
                        className="flex-1 text-slate-800 font-medium h-full"
                        placeholder="Search foods..."
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} className="mt-10" />
                ) : error ? (
                    <Text className="text-red-400 text-center mt-10 font-medium text-sm">{error}</Text>
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
