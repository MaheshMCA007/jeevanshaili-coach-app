import { useNavigation, useRouter } from 'expo-router';
import {
    Activity,
    Bell,
    Droplets,
    LayoutGrid,
    Menu,
    Moon,
    Plus,
    Users
} from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchClients } from '../../src/store/slices/clientSlice';
import { fetchDashboardData } from '../../src/store/slices/dashboardSlice';

const screenWidth = Dimensions.get('window').width;

const PRIMARY_COLOR = "#E07A5F";

const MetricGridCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
    <View className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex-1 m-1 justify-between aspect-square">
        <View className="flex-row justify-between items-start">
            <View className={`p-2.5 rounded-2xl ${color === 'orange' ? 'bg-orange-50' : 'bg-indigo-50'}`}>
                <Icon size={20} color={color === 'orange' ? PRIMARY_COLOR : '#6366f1'} />
            </View>
            {trend && (
                <View className="flex-row items-center">
                    <Activity size={10} color="#10b981" />
                    <Text className="text-[#10b981] text-[10px] font-bold ml-0.5">{trend}%</Text>
                </View>
            )}
            {!trend && unit && (
                <Text className="text-slate-400 text-[10px] font-bold uppercase">{unit}</Text>
            )}
        </View>
        <View>
            <Text className="text-2xl font-black text-slate-800 tracking-tighter">{value}</Text>
            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">{title}</Text>
        </View>
    </View>
);

export default function DashboardScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const router = useRouter();
    const { summary, steps, calories, weight, loading } = useSelector((state: RootState) => state.dashboard);
    const { clients } = useSelector((state: RootState) => state.clients);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(fetchDashboardData());
        dispatch(fetchClients());
    }, [dispatch]);

    const onRefresh = () => {
        dispatch(fetchDashboardData());
        dispatch(fetchClients());
    };

    const trendChartConfig = (color: string) => ({
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => color.replace('opacity', opacity.toString()),
        strokeWidth: 2,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#fff"
        },
        propsForBackgroundLines: {
            strokeDasharray: "4",
            stroke: "rgba(226, 232, 240, 0.5)"
        },
        fillShadowGradientFrom: color.replace('opacity', '0.2'),
        fillShadowGradientTo: color.replace('opacity', '0'),
        fillShadowGradientOpacity: 0.1,
        propsForLabels: {
            fontSize: 10,
            fontWeight: "bold",
        }
    });

    if (loading && !summary) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
        );
    }

    const activeClientsList = Array.isArray(clients) ? clients.slice(0, 2) : [];

    const TrendCard = ({ title, data, color, labels, ySuffix = "" }: any) => (
        <View style={{ width: screenWidth - 32 }} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 mr-4">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-base font-bold text-slate-800 tracking-tight">{title}</Text>
                <View className="flex-row bg-slate-100 p-1 rounded-xl">
                    <View className="bg-black px-4 py-1.5 rounded-lg shadow-sm">
                        <Text className="text-[10px] font-bold text-white uppercase tracking-tighter">Line</Text>
                    </View>
                    {/* <View className="px-4 py-1.5">
                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Bar</Text>
                    </View> */}
                </View>
            </View>
            <LineChart
                data={{
                    labels: labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [{ data: data || [0, 0, 0, 0, 0, 0, 0] }]
                }}
                width={screenWidth - 80}
                height={180}
                chartConfig={trendChartConfig(color)}
                bezier
                style={{ marginLeft: -16, borderRadius: 16, paddingRight: 0 }}
                withDots={true}
                withInnerLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                withOuterLines={false}
                yAxisSuffix={ySuffix}
            />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="flex-1">
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                    }
                >
                    {/* Premium Header */}
                    <View className="flex-row justify-between items-center px-6 py-6 font-sans">
                        <TouchableOpacity
                            onPress={() => (navigation as any)?.openDrawer()}
                            className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100"
                        >
                            <Menu size={22} color="#1e293b" />
                        </TouchableOpacity>
                        <View className="flex-row items-center space-x-3">
                            <TouchableOpacity className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 relative">
                                <Bell size={22} color="#1e293b" />
                                <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E07A5F] rounded-full border border-white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/(drawer)/settings')}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }}
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Welcome Section */}
                    <View className="px-6 mb-8">
                        <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-[2px] mb-1">Coach Dashboard</Text>
                        <Text className="text-[32px] font-serif font-semibold text-slate-800 leading-tight">
                            Welcome back,{"\n"}
                            <Text className="text-[#E07A5F]">{user?.name?.split(' ')[0] || 'NA'}</Text>
                        </Text>
                    </View>

                    {/* Chart Carousel */}
                    <ScrollView
                        horizontal
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={screenWidth - 16}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        className="mb-8"
                    >
                        <TrendCard
                            title="Weekly Steps"
                            color="rgba(224, 122, 95, opacity)"
                            data={steps.length > 0 ? steps.slice(-7).map(s => Number(s.value || 0)) : [5000, 7000, 4500, 8000, 6000, 9000, 7500]}
                            labels={steps.length > 0 ? steps.slice(-7).map(s => {
                                const d = new Date(s._id);
                                return isNaN(d.getTime()) ? "" : `${d.getMonth() + 1}/${d.getDate()}`;
                            }) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                        />
                        <TrendCard
                            title="Weekly Calories"
                            color="rgba(249, 115, 22, opacity)"
                            data={calories.length > 0 ? calories.slice(-7).map(c => Number(c.value || 0)) : [1800, 2100, 1900, 2200, 2000, 2400, 2100]}
                            labels={calories.length > 0 ? calories.slice(-7).map(c => {
                                const d = new Date(c._id);
                                return isNaN(d.getTime()) ? "" : `${d.getMonth() + 1}/${d.getDate()}`;
                            }) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                            ySuffix="k"
                        />
                        <TrendCard
                            title="Weight Trend"
                            color="rgba(59, 130, 246, opacity)"
                            data={weight.length > 0 ? weight.slice(-7).map(w => Number(w.value || 0)) : [72, 71.8, 72.1, 71.5, 71.2, 71.0, 70.8]}
                            labels={weight.length > 0 ? weight.slice(-7).map(w => {
                                const d = new Date(w._id);
                                return isNaN(d.getTime()) ? "" : `${d.getMonth() + 1}/${d.getDate()}`;
                            }) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                            ySuffix="kg"
                        />
                    </ScrollView>

                    {/* KPI Cards Grid */}
                    <View className="px-5 flex-row mb-4">
                        <MetricGridCard
                            title="Steps"
                            value={summary?.totals?.steps ? `${(summary.totals.steps / 1000).toFixed(0)}k` : '38k'}
                            trend="12"
                            icon={Activity}
                            color="orange"
                        />
                        <MetricGridCard
                            title="Sleep Avg"
                            value={summary?.totals?.sleepHours || '10.1'}
                            unit="Hrs"
                            icon={Moon}
                            color="indigo"
                        />
                    </View>

                    {/* Water Intake Card */}
                    <View className="px-6 mb-8">
                        <View className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 rounded-[20px] bg-blue-50 items-center justify-center mr-4">
                                    <Droplets size={22} color="#3b82f6" />
                                </View>
                                <View>
                                    <Text className="text-lg font-serif font-bold text-slate-800">Water Intake</Text>
                                    <Text className="text-slate-400 text-[10px] font-medium">Weekly Total</Text>
                                </View>
                            </View>
                            <View className="flex-row items-baseline">
                                <Text className="text-2xl font-black text-slate-800">{summary?.totals?.waterIntake || '30'}</Text>
                                <Text className="text-slate-400 text-xs font-bold ml-1">L</Text>
                            </View>
                        </View>
                    </View>

                    {/* Active Clients Section */}
                    <View className="px-6 mb-32">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-serif font-bold text-slate-800">Active Clients</Text>
                            <TouchableOpacity onPress={() => router.push('/(drawer)/clients')}>
                                <Text className="text-[#E07A5F] text-[11px] font-bold uppercase tracking-wider">See All</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="space-y-3">
                            {activeClientsList.length > 0 ? activeClientsList.map((client: any, i: number) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => router.push(`/client/${client._id}`)}
                                    className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-50 flex-row items-center justify-between"
                                >
                                    <View className="flex-row items-center">
                                        <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center mr-3">
                                            <Text className="text-slate-400 font-serif font-bold text-sm">
                                                {(client.firstName?.[0] || client.name?.[0] || '').toUpperCase()}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className="text-sm font-bold text-slate-800">{client.firstName || client.name} {client.lastName || ''}</Text>
                                            <Text className="text-slate-400 text-[10px] font-medium">Last Login: {client.lastLoginAt ? new Date(client.lastLoginAt).toLocaleDateString() : 'Today'}</Text>
                                        </View>
                                    </View>
                                    <View className="bg-emerald-50 px-3 py-1 rounded-lg">
                                        <Text className="text-emerald-600 text-[9px] font-bold uppercase tracking-wider">Active</Text>
                                    </View>
                                </TouchableOpacity>
                            )) : (
                                <View className="bg-white p-8 rounded-[28px] items-center border border-dashed border-slate-200">
                                    <Users size={24} color="#CBD5E1" />
                                    <Text className="text-slate-400 text-xs mt-2">No active clients found</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* Floating Navigation Bottom (Mockup style) */}
                <View className="absolute bottom-6 left-6 right-6">
                    <View className="bg-white/90 shadow-2xl border border-white p-2 rounded-[32px] flex-row items-center justify-between px-6 backdrop-blur-lg">
                        <TouchableOpacity className="p-3"><LayoutGrid size={22} color={PRIMARY_COLOR} /></TouchableOpacity>
                        <TouchableOpacity className="p-3" onPress={() => router.push('/(drawer)/clients')}><Users size={22} color="#94a3b8" /></TouchableOpacity>
                        <TouchableOpacity className="w-14 h-14 bg-[#E07A5F] rounded-full items-center justify-center shadow-lg -mt-10 border-4 border-slate-50">
                            <Plus size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-3"><Activity size={22} color="#94a3b8" /></TouchableOpacity>
                        <TouchableOpacity className="p-3" onPress={() => navigation.openDrawer()}><Menu size={22} color="#94a3b8" /></TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
