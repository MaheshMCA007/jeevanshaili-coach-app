import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useRouter } from 'expo-router';
import { ChevronRight, Menu, Plus, Search, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchClients, setSelectedClientId } from '../../src/store/slices/clientSlice';

const PRIMARY_COLOR = "#E07A5F";

export default function ClientsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { clients, loading } = useSelector((state: RootState) => state.clients);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    const filteredClients = clients.filter(client => {
        const fullName = `${client.firstName || ""} ${client.lastName || ""}`.toLowerCase();
        return (
            fullName.includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const renderClientItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-50 mb-3 flex-row items-center"
            onPress={() => {
                dispatch(setSelectedClientId(item._id));
                router.push(`/client/${item._id}`);
            }}
        >
            <View className="w-14 h-14 bg-slate-50 rounded-full items-center justify-center mr-4 border border-slate-100">
                {item.profileImage ? (
                    <Image source={{ uri: item.profileImage }} className="w-14 h-14 rounded-full" />
                ) : (
                    <Text className="text-slate-400 font-serif font-bold text-lg">
                        {(item.firstName?.[0] || item.name?.[0] || '').toUpperCase()}
                    </Text>
                )}
            </View>
            <View className="flex-1">
                <Text className="text-slate-800 font-bold text-lg font-serif">
                    {item.firstName} {item.lastName}
                </Text>
                <Text className="text-slate-400 text-xs font-medium tracking-wide">{item.email}</Text>
                <View className="flex-row items-center mt-2">
                    <View className={`px-2.5 py-1 rounded-full ${item.status === 'active' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                        <Text className={`text-[9px] font-bold uppercase tracking-wider ${item.status === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {item.status?.toUpperCase() || 'STANDARD'}
                        </Text>
                    </View>
                    {item.plan && (
                        <Text className="text-slate-300 text-[10px] font-bold uppercase ml-2">• {item.plan}</Text>
                    )}
                </View>
            </View>
            <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
                <ChevronRight size={16} color="#94a3b8" />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 py-6 font-sans flex-1">
                {/* Premium Header */}
                <View className="flex-row justify-between items-center mb-8">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100 mr-4"
                        >
                            <Menu size={22} color="#1e293b" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">Management</Text>
                            <Text className="text-3xl font-serif font-semibold text-slate-800">Your Clients</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="w-12 h-12 bg-[#E07A5F] rounded-full items-center justify-center shadow-lg shadow-orange-200">
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="flex-row items-center bg-white rounded-full px-6 py-3.5 border border-slate-100 shadow-sm mb-8">
                    <Search size={20} color="#94a3b8" className="mr-3" />
                    <TextInput
                        className="flex-1 text-slate-800 font-medium h-full"
                        placeholder="Search clients..."
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {loading && clients.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredClients}
                        keyExtractor={(item) => item._id}
                        renderItem={renderClientItem}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200 p-8">
                                <User size={48} color="#cbd5e1" />
                                <Text className="text-slate-400 font-medium mt-4">No clients found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
