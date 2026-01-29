import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Dumbbell, Flame, Menu, Search } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchWorkouts } from '../../src/store/slices/workoutSlice';

const PRIMARY_COLOR = "#E07A5F";

export default function WorkoutsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { workouts, loading, error } = useSelector((state: RootState) => state.workouts);

    useEffect(() => {
        dispatch(fetchWorkouts());
    }, [dispatch]);

    const renderWorkoutItem = ({ item }: any) => (
        <View className="bg-white p-5 mb-4 rounded-[32px] border border-slate-50 shadow-sm flex-1 mx-1.5 aspect-square justify-between">
            <View>
                <View className="bg-slate-50 w-12 h-12 rounded-full items-center justify-center mb-4 border border-slate-100">
                    <Dumbbell size={20} color={PRIMARY_COLOR} />
                </View>
                <Text className="text-slate-800 font-serif font-bold text-base leading-5 mb-1" numberOfLines={2}>{item.workoutName}</Text>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{item.category}</Text>
            </View>

            <View className="flex-row items-center bg-orange-50 self-start px-3 py-1.5 rounded-full mt-2">
                <Flame size={12} color="#f97316" />
                <Text className="text-orange-600 text-[9px] font-bold ml-1">
                    {item.caloriesPerMin || item.caloriesPerRep || 0} cal
                </Text>
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
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">Resources</Text>
                        <Text className="text-3xl font-serif font-semibold text-slate-800">Workouts</Text>
                    </View>
                </View>

                <View className="flex-row items-center bg-white rounded-full px-6 py-3.5 border border-slate-100 shadow-sm mb-8">
                    <Search size={20} color="#94a3b8" className="mr-3" />
                    <TextInput
                        className="flex-1 text-slate-800 font-medium h-full"
                        placeholder="Search workouts..."
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} className="mt-10" />
                ) : error ? (
                    <Text className="text-red-400 text-center mt-10 font-medium text-sm">{error}</Text>
                ) : (
                    <FlatList
                        data={workouts}
                        renderItem={renderWorkoutItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 4 }}
                        columnWrapperStyle={{ justifyContent: 'space-between', marginLeft: -6, marginRight: -6 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
