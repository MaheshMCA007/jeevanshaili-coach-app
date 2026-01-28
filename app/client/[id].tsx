import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ChevronLeft,
    Dumbbell,
    Flame,
    Footprints,
    GlassWater,
    Moon,
    MoreVertical,
    Weight
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import MealPlannerModal from '../../components/MealPlannerModal';
import WorkoutPlannerModal from '../../components/WorkoutPlannerModal';
import { AppDispatch, RootState } from '../../src/store';
import { clearSelectedClient, fetchClientDetail } from '../../src/store/slices/clientSlice';

const screenWidth = Dimensions.get('window').width;

const HealthMetric = ({ title, value, unit, icon: Icon, color, subtext }: any) => (
    <View className="bg-white p-4 rounded-3xl border border-gray-100 w-[47%] m-[1.5%] shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
            <View className={`w-10 h-10 rounded-full items-center justify-center bg-${color}-50`}>
                <Icon size={20} color={color === 'teal' ? '#0d9488' : color === 'orange' ? '#f97316' : color === 'blue' ? '#3b82f6' : '#64748b'} />
            </View>
        </View>
        <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{title}</Text>
        <Text className="text-gray-900 font-bold text-lg mt-1">{value} <Text className="text-xs font-normal text-gray-500">{unit}</Text></Text>
        {subtext ? <Text className="text-gray-400 text-[9px] mt-1">{subtext}</Text> : null}
    </View>
);

export default function ClientDetailScreen() {
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { selectedClient, clientHealth, loading } = useSelector((state: RootState) => state.clients);

    const [mealPlannerOpen, setMealPlannerOpen] = useState(false);
    const [workoutPlannerOpen, setWorkoutPlannerOpen] = useState(false);

    useEffect(() => {
        if (id) {
            console.log("ClientDetailScreen: Fetching data for id:", id);
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
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
        propsForDots: { r: "4", strokeWidth: "2", stroke: "#0d9488" },
        fillShadowGradientFrom: "#0d9488",
        fillShadowGradientTo: "#ccfbf1",
    };

    if (loading && !selectedClient) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#0d9488" />
                <Text className="text-gray-500 mt-2">Loading data...</Text>
            </View>
        );
    }

    if (!selectedClient) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <Text className="text-gray-500">Client data unavailable.</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-teal-600 px-6 py-3 rounded-full">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Process Health Data
    const rawHealth: any = clientHealth;
    const summary = rawHealth?.summary || {};
    const logs = rawHealth?.logs || {};

    // Extract logs for lists and charts
    const workoutLogs = Array.isArray(logs.workouts) ? logs.workouts : [];
    const nutritionLogs = Array.isArray(logs.nutrition) ? logs.nutrition : [];
    const weightLogs = Array.isArray(logs.weight) ? logs.weight : [];
    const stepsLogs = Array.isArray(logs.steps) ? logs.steps : [];

    // Grid Metrics mapping - Using the "summary" object from API
    const weightVal = summary.latestWeight || selectedClient.currentWeight || '-';
    const stepsVal = summary.latestSteps || 0;
    const waterVal = summary.latestWater || 0;
    const sleepVal = summary.latestSleep || 0;
    const caloriesVal = summary.latestFood?.calories?.toFixed(0) || 0;
    const workoutsVal = summary.latestWorkoutCount || 0;

    // Charts - Use Trend Data if available in logs
    const hasStepsData = stepsLogs.length > 0;
    const stepsChart = {
        labels: stepsLogs.slice(-7).map((h: any) => dayjs(h.date).format('D')),
        data: stepsLogs.slice(-7).map((h: any) => h.steps || 0)
    };

    const hasCaloriesData = nutritionLogs.length > 0;
    const caloriesChart = {
        labels: nutritionLogs.slice(-7).reverse().map((h: any) => dayjs(h.date).format('D')),
        data: nutritionLogs.slice(-7).reverse().map((h: any) => h.calories || 0)
    };

    const hasWeightData = weightLogs.length > 0;
    const weightChart = {
        labels: weightLogs.slice(-7).map((h: any) => dayjs(h.date).format('D/M')),
        data: weightLogs.slice(-7).map((h: any) => h.weight || 0)
    };

    const fullName = selectedClient.firstName ? `${selectedClient.firstName} ${selectedClient.lastName || ''}` : (selectedClient.name || 'Client');

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-50">
                <TouchableOpacity onPress={() => router.back()}>
                    <ChevronLeft size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text className="text-gray-400 text-xs font-medium uppercase">Dashboard</Text>
                <TouchableOpacity>
                    <MoreVertical size={20} color="#1f2937" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 bg-slate-50/50" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Profile Section */}
                <View className="p-6">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase">Client Overview</Text>
                    <Text className="text-2xl font-bold text-gray-800 mt-1">{fullName}</Text>
                    <Text className="text-gray-500 text-sm">{selectedClient.email}</Text>
                    <Text className="text-gray-500 text-sm">{selectedClient.phone || '8447620781'}</Text>
                </View>

                {/* Statistics Grid */}
                <View className="px-3 flex-row flex-wrap">
                    <HealthMetric title="Latest Weight" value={weightVal} unit="kg" icon={Weight} color="teal" />
                    <HealthMetric title="Latest Steps" value={stepsVal} unit="" icon={Footprints} color="teal" />
                    <HealthMetric title="Water Intake" value={waterVal} unit="glasses" icon={GlassWater} color="blue" />
                    <HealthMetric title="Sleep Hours" value={sleepVal} unit="hrs" icon={Moon} color="teal" />
                    <HealthMetric title="Calories" value={caloriesVal} unit="kcal" icon={Flame} color="orange" />
                    <HealthMetric title="Workouts" value={workoutsVal} unit="" icon={Dumbbell} color="teal" />
                </View>

                {/* Charts */}
                <View className="p-4 space-y-4">
                    {/* Steps Trend */}
                    <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Steps Trend</Text>
                        {hasStepsData ? (
                            <BarChart
                                data={{ labels: stepsChart.labels, datasets: [{ data: stepsChart.data }] }}
                                width={screenWidth - 64}
                                height={180}
                                chartConfig={chartConfig}
                                yAxisLabel=""
                                yAxisSuffix=""
                                style={{ borderRadius: 16 }}
                                showBarTops={false}
                                fromZero
                            />
                        ) : <Text className="text-gray-400 text-center py-6">No data</Text>}
                    </View>

                    {/* Calories Intake */}
                    <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Calories Intake</Text>
                        {hasCaloriesData ? (
                            <LineChart
                                data={{ labels: caloriesChart.labels, datasets: [{ data: caloriesChart.data }] }}
                                width={screenWidth - 64}
                                height={180}
                                chartConfig={chartConfig}
                                bezier
                                style={{ borderRadius: 16 }}
                            />
                        ) : <Text className="text-gray-400 text-center py-6">No data</Text>}
                    </View>

                    {/* Weight Trend */}
                    <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Weight Trend</Text>
                        {hasWeightData ? (
                            <LineChart
                                data={{ labels: weightChart.labels, datasets: [{ data: weightChart.data }] }}
                                width={screenWidth - 64}
                                height={180}
                                chartConfig={chartConfig}
                                style={{ borderRadius: 16 }}
                            />
                        ) : <Text className="text-gray-400 text-center py-6">No data</Text>}
                    </View>
                </View>

                {/* Activity Lists */}
                <View className="px-4 mt-6">
                    <View className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Workout Activity</Text>
                        {workoutLogs.slice(0, 5).map((log: any, i: number) => (
                            <View key={i} className="flex-row justify-between py-4 border-b border-gray-50 last:border-0">
                                <View>
                                    <Text className="text-gray-800 font-bold">{dayjs(log.date).format('M/D/YYYY')}</Text>
                                    <Text className="text-gray-400 text-[10px]">Calories: {log.caloriesBurned || '-'}</Text>
                                    <Text className="text-gray-400 text-[10px]">Workouts: {log.workouts?.[0]?.activity || 'N/A'}</Text>
                                </View>
                                <Text className="text-gray-500 text-xs">{log.workouts?.length || 0} sessions</Text>
                            </View>
                        ))}
                    </View>

                    <View className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Nutrition Logs</Text>
                        {nutritionLogs.slice(0, 5).map((log: any, i: number) => (
                            <View key={i} className="py-4 border-b border-gray-50 last:border-0">
                                <View className="flex-row justify-between mb-1">
                                    <Text className="text-gray-800 font-bold">{dayjs(log.date).format('M/D/YYYY')}</Text>
                                    <Text className="text-gray-600 font-bold">{log.calories?.toFixed(0) || 0} kcal</Text>
                                </View>
                                <Text className="text-gray-400 text-[10px]">
                                    Protein: {log.protein?.toFixed(1) || 0}g - Carbs: {log.carbs?.toFixed(1) || 0}g - Fat: {log.fat?.toFixed(1) || 0}g
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Planner Buttons */}
                <View className="p-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Daily Plan Builder</Text>
                    <View className="space-y-3">
                        <TouchableOpacity
                            onPress={() => setMealPlannerOpen(true)}
                            className="bg-black py-4 rounded-2xl items-center flex-row justify-center"
                        >
                            <Text className="text-white font-bold">Open Meal Planner</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setWorkoutPlannerOpen(true)}
                            className="bg-black py-4 rounded-2xl items-center flex-row justify-center"
                        >
                            <Text className="text-white font-bold">Open Workout Planner</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <MealPlannerModal
                isOpen={mealPlannerOpen}
                onClose={() => setMealPlannerOpen(false)}
                clientId={id as string}
                clientName={fullName}
            />

            <WorkoutPlannerModal
                isOpen={workoutPlannerOpen}
                onClose={() => setWorkoutPlannerOpen(false)}
                clientId={id as string}
                clientName={fullName}
            />
        </SafeAreaView>
    );
}
