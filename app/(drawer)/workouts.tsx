import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Dumbbell, Flame, Menu, Search } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchWorkouts } from '../../src/store/slices/workoutSlice';

export default function WorkoutsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { workouts, loading, error } = useSelector((state: RootState) => state.workouts);

    useEffect(() => {
        dispatch(fetchWorkouts());
    }, [dispatch]);

    const renderWorkoutItem = ({ item }: any) => (
        <View className="bg-white p-4 mb-3 rounded-3xl border border-gray-100 shadow-sm flex-1 mx-1">
            <View className="bg-teal-50 w-10 h-10 rounded-2xl items-center justify-center mb-3">
                <Dumbbell size={20} color="#0d9488" />
            </View>
            <Text className="text-gray-900 font-bold mb-1" numberOfLines={1}>{item.workoutName}</Text>
            <Text className="text-gray-400 text-xs mb-3">{item.category} • {item.unit}</Text>

            <View className="flex-row items-center bg-orange-50 self-start px-2 py-1 rounded-lg">
                <Flame size={12} color="#f97316" />
                <Text className="text-orange-600 text-[10px] font-bold ml-1">
                    {item.caloriesPerMin || item.caloriesPerRep || 0} cal/{item.unit}
                </Text>
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
                        <Text className="text-2xl font-bold text-gray-900">Workout Library</Text>
                        <Text className="text-gray-500 text-sm">Browse workouts available for plans</Text>
                    </View>
                </View>

                <View className="flex-row gap-2 mb-6">
                    <View className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 flex-row items-center h-12 shadow-sm">
                        <Search size={18} color="#94a3b8" />
                        <TextInput
                            placeholder="Search workouts..."
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
                        data={workouts}
                        renderItem={renderWorkoutItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
