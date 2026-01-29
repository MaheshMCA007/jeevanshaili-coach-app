import { DrawerNavigationProp } from '@react-navigation/drawer';
import dayjs from 'dayjs';
import { useNavigation, useRouter } from 'expo-router';
import { Calendar, ExternalLink, Menu, Phone, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SectionList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchFollowups } from '../../src/store/slices/followupSlice';

const PRIMARY_COLOR = "#E07A5F";

const StatusBadge = ({ status }: { status: string }) => {
    const getColors = () => {
        switch (status?.toLowerCase()) {
            case 'cold': return 'bg-blue-50 text-blue-500';
            case 'warm': return 'bg-orange-50 text-orange-500';
            case 'hot': return 'bg-red-50 text-red-500';
            default: return 'bg-slate-50 text-slate-500';
        }
    };
    return (
        <View className={`px-2.5 py-1 rounded-full ${getColors().split(' ')[0]}`}>
            <Text className={`text-[9px] font-bold uppercase tracking-wider ${getColors().split(' ')[1]}`}>
                {status || 'WARM'}
            </Text>
        </View>
    );
};

export default function FollowupsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const router = useRouter();
    const { dueToday, dueNextWeek, loading } = useSelector((state: RootState) => state.followups);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

    useEffect(() => {
        dispatch(fetchFollowups(selectedDate));
    }, [dispatch, selectedDate]);

    const filterData = (data: any[]) => {
        return data.filter(item =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.phone?.includes(searchQuery)
        );
    };

    const sections = [
        {
            title: `Scheduled for ${dayjs(selectedDate).format('MMM D, YYYY')}`,
            data: filterData(dueToday),
            emptyMsg: `No follow-ups for ${dayjs(selectedDate).format('MMM D')}.`
        },
        {
            title: `Upcoming`,
            data: filterData(dueNextWeek),
            emptyMsg: 'No upcoming follow-ups.'
        },
    ];

    const renderItem = ({ item, index, section }: { item: any; index: number; section: any }) => (
        <View className="bg-white p-5 rounded-[28px] border border-slate-50 shadow-sm mb-3">
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-3 border border-slate-100">
                        <Text className="text-slate-400 font-serif font-bold text-sm">{index + 1}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-800 font-serif font-bold text-lg" numberOfLines={1}>{item.name || 'Unknown'}</Text>
                        <Text className="text-slate-400 text-xs font-medium tracking-wide" numberOfLines={1}>{item.email}</Text>
                    </View>
                </View>
                <View className="items-end">
                    <StatusBadge status={item.status} />
                </View>
            </View>

            <View className="flex-row items-center justify-between pt-4 border-t border-slate-50">
                <View className="flex-row items-center">
                    <Phone size={12} color="#94a3b8" />
                    <Text className="text-slate-500 text-xs font-medium ml-1.5">{item.phone || 'No phone'}</Text>
                </View>

                <View className="flex-1 items-center">
                    <Text className="text-slate-300 text-[9px] uppercase font-bold mb-0.5">Callback</Text>
                    <Text className="text-slate-600 text-[10px] font-bold">{item.callbackAt ? dayjs(item.callbackAt).format('h:mm A') : 'Anytime'}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/(drawer)/leads')}
                    className="bg-slate-800 px-4 py-2 rounded-xl flex-row items-center"
                >
                    <Text className="text-white text-[10px] font-bold uppercase tracking-wider mr-1">Details</Text>
                    <ExternalLink size={10} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 flex-1 pt-6">
                {/* Header Section */}
                <View className="flex-row items-center mb-8">
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100 mr-4"
                    >
                        <Menu size={22} color="#1e293b" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-slate-400 text-[10px] font-bold tracking-[2px] uppercase">Pipeline</Text>
                        <Text className="text-3xl font-serif font-semibold text-slate-800">Follow-ups</Text>
                    </View>
                </View>

                {/* Filters */}
                <View className="bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm mb-6 flex-row items-center">
                    <TouchableOpacity
                        className="flex-row items-center bg-slate-50 px-4 py-3 rounded-2xl mr-2"
                        activeOpacity={0.7}
                    >
                        <Calendar size={16} color="#64748b" className="mr-2" />
                        <Text className="text-slate-600 text-xs font-bold">{dayjs(selectedDate).format('DD MMM')}</Text>
                    </TouchableOpacity>

                    <View className="flex-1 flex-row items-center bg-transparent px-3">
                        <Search size={18} color="#94a3b8" className="mr-2" />
                        <TextInput
                            className="flex-1 text-slate-800 font-medium h-full"
                            placeholder="Filter..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={16} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {loading && !dueToday.length && !dueNextWeek.length ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                ) : (
                    <SectionList
                        sections={sections}
                        keyExtractor={(item, index) => item.leadId || index.toString()}
                        renderItem={renderItem}
                        renderSectionHeader={({ section: { title } }) => (
                            <View className="py-2 bg-slate-50 mb-2 mt-2">
                                <Text className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">{title}</Text>
                            </View>
                        )}
                        renderSectionFooter={({ section }) => (
                            section.data.length === 0 ? (
                                <View className="bg-white p-6 rounded-[24px] border border-dashed border-slate-200 items-center justify-center mb-6">
                                    <Text className="text-slate-300 text-xs font-medium">{section.emptyMsg}</Text>
                                </View>
                            ) : null
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        stickySectionHeadersEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
