import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useRouter } from 'expo-router';
import { ChevronRight, Menu, Plus, Search, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchClients, setSelectedClientId } from '../../src/store/slices/clientSlice';

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
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-3 flex-row items-center"
            onPress={() => {
                dispatch(setSelectedClientId(item._id));
                router.push(`/client/${item._id}`);
            }}
        >
            <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center mr-4">
                {item.profileImage ? (
                    <Image source={{ uri: item.profileImage }} className="w-12 h-12 rounded-full" />
                ) : (
                    <User size={24} color="#0d9488" />
                )}
            </View>
            <View className="flex-1">
                <Text className="text-gray-800 font-bold text-base">
                    {item.firstName} {item.lastName}
                </Text>
                <Text className="text-gray-500 text-xs">{item.email}</Text>
            </View>
            <View className="items-end mr-3">
                <View className={`px-2 py-1 rounded-full ${item.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Text className={`text-[10px] font-bold ${item.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                        {item.status?.toUpperCase() || 'STANDARD'}
                    </Text>
                </View>
                <Text className="text-gray-400 text-[10px] mt-1">{item.plan || 'No Plan'}</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 py-6 font-sans">
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm border border-gray-100 mr-4"
                        >
                            <Menu size={24} color="#0d4d44" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-gray-500 text-sm font-medium">Management</Text>
                            <Text className="text-2xl font-bold text-gray-800">Your Clients</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-teal-600 w-10 h-10 rounded-full items-center justify-center shadow-md shadow-teal-200">
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-200 mb-6">
                    <Search size={20} color="#64748b" className="mr-2" />
                    <TextInput
                        className="flex-1 text-gray-800"
                        placeholder="Search clients by name or email..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {loading && clients.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <ActivityIndicator size="large" color="#0d9488" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredClients}
                        keyExtractor={(item) => item._id}
                        renderItem={renderClientItem}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20">
                                <Text className="text-gray-400 font-medium">No clients found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
