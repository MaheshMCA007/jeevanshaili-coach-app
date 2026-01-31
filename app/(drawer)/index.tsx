import { useNavigation, useRouter } from 'expo-router';
import {
    Activity,
    Bell,
    Menu,
    Moon,
    Users
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingScreen } from '../../components/common/UIStates';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { TrendCard } from '../../components/dashboard/TrendCard';
import { AppDispatch, RootState } from '../../src/store';
import { fetchClients } from '../../src/store/slices/clientSlice';
import { fetchDashboardData } from '../../src/store/slices/dashboardSlice';
import { colors, fontSize, radius, sectionSpacing, spacing } from '../../src/theme/design-system';
import { generateLast7DaysData, PRIMARY_COLOR } from '../../src/utils/chartHelpers';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<any>();
    const router = useRouter();

    const { summary, steps, calories, weight, loading } = useSelector((state: RootState) => state.dashboard);
    const { clients } = useSelector((state: RootState) => state.clients);
    const { user } = useSelector((state: RootState) => state.auth);
    const avatar = user?.profile?.avatar;

    const [stepsChartType, setStepsChartType] = useState<'line' | 'bar'>('line');
    const [caloriesChartType, setCaloriesChartType] = useState<'line' | 'bar'>('bar');
    const [weightChartType, setWeightChartType] = useState<'line' | 'bar'>('bar');

    useEffect(() => {
        dispatch(fetchDashboardData());
        dispatch(fetchClients());
    }, [dispatch]);

    const onRefresh = useCallback(() => {
        dispatch(fetchDashboardData());
        dispatch(fetchClients());
    }, [dispatch]);

    const stepsChartData = useMemo(() =>
        generateLast7DaysData(steps || [], 'value'),
        [steps]
    );

    const caloriesChartData = useMemo(() =>
        generateLast7DaysData(calories || [], 'value'),
        [calories]
    );

    const weightChartData = useMemo(() =>
        generateLast7DaysData(weight || [], 'value'),
        [weight]
    );

    const activeClientsList = useMemo(() =>
        Array.isArray(clients) ? clients.slice(0, 2) : [],
        [clients]
    );

    const openDrawer = useCallback(() => {
        navigation?.openDrawer();
    }, [navigation]);

    const navigateToSettings = useCallback(() => {
        router.push('/(drawer)/settings');
    }, [router]);

    const navigateToClient = useCallback((clientId: string) => {
        router.push(`/client/${clientId}`);
    }, [router]);

    if (loading && !summary) {
        return <LoadingScreen message="Loading dashboard..." />;
    }
    const CARD_WIDTH = screenWidth - spacing[8];
    const CHART_CARD_WIDTH = Math.min(screenWidth * 0.82, 420);
    const CHART_GAP = 20;// visible gap between cards

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.slate[50] }} edges={['top']}>
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={PRIMARY_COLOR} />
                    }
                >
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: sectionSpacing.horizontal,
                        paddingVertical: sectionSpacing.vertical
                    }}>
                        <TouchableOpacity
                            onPress={openDrawer}
                            style={{
                                padding: spacing[2.5],
                                backgroundColor: colors.white,
                                borderRadius: radius.full,
                                borderWidth: 1,
                                borderColor: colors.slate[100],
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 2,
                                elevation: 1,
                            }}
                        >
                            <Menu size={22} color={colors.slate[800]} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[3] }}>
                            {/* <TouchableOpacity
                                style={{
                                    padding: spacing[2.5],
                                    backgroundColor: colors.white,
                                    borderRadius: radius.full,
                                    borderWidth: 1,
                                    borderColor: colors.slate[100],
                                    position: 'relative',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                    elevation: 1,
                                }}
                            >
                                <Bell size={22} color={colors.slate[800]} />
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: spacing[2.5],
                                        right: spacing[2.5],
                                        width: spacing[2],
                                        height: spacing[2],
                                        backgroundColor: colors.primary,
                                        borderRadius: radius.full,
                                        borderWidth: 2,
                                        borderColor: colors.white,
                                    }}
                                />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={navigateToSettings}>
                                <Image
                                    source={{ uri: avatar }}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: radius.full,
                                        borderWidth: 2,
                                        borderColor: colors.white,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Welcome Section */}
                    <View style={{ paddingHorizontal: sectionSpacing.horizontal, marginBottom: spacing[8] }}>
                        <Text
                            style={{
                                color: colors.slate[400],
                                fontSize: 11,
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: 2,
                                marginBottom: spacing[1],
                            }}
                        >
                            Coach Dashboard
                        </Text>
                        <Text
                            style={{
                                fontSize: 32,
                                fontWeight: '600',
                                color: colors.slate[800],
                                lineHeight: 38,
                            }}
                        >
                            Welcome back,{"\n"}
                            <Text style={{ color: colors.primary }}>{user?.name?.split(' ')[0] || 'Coach'}</Text>
                        </Text>
                    </View>

                    {/* Chart Carousel – real spacing */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={CHART_CARD_WIDTH + CHART_GAP * 2}
                        snapToAlignment="start"
                        contentContainerStyle={{
                            paddingHorizontal: spacing[4] - CHART_GAP / 2,
                        }}
                        style={{ marginBottom: spacing[8] }}
                    >
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ width: CHART_CARD_WIDTH, marginHorizontal: CHART_GAP }}>
                                <TrendCard
                                    title="Weekly Steps"
                                    color="rgba(224, 122, 95, opacity)"
                                    data={stepsChartData}
                                    chartType={stepsChartType}
                                    onToggleType={() =>
                                        setStepsChartType(prev => (prev === 'line' ? 'bar' : 'line'))
                                    }
                                />
                            </View>

                            <View style={{ width: CHART_CARD_WIDTH, marginHorizontal: CHART_GAP * 2 }}>
                                <TrendCard
                                    title="Weekly Calories"
                                    color="rgba(249, 115, 22, opacity)"
                                    data={caloriesChartData}
                                    ySuffix="k"
                                    chartType={caloriesChartType}
                                    onToggleType={() =>
                                        setCaloriesChartType(prev => (prev === 'line' ? 'bar' : 'line'))
                                    }
                                />
                            </View>

                            <View style={{ width: CHART_CARD_WIDTH, marginHorizontal: CHART_GAP * 1.25 }}>
                                <TrendCard
                                    title="Weight Trend"
                                    color="rgba(59, 130, 246, opacity)"
                                    data={weightChartData}
                                    ySuffix="kg"
                                    chartType={weightChartType}
                                    onToggleType={() =>
                                        setWeightChartType(prev => (prev === 'line' ? 'bar' : 'line'))
                                    }
                                />
                            </View>

                        </View>
                    </ScrollView>







                    {/* KPI Cards Grid */}
                    <View style={{
                        paddingHorizontal: spacing[5],
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: spacing[4],
                        flexWrap: 'wrap'
                    }}>
                        <MetricCard
                            title="Steps"
                            value={summary?.totals?.steps ? `${(summary.totals.steps / 1000).toFixed(0)}k` : '0'}
                            trend="12"
                            icon={Activity}
                            color="orange"
                        />
                        <MetricCard
                            title="Sleep Avg"
                            value={summary?.totals?.sleepHours || '0'}
                            unit="Hrs"
                            icon={Moon}
                            color="indigo"
                        />
                    </View>

                    {/* Active Clients */}
                    <View style={{ paddingHorizontal: sectionSpacing.horizontal, marginBottom: spacing[8] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
                            <Text style={{ fontSize: fontSize.lg, fontWeight: '700', color: colors.slate[800] }}>
                                Active Clients
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/(drawer)/clients')}>
                                <Text style={{ color: colors.primary, fontWeight: '700', fontSize: fontSize.sm }}>
                                    View All
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ gap: spacing[3] }}>
                            {activeClientsList.length > 0 ? (
                                activeClientsList.map((client: any) => (
                                    <TouchableOpacity
                                        key={client._id}
                                        onPress={() => navigateToClient(client._id)}
                                        style={{
                                            backgroundColor: colors.white,
                                            padding: spacing[4],
                                            borderRadius: radius['2xl'],
                                            borderWidth: 1,
                                            borderColor: colors.slate[100],
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 2,
                                            elevation: 1,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: radius.full,
                                                backgroundColor: colors.primaryLight,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: spacing[4],
                                            }}
                                        >
                                            <Users size={20} color={PRIMARY_COLOR} />
                                        </View>
                                        <View style={{ flex: 1, marginRight: spacing[2] }}>
                                            <Text
                                                style={{
                                                    color: colors.slate[800],
                                                    fontWeight: '700',
                                                    fontSize: fontSize.base
                                                }}
                                                numberOfLines={1}
                                            >
                                                {client.firstName} {client.lastName}
                                            </Text>
                                            <Text
                                                style={{
                                                    color: colors.slate[400],
                                                    fontSize: fontSize.xs,
                                                    marginTop: spacing[0.5]
                                                }}
                                                numberOfLines={1}
                                            >
                                                {client.email}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: '#f0fdf4',
                                                paddingHorizontal: spacing[3],
                                                paddingVertical: spacing[1],
                                                borderRadius: radius.full,
                                            }}
                                        >
                                            <Text style={{ color: colors.success, fontSize: fontSize.xs, fontWeight: '700' }}>
                                                Active
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View
                                    style={{
                                        backgroundColor: colors.white,
                                        padding: spacing[8],
                                        borderRadius: radius['2xl'],
                                        borderWidth: 1,
                                        borderColor: colors.slate[100],
                                    }}
                                >
                                    <Text style={{ color: colors.slate[400], textAlign: 'center', fontSize: fontSize.sm }}>
                                        No active clients yet
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
