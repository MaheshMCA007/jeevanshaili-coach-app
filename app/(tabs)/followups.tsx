import dayjs from 'dayjs';
import { Calendar, Clock, MessageSquare, Phone, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchFollowups } from '../../src/store/slices/followupSlice';

export default function FollowupsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { dueToday, dueNextWeek, loading } = useSelector((state: RootState) => state.followups);

    useEffect(() => {
        const today = dayjs().format('YYYY-MM-DD');
        dispatch(fetchFollowups(today));
    }, [dispatch]);

    const sections = [
        { title: 'Due Today', data: dueToday },
        { title: 'Upcoming (7 Days)', data: dueNextWeek },
    ];

    const renderItem = ({ item }: { item: any }) => (
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                    <User size={20} color="#c2410c" />
                </View>
                <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base">{item.clientName || 'Mahesh Sharma'}</Text>
                    <View className="flex-row items-center">
                        <Clock size={12} color="#64748b" className="mr-1" />
                        <Text className="text-gray-500 text-xs">{dayjs(item.dueDate).format('MMM DD, hh:mm A')}</Text>
                    </View>
                </View>
                <View className="px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
                    <Text className="text-teal-600 text-[10px] font-bold">TASK</Text>
                </View>
            </View>

            <Text className="text-gray-600 text-sm mb-4 leading-5">
                {item.reason || 'Regular weekly check-in for diet and workout progress review.'}
            </Text>

            <View className="flex-row space-x-3">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-teal-600 py-3 rounded-xl">
                    <Phone size={16} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-xs">Call</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white border border-teal-600 py-3 rounded-xl">
                    <MessageSquare size={16} color="#0d9488" className="mr-2" />
                    <Text className="text-teal-600 font-bold text-xs">Message</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 py-6 flex-1">
                <View className="mb-6">
                    <Text className="text-gray-500 text-sm font-medium">Follow-ups</Text>
                    <Text className="text-2xl font-bold text-gray-800">Pending Actions</Text>
                </View>

                {loading && dueToday.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#0d9488" />
                    </View>
                ) : (
                    <SectionList
                        sections={sections}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        renderItem={renderItem}
                        renderSectionHeader={({ section: { title } }) => (
                            <View className="py-2 bg-slate-50 mb-2">
                                <Text className="text-gray-400 font-bold text-xs tracking-widest uppercase">{title}</Text>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        stickySectionHeadersEnabled={false}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20">
                                <Calendar size={48} color="#cbd5e1" className="mb-4" />
                                <Text className="text-gray-400 font-medium text-center px-10">
                                    Clean slate! No pending follow-ups for now.
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
