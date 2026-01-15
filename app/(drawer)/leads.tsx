import { DrawerNavigationProp } from '@react-navigation/drawer';
import dayjs from 'dayjs';
import { useNavigation } from 'expo-router';
import { Filter, Menu, Plus, Search, UserPlus } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchLeads } from '../../src/store/slices/leadsSlice';

const StatusBadge = ({ status }: { status: string }) => {
    const getColors = () => {
        switch (status?.toLowerCase()) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'cold': return 'bg-slate-100 text-slate-700';
            case 'warm': return 'bg-orange-100 text-orange-700';
            case 'hot': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    return (
        <View className={`px-2 py-1 rounded-full ${getColors().split(' ')[0]}`}>
            <Text className={`text-[10px] font-bold uppercase ${getColors().split(' ')[1]}`}>
                {status}
            </Text>
        </View>
    );
};

export default function LeadsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { leads, loading, error } = useSelector((state: RootState) => state.leads);

    useEffect(() => {
        dispatch(fetchLeads());
    }, [dispatch]);

    const renderLeadItem = ({ item, index }: any) => (
        <View className="bg-white p-4 mb-2 rounded-2xl border border-gray-100 flex-row items-center">
            <View className="w-8">
                <Text className="text-gray-400 font-medium">{index + 1}</Text>
            </View>
            <View className="flex-1">
                <View className="flex-row justify-between items-start">
                    <View>
                        <Text className="text-gray-900 font-bold">{item.name || 'Unknown'}</Text>
                        <Text className="text-gray-500 text-xs">{item.email}</Text>
                    </View>
                    <StatusBadge status={item.leadStatus} />
                </View>
                <View className="flex-row mt-2 items-center justify-between">
                    <View className="flex-row items-center">
                        <Text className="text-gray-400 text-[10px] mr-2">
                            {dayjs(item.inquiryDate).format('MMM D, YYYY')}
                        </Text>
                        <View className="bg-teal-50 px-2 py-0.5 rounded">
                            <Text className="text-teal-600 text-[10px] uppercase font-bold">{item.source}</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-black px-3 py-1.5 rounded-lg">
                        <Text className="text-white text-[10px] font-bold">Convert to Client</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 py-6">
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm border border-gray-100 mr-4"
                        >
                            <Menu size={24} color="#0d4d44" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-2xl font-bold text-gray-900">Leads</Text>
                            <Text className="text-gray-500 text-sm">Track and convert prospects</Text>
                        </View>
                    </View>
                    <View className="flex-row gap-2">
                        <TouchableOpacity className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-200">
                            <Plus size={20} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-black px-4 py-2 rounded-xl flex-row items-center">
                            <UserPlus size={18} color="#fff" />
                            <Text className="text-white font-bold ml-2">Add Lead</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-row gap-2 mb-6">
                    <View className="flex-1 bg-white border border-gray-200 rounded-xl px-4 flex-row items-center h-12">
                        <Search size={18} color="#94a3b8" />
                        <TextInput
                            placeholder="Search leads..."
                            className="flex-1 ml-2 text-gray-800"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                    <TouchableOpacity className="w-12 h-12 bg-white border border-gray-200 rounded-xl items-center justify-center">
                        <Filter size={18} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#0d9488" className="mt-10" />
                ) : error ? (
                    <Text className="text-red-500 text-center mt-10">{error}</Text>
                ) : (
                    <FlatList
                        data={leads}
                        renderItem={renderLeadItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={
                            <View className="items-center justify-center mt-20">
                                <Text className="text-gray-400">No leads found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
