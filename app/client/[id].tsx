import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Activity,
    Calendar,
    ChevronLeft,
    MoreVertical,
    Utensils
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import MealPlannerModal from '../../components/MealPlannerModal';
import WorkoutPlannerModal from '../../components/WorkoutPlannerModal';
import { AppDispatch, RootState } from '../../src/store';
import { clearSelectedClient, fetchClientDetail } from '../../src/store/slices/clientSlice';

const PRIMARY_COLOR = "#E07A5F";
const screenWidth = Dimensions.get('window').width;

// Toggle Button Component
const ChartToggle = ({ type, setType }: { type: 'line' | 'bar', setType: (t: 'line' | 'bar') => void }) => (
    <View className="flex-row bg-slate-50 p-1 rounded-xl">
        <TouchableOpacity
            onPress={() => setType('line')}
            className={`px-3 py-1 rounded-lg ${type === 'line' ? 'bg-white shadow-sm' : ''}`}
        >
            <Text className={`text-[10px] font-bold ${type === 'line' ? 'text-slate-700' : 'text-slate-400'}`}>Line</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => setType('bar')}
            className={`px-3 py-1 rounded-lg ${type === 'bar' ? 'bg-white shadow-sm' : ''}`}
        >
            <Text className={`text-[10px] font-bold ${type === 'bar' ? 'text-slate-700' : 'text-slate-400'}`}>Bar</Text>
        </TouchableOpacity>
    </View>
);

const KPICard = ({ title, value, unit, icon: Icon, color }: any) => (
    <View className="bg-white p-5 rounded-[32px] border border-slate-50 w-[48%] mb-4 shadow-sm h-32 justify-between">
        <View className="flex-row justify-between items-start">
            <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">{title}</Text>
            <View className={`p-1.5 rounded-full ${color === 'orange' ? 'bg-orange-50' : 'bg-slate-50'}`}>
                {Icon && <Icon size={12} color={color === 'orange' ? PRIMARY_COLOR : '#94a3b8'} />}
            </View>
        </View>
        <Text className="text-slate-800 font-serif font-black text-2xl">{value} <Text className="text-xs font-bold text-slate-400 uppercase">{unit}</Text></Text>
    </View>
);

const LogSection = ({ title, data, renderRow, icon: Icon }: any) => (
    <View className="bg-white p-6 rounded-[32px] border border-slate-50 mb-6 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center mr-3 border border-slate-100">
                    <Icon size={14} color={PRIMARY_COLOR} />
                </View>
                <Text className="text-lg font-serif font-bold text-slate-800">{title}</Text>
            </View>
        </View>
        <ScrollView className="max-h-60" nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <View className="space-y-4">
                {data.length > 0 ? data.map(renderRow) : <Text className="text-slate-300 text-xs italic text-center py-4">No logs recorded yet.</Text>}
            </View>
        </ScrollView>
    </View>
);

export default function ClientDetailScreen() {
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { selectedClient, clientHealth, loading } = useSelector((state: RootState) => state.clients);

    const [mealPlannerOpen, setMealPlannerOpen] = useState(false);
    const [workoutPlannerOpen, setWorkoutPlannerOpen] = useState(false);
    const [planDate, setPlanDate] = useState(dayjs().format('YYYY-MM-DD'));

    // Chart Types State
    const [stepsChartType, setStepsChartType] = useState<'line' | 'bar'>('bar');
    const [caloriesChartType, setCaloriesChartType] = useState<'line' | 'bar'>('bar');
    const [weightChartType, setWeightChartType] = useState<'line' | 'bar'>('bar'); // Default to Bar as per request

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
        color: (opacity = 1) => `rgba(224, 122, 95, ${opacity})`, // Terracotta
        strokeWidth: 2,
        barPercentage: 0.7,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
        fillShadowGradientFrom: PRIMARY_COLOR,
        fillShadowGradientTo: "#fb923c",
        fillShadowGradientOpacity: 0.8,
        propsForBackgroundLines: {
            strokeDasharray: "4",
            stroke: "rgba(226, 232, 240, 0.5)"
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#fff"
        }
    };

    if (loading && !selectedClient) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
        );
    }

    if (!selectedClient) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <Text className="text-slate-500 font-medium">Client not found.</Text>
            </View>
        );
    }

    // Robust Health Data Parsing
    const rawHealth: any = clientHealth || {};

    const findSummaryValue = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return {};
        if (obj.totals) return obj.totals;
        if (obj.summary) return findSummaryValue(obj.summary);
        return obj;
    };
    const sum = findSummaryValue(rawHealth);

    // Summary KPI Values
    const weightVal = sum.latestWeight || sum.weight || selectedClient.currentWeight || '-';
    const stepsVal = sum.latestSteps || sum.steps || sum.value || 0;
    const waterVal = sum.latestWater || sum.waterIntake || sum.water || 0;
    const sleepVal = sum.latestSleep || sum.sleepHours || sum.sleep || 0;
    const caloriesVal = sum.latestFood?.calories || sum.latestFood?.energyKcal || sum.foodCalories || sum.calories || sum.value || 0;
    const workoutsVal = sum.latestWorkoutCount || sum.workoutsCompleted || sum.workoutCount || 0;

    // Logs Parsing - The API might return logs nested or direct
    const logsData = rawHealth.logs || rawHealth;
    const stepsLogs = Array.isArray(logsData.steps) ? logsData.steps : [];
    const nutritionLogs = Array.isArray(logsData.nutrition) || Array.isArray(logsData.food) ? (logsData.nutrition || logsData.food) : [];
    const weightLogs = Array.isArray(logsData.weight) ? logsData.weight : [];
    const sleepLogs = Array.isArray(logsData.sleep) ? logsData.sleep : [];
    const waterLogs = Array.isArray(logsData.water) ? logsData.water : [];
    const workoutActivity = Array.isArray(logsData.workouts) ? logsData.workouts : [];

    // Chart Data Helpers
    const getChartData = (data: any[], valKey: string) => {
        const last7Days: any[] = [];
        for (let i = 6; i >= 0; i--) {
            last7Days.push(dayjs().subtract(i, 'day'));
        }

        const labels = last7Days.map(d => d.format('M/D'));
        const datasetData = last7Days.map(d => {
            const found = data?.find((l: any) => dayjs(l.date || l._id).isSame(d, 'day'));
            if (found) {
                const val = found[valKey] ?? found.value ?? found.amount ?? found.steps ?? found.weight ?? found.calories ?? 0;
                return Number(val) || 0;
            }
            return 0;
        });

        return {
            labels,
            datasets: [{ data: datasetData }]
        };
    };

    const stepsChart = getChartData(stepsLogs, 'steps');
    const caloriesChart = getChartData(nutritionLogs, 'calories');
    const weightChart = getChartData(weightLogs, 'weight');

    const assignedMeals = (selectedClient.mealPlan?.items || []).filter((item: any) => {
        const targetDay = dayjs(planDate).day();
        return item.dayOfWeek === targetDay;
    });

    const assignedWorkouts = (selectedClient.workoutPlan?.items || []).filter((item: any) => {
        const targetDay = dayjs(planDate).day();
        return item.dayOfWeek === targetDay;
    });

    const fullName = `${selectedClient.firstName || ''} ${selectedClient.lastName || ''}`.trim() || selectedClient.name || 'Client';

    const renderChart = (type: 'line' | 'bar', data: any, height: number = 200, color = PRIMARY_COLOR) => {
        const isBar = type === 'bar';

        const specificConfig = {
            ...chartConfig,
            color: (opacity = 1) => color === PRIMARY_COLOR
                ? `rgba(224, 122, 95, ${opacity})`
                : `rgba(249, 115, 22, ${opacity})`,
        };

        if (data.labels.length === 0) {
            return <View className="h-40 items-center justify-center"><Text className="text-slate-300">Not enough data</Text></View>;
        }

        return isBar ? (
            <BarChart
                data={data}
                width={screenWidth - 84}
                height={height}
                chartConfig={specificConfig}
                showBarTops={false}
                fromZero
                yAxisLabel=""
                yAxisSuffix=""
                style={{ borderRadius: 16, paddingRight: 0 }}
            />
        ) : (
            <LineChart
                data={data}
                width={screenWidth - 84}
                height={height}
                chartConfig={specificConfig}
                bezier
                withDots={true}
                withInnerLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                style={{ borderRadius: 16, paddingRight: 0 }}
            />
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            {/* Header */}
            <View className="px-6 py-6 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-white rounded-full items-center justify-center border border-slate-100 mr-4 shadow-sm">
                        <ChevronLeft size={22} color="#1e293b" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">Overview</Text>
                        <Text className="text-slate-800 font-serif font-bold text-2xl">{fullName}</Text>
                    </View>
                </View>
                <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center border border-slate-100 shadow-sm">
                    <MoreVertical size={22} color="#1e293b" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Client Profile Info */}
                <View className="px-6 mb-6">
                    <Text className="text-slate-400 text-xs font-medium">{selectedClient.email}</Text>
                    <Text className="text-slate-400 text-xs mt-1 font-medium">{selectedClient.phone || '-'}</Text>
                </View>

                {/* KPI Grid */}
                <View className="px-6 flex-row flex-wrap justify-between">
                    <KPICard title="Current Weight" value={weightVal} unit="kg" icon={Activity} color="orange" />
                    <KPICard title="Daily Steps" value={stepsVal} unit="" icon={Activity} />
                    <KPICard title="Water Intake" value={waterVal} unit="gls" icon={Activity} />
                    <KPICard title="Sleep Avg" value={sleepVal} unit="hrs" icon={Activity} />
                    <KPICard title="Calories" value={caloriesVal} unit="kcal" icon={Activity} color="orange" />
                    <KPICard title="Workouts" value={workoutsVal} unit="" icon={Activity} />
                </View>

                {/* Main Trends Charts */}
                <View className="px-6 mt-4 space-y-6">
                    {/* Steps Trend */}
                    <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-lg font-serif font-bold text-slate-800">Steps Trend</Text>
                            <ChartToggle type={stepsChartType} setType={setStepsChartType} />
                        </View>
                        {renderChart(stepsChartType, stepsChart)}
                    </View>

                    {/* Calories Intake */}
                    <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-lg font-serif font-bold text-slate-800">Calories Intake</Text>
                            <ChartToggle type={caloriesChartType} setType={setCaloriesChartType} />
                        </View>
                        {renderChart(caloriesChartType, caloriesChart)}
                    </View>

                    {/* Weight Trend */}
                    <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-lg font-serif font-bold text-slate-800">Weight Trend</Text>
                            <ChartToggle type={weightChartType} setType={setWeightChartType} />
                        </View>
                        {renderChart(weightChartType, weightChart)}
                    </View>
                </View>

                {/* Three Column Logs (Sleep, Steps) */}
                <View className="px-6 flex-row justify-between mt-6">
                    <View className="bg-white p-6 rounded-[32px] border border-slate-50 w-[48%] shadow-sm">
                        <Text className="text-lg font-serif font-bold text-slate-800 mb-4">Sleep</Text>
                        <ScrollView className="max-h-48" nestedScrollEnabled showsVerticalScrollIndicator={false}>
                            <View className="space-y-4">
                                {sleepLogs.length > 0 ? sleepLogs.map((l: any, i: number) => (
                                    <View key={i}>
                                        <Text className="text-slate-800 font-bold text-[10px]">{dayjs(l.date).format('M/DD')}</Text>
                                        <Text className="text-slate-400 text-[9px]">{dayjs(l.startTime).format('h:mm A')} - {dayjs(l.endTime).format('h:mm A')}</Text>
                                    </View>
                                )) : <Text className="text-slate-300 text-[10px] italic">No logs</Text>}
                            </View>
                        </ScrollView>
                    </View>
                    <View className="bg-white p-6 rounded-[32px] border border-slate-50 w-[48%] shadow-sm">
                        <Text className="text-lg font-serif font-bold text-slate-800 mb-4">Steps</Text>
                        <ScrollView className="max-h-48" nestedScrollEnabled showsVerticalScrollIndicator={false}>
                            <View className="space-y-4">
                                {stepsLogs.length > 0 ? stepsLogs.map((l: any, i: number) => (
                                    <View key={i} className="flex-row justify-between items-center">
                                        <Text className="text-slate-800 font-bold text-[10px]">{dayjs(l.date).format('M/DD')}</Text>
                                        <Text className="text-slate-400 text-[9px]">{l.steps}</Text>
                                    </View>
                                )) : <Text className="text-slate-300 text-[10px] italic">No logs</Text>}
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {/* Workout Activity Log */}
                <View className="px-6 mt-6">
                    <LogSection
                        title="Workout Activity"
                        data={workoutActivity}
                        icon={Activity}
                        renderRow={(log: any, i: number) => (
                            <View key={i} className="flex-row items-center justify-between mb-2">
                                <View>
                                    <Text className="text-slate-800 font-bold text-xs">{dayjs(log.date).format('MMM D, YYYY')}</Text>
                                    <Text className="text-slate-400 text-[10px] font-medium">Approx. {log.caloriesBurned || 0} kcal burned</Text>
                                </View>
                                <View className="bg-slate-50 px-2 py-1 rounded-lg">
                                    <Text className="text-slate-500 text-[9px] font-bold uppercase">{log.workouts?.length || 0} sessions</Text>
                                </View>
                            </View>
                        )}
                    />

                    {/* Nutrition Logs */}
                    <LogSection
                        title="Nutrition Logs"
                        data={nutritionLogs}
                        icon={Utensils}
                        renderRow={(log: any, i: number) => (
                            <View key={i} className="flex-row items-center justify-between mb-3 border-b border-slate-50 pb-2 last:border-0">
                                <View className="flex-1">
                                    <View className="flex-row justify-between mb-1">
                                        <Text className="text-slate-800 font-bold text-xs">{dayjs(log.date).format('MMM D')}</Text>
                                        <Text className="text-slate-800 font-extrabold text-xs">{log.calories?.toFixed(0) || 0} kcal</Text>
                                    </View>

                                    <Text className="text-slate-400 text-[10px] font-medium" numberOfLines={1}>
                                        P: {log.protein?.toFixed(0) || 0}g · C: {log.carbs?.toFixed(0) || 0}g · F: {log.fat?.toFixed(0) || 0}g
                                    </Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/* Plan Builder Buttons */}
                <View className="px-6 mb-8 mt-2">
                    <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-2">Daily Plan Builder</Text>
                    <Text className="text-slate-500 text-[10px] mb-6 font-medium">Assign meals or workouts for a specific date.</Text>

                    <TouchableOpacity
                        onPress={() => setMealPlannerOpen(true)}
                        className="bg-slate-900 py-4 rounded-2xl items-center mb-4 shadow-lg shadow-slate-200"
                    >
                        <Text className="text-white font-bold text-sm tracking-wide">Open Meal Planner</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setWorkoutPlannerOpen(true)}
                        className="bg-white border border-slate-200 py-4 rounded-2xl items-center mb-6 shadow-sm"
                    >
                        <Text className="text-slate-800 font-bold text-sm tracking-wide">Open Workout Planner</Text>
                    </TouchableOpacity>

                    <Text className="text-[10px] text-slate-300 italic mb-6 text-center">Pick a date then search and assign items.</Text>
                </View>

                {/* Assigned Meals Section */}
                <View className="px-6 mb-8">
                    <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-lg font-serif font-bold text-slate-800">Assigned Meals</Text>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase mt-1">{dayjs(planDate).format('dddd · MMM D')}</Text>
                            </View>
                            <TouchableOpacity className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Calendar size={12} color="#64748b" className="mr-2" />
                                <Text className="text-slate-500 text-[10px] font-bold">Plan Meals</Text>
                            </TouchableOpacity>
                        </View>

                        {assignedMeals.length > 0 ? (
                            <View className="space-y-3">
                                {assignedMeals.map((item: any, i: number) => (
                                    <View key={i} className="flex-row items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                                        <Text className="text-slate-800 font-bold text-xs">{item.foodName}</Text>
                                        <View className="bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                                            <Text className="text-orange-700 font-bold text-[8px] uppercase">{item.mealType}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View className="py-8 items-center justify-center border border-dashed border-slate-200 rounded-[24px]">
                                <Text className="text-slate-300 text-xs font-medium">No meals assigned for this date.</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Assigned Workouts Section */}
                <View className="px-6 mb-20">
                    <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-lg font-serif font-bold text-slate-800">Assigned Workouts</Text>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase mt-1">{dayjs(planDate).format('dddd · MMM D')}</Text>
                            </View>
                            <TouchableOpacity className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Calendar size={12} color="#64748b" className="mr-2" />
                                <Text className="text-slate-500 text-[10px] font-bold">Plan Workouts</Text>
                            </TouchableOpacity>
                        </View>

                        {assignedWorkouts.length > 0 ? (
                            <View className="space-y-3">
                                {assignedWorkouts.map((item: any, i: number) => (
                                    <View key={i} className="flex-row items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                                        <Text className="text-slate-800 font-bold text-xs">{item.workoutName}</Text>
                                        <View className="bg-[#E07A5F]/10 px-2 py-0.5 rounded-md border border-[#E07A5F]/20">
                                            <Text className="text-[#E07A5F] font-bold text-[8px] uppercase">Assigned</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View className="py-8 items-center justify-center border border-dashed border-slate-200 rounded-[24px]">
                                <Text className="text-slate-300 text-xs font-medium">No workouts assigned for this date.</Text>
                            </View>
                        )}
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

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    }
});
