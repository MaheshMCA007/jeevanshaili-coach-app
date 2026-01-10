import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Activity,
    ChevronLeft,
    Dumbbell,
    FileText,
    Flame,
    Footprints,
    Settings,
    Utensils,
    Weight
} from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { clearSelectedClient, fetchClientDetail } from '../../src/store/slices/clientSlice';

const screenWidth = Dimensions.get('window').width;

const HealthMetric = ({ title, value, unit, icon: Icon, color }: any) => (
    <View className="bg-white p-3 rounded-2xl border border-gray-100 flex-1 m-1 items-center">
        <View className={`w-8 h-8 rounded-xl items-center justify-center mb-2 bg-${color}-50`}>
            <Icon size={16} color={color === 'teal' ? '#0d9488' : color === 'orange' ? '#c2410c' : color === 'blue' ? '#2563eb' : '#475569'} />
        </View>
        <Text className="text-gray-400 text-[10px] uppercase font-bold text-center">{title}</Text>
        <Text className="text-gray-800 font-bold text-sm mt-1">{value} {unit}</Text>
    </View>
);

export default function ClientDetailScreen() {
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { selectedClient, clientHealth, loading } = useSelector((state: RootState) => state.clients);

    useEffect(() => {
        if (id) {
            dispatch(fetchClientDetail(id as string));
        }
        return () => {
            dispatch(clearSelectedClient());
        };
    }, [id, dispatch]);

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(13, 148, 136, ${opacity})`,
        strokeWidth: 2,
        decimalPlaces: 1,
        labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
        propsForDots: {
            r: "3",
            strokeWidth: "2",
            stroke: "#0d9488"
        }
    };

    if (loading && !selectedClient) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#0d9488" />
            </View>
        );
    }

    if (!selectedClient) return null;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
                <TouchableOpacity onPress={() => router.back()}>
                    <ChevronLeft size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-800">Client Profile</Text>
                <TouchableOpacity>
                    <Settings size={22} color="#1f2937" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
                {/* Profile Header */}
                <View className="items-center py-6 bg-slate-50">
                    <View className="w-24 h-24 bg-teal-100 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
                        {selectedClient.profileImage ? (
                            <Image source={{ uri: selectedClient.profileImage }} className="w-full h-full rounded-full" />
                        ) : (
                            <Text className="text-3xl font-bold text-teal-600">
                                {selectedClient.name?.charAt(0)}
                            </Text>
                        )}
                    </View>
                    <Text className="text-2xl font-bold text-gray-800">{selectedClient.name}</Text>
                    <Text className="text-gray-500">{selectedClient.goal || 'Weight Loss'} Plan</Text>

                    <View className="flex-row mt-6 px-6">
                        <TouchableOpacity className="flex-1 bg-teal-600 rounded-xl py-3 items-center mr-2">
                            <Text className="text-white font-bold">Assign Task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white border border-teal-600 rounded-xl py-3 items-center ml-2">
                            <Text className="text-teal-600 font-bold">Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Health Metrics */}
                <View className="p-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Current Health</Text>
                    <View className="flex-row flex-wrap -m-1">
                        <HealthMetric title="Weight" value={selectedClient.currentWeight || '74.5'} unit="kg" icon={Weight} color="teal" />
                        <HealthMetric title="Target" value={selectedClient.targetWeight || '70.0'} unit="kg" icon={Activity} color="orange" />
                        <HealthMetric title="BMI" value={selectedClient.bmi || '24.2'} unit="" icon={Activity} color="blue" />
                    </View>
                    <View className="flex-row flex-wrap -m-1 mt-2">
                        <HealthMetric title="Daily Cal" value={selectedClient.dailyCalories || '1800'} unit="kcal" icon={Flame} color="orange" />
                        <HealthMetric title="Steps" value={selectedClient.targetSteps || '10k'} unit="" icon={Footprints} color="teal" />
                        <HealthMetric title="Water" value={selectedClient.targetWater || '3.5'} unit="L" icon={Activity} color="blue" />
                    </View>
                </View>

                {/* Charts */}
                <View className="p-6 bg-slate-50">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Weight History</Text>
                    {clientHealth.length > 0 ? (
                        <LineChart
                            data={{
                                labels: clientHealth.slice(-6).map(h => dayjs(h.date).format('DD/MM')),
                                datasets: [{ data: clientHealth.slice(-6).map(h => h.weight || 0) }]
                            }}
                            width={screenWidth - 48}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={{ borderRadius: 16 }}
                        />
                    ) : (
                        <View className="bg-white p-10 rounded-2xl items-center">
                            <Text className="text-gray-400">No history available</Text>
                        </View>
                    )}
                </View>

                {/* Quick Links */}
                <View className="p-6 pb-20">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Quick Management</Text>
                    <View className="space-y-3">
                        <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <Utensils size={20} color="#0d9488" className="mr-4" />
                            <Text className="flex-1 font-bold text-gray-700">Meal Planner</Text>
                            <ChevronLeft size={20} color="#cbd5e1" style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <Dumbbell size={20} color="#c2410c" className="mr-4" />
                            <Text className="flex-1 font-bold text-gray-700">Workout Planner</Text>
                            <ChevronLeft size={20} color="#cbd5e1" style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <FileText size={20} color="#2563eb" className="mr-4" />
                            <Text className="flex-1 font-bold text-gray-700">Health Logs</Text>
                            <ChevronLeft size={20} color="#cbd5e1" style={{ transform: [{ rotate: '180deg' }] }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
