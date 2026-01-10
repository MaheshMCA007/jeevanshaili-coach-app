import {
  ChevronRight,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Moon,
  TrendingUp,
  User,
  Utensils
} from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchDashboardData } from '../../src/store/slices/dashboardSlice';

const screenWidth = Dimensions.get('window').width;

const MetricCard = ({ title, value, unit, icon: Icon, color }: any) => (
  <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex-1 m-1">
    <View className={`w-10 h-10 rounded-2xl items-center justify-center mb-3 bg-${color}-100`}>
      <Icon size={20} color={color === 'teal' ? '#0d9488' : color === 'orange' ? '#c2410c' : color === 'blue' ? '#2563eb' : '#475569'} />
    </View>
    <Text className="text-gray-500 text-xs font-medium">{title}</Text>
    <View className="flex-row items-baseline mt-1">
      <Text className="text-xl font-bold text-gray-800">{value}</Text>
      <Text className="text-gray-500 text-[10px] ml-1">{unit}</Text>
    </View>
  </View>
);

export default function DashboardScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, steps, calories, weight, nutrition, loading } = useSelector((state: RootState) => state.dashboard);
  console.log("summary----------",JSON.stringify(summary,null,2))
  console.log("steps----------",JSON.stringify(steps,null,2))
  console.log("calories----------",JSON.stringify(calories,null,2))
  console.log("weight----------",JSON.stringify(weight,null,2))
 console.log("nutrition----------",JSON.stringify(nutrition,null,2))
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(13, 148, 136, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#0d9488"
    }
  };

  const nutritionData = {
    labels: ["Prot", "Carb", "Fat"],
    datasets: [{
      data: [
        summary?.avgProtein || 80,
        summary?.avgCarbs || 120,
        summary?.avgFat || 45
      ]
    }]
  };

  if (loading && !summary) {
    return (
      <View className="flex-1 items-center justify-center bg-teal-50">
        <ActivityIndicator size="large" color="#0d9488" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <View className="py-6 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 text-sm font-medium">Dashboard</Text>
            <Text className="text-2xl font-bold text-gray-800">Welcome back, {user?.name || 'Jeevanshaili'}</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100">
            <User size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Metric Cards Grid */}
        <View className="flex-row flex-wrap -m-1 mb-6">
          <MetricCard
            title="Calories Burned"
            value={summary?.todayCaloriesBurned || 0}
            unit="kcal"
            icon={Flame}
            color="orange"
          />
          <MetricCard
            title="Steps"
            value={summary?.todaySteps || 21081}
            unit="steps"
            icon={Footprints}
            color="teal"
          />
        </View>
        <View className="flex-row flex-wrap -m-1 mb-6">
          <MetricCard
            title="Cal Intake"
            value={summary?.todayCaloriesConsumed || 1653}
            unit="kcal"
            icon={Utensils}
            color="blue"
          />
          <MetricCard
            title="Water Intake"
            value={summary?.todayWaterIntake || 7}
            unit="L"
            icon={Droplets}
            color="teal"
          />
        </View>
        <View className="flex-row flex-wrap -m-1 mb-6">
          <MetricCard
            title="Sleep"
            value={summary?.todaySleepContent || 0}
            unit="hrs"
            icon={Moon}
            color="blue"
          />
          <MetricCard
            title="Workouts"
            value={summary?.todayWorkouts || 0}
            unit="sessions"
            icon={Dumbbell}
            color="orange"
          />
        </View>

        {/* Charts Section */}
        <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Weekly Steps</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-teal-600 font-medium text-xs">View detail</Text>
              <ChevronRight size={14} color="#0d9488" />
            </TouchableOpacity>
          </View>
          <LineChart
            data={{
              labels: steps.length > 0 ? steps.slice(-7).map(s => s.date.split('-')[2]) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: steps.length > 0 ? steps.slice(-7).map(s => s.count) : [2000, 4000, 3500, 5000, 4200, 6000, 5500] }]
            }}
            width={screenWidth - 64}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={{ paddingRight: 0, borderRadius: 16 }}
          />
        </View>

        <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Average Nutrition</Text>
          <BarChart
            data={nutritionData}
            width={screenWidth - 64}
            height={200}
            yAxisLabel=""
            yAxisSuffix="g"
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})` }}
            verticalLabelRotation={0}
            style={{ borderRadius: 16 }}
          />
        </View>

        <View className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Weight Trend</Text>
            <TrendingUp size={20} color="#0d9488" />
          </View>
          <LineChart
            data={{
              labels: weight.length > 0 ? weight.slice(-7).map(w => w.date.split('-')[2]) : ["11/14", "11/21", "12/05", "12/12", "12/19", "12/26", "01/02"],
              datasets: [{ data: weight.length > 0 ? weight.slice(-7).map(w => w.weight) : [75, 74, 74.5, 73.8, 74.2, 73.5, 74] }]
            }}
            width={screenWidth - 64}
            height={180}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, propsForDots: { r: "4", strokeWidth: "2", stroke: "#3b82f6" } }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        {/* Footer spacing */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
