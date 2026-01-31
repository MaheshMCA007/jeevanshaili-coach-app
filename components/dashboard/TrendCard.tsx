import React, { memo, useMemo } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { colors, fontSize, radius, spacing } from '../../src/theme/design-system';
import { createChartConfig, formatChartData } from '../../src/utils/chartHelpers';

const screenWidth = Dimensions.get('window').width;
const CHART_HEIGHT = 220;

/* ---------------------------------------
   Helpers
---------------------------------------- */

const getYAxisLabels = (
    title: string,
    values: number[],
    ySuffix?: string
): string[] => {
    if (!values.length) return [];

    const maxValue = Math.max(...values);

    // 🏃 STEPS
    if (title.toLowerCase().includes('step')) {
        return ['15K', '10K', '5K'];
    }

    // 🔥 CALORIES
    if (title.toLowerCase().includes('calorie')) {
        const rounded = Math.ceil(maxValue / 500) * 500;
        return [
            `${rounded}`,
            `${Math.floor(rounded * 0.66)}`,
            `${Math.floor(rounded * 0.33)}`,
        ];
    }

    // ⚖ WEIGHT
    if (ySuffix === 'kg') {
        const rounded = Math.ceil(maxValue / 5) * 5;
        return [
            `${rounded}kg`,
            `${rounded - 5}kg`,
            `${rounded - 10}kg`,
        ];
    }

    return [];
};

/* ---------------------------------------
   Component
---------------------------------------- */

interface TrendCardProps {
    title: string;
    data: any;
    color: string;
    ySuffix?: string;
    chartType?: 'line' | 'bar';
    onToggleType?: () => void;
}

export const TrendCard = memo<TrendCardProps>(({
    title,
    data,
    color,
    ySuffix = '',
    chartType = 'line',
    onToggleType,
}) => {
    const chartConfig = createChartConfig(color);
    const safeData = formatChartData(data);

    const values: number[] = safeData?.datasets?.[0]?.data || [];

    const yAxisLabels = useMemo(
        () => getYAxisLabels(title, values, ySuffix),
        [title, values, ySuffix]
    );

    const chartWidth = screenWidth - 32 - 44; // card padding + Y-axis space

    const commonProps = {
        data: safeData,
        width: chartWidth,
        height: CHART_HEIGHT,
        chartConfig,
        fromZero: true,
        yAxisSuffix: ySuffix,
        style: {
            borderRadius: radius.xl,
        },
    };

    return (
        <View
            style={{
                width: screenWidth - 32,
                backgroundColor: colors.white,
                paddingVertical: spacing[6],
                borderRadius: radius['3xl'],
                borderWidth: 1,
                borderColor: colors.slate[50],
                marginRight: spacing[4],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: spacing[6],
                    paddingHorizontal: spacing[6],
                }}
            >
                <Text
                    style={{
                        fontSize: fontSize.base,
                        fontWeight: '700',
                        color: colors.slate[800],
                    }}
                    numberOfLines={1}
                >
                    {title}
                </Text>

                {onToggleType && (
                    <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: colors.slate[100],
                            padding: spacing[1],
                            borderRadius: radius.xl,
                        }}
                    >
                        <TouchableOpacity
                            onPress={onToggleType}
                            style={{
                                paddingHorizontal: spacing[4],
                                paddingVertical: spacing[1.5],
                                borderRadius: radius.lg,
                                backgroundColor: chartType === 'line' ? colors.black : 'transparent',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: fontSize.xs,
                                    fontWeight: '700',
                                    color: chartType === 'line' ? colors.white : colors.slate[400],
                                }}
                            >
                                LINE
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onToggleType}
                            style={{
                                paddingHorizontal: spacing[4],
                                paddingVertical: spacing[1.5],
                                borderRadius: radius.lg,
                                backgroundColor: chartType === 'bar' ? colors.black : 'transparent',
                                marginLeft: spacing[1],
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: fontSize.xs,
                                    fontWeight: '700',
                                    color: chartType === 'bar' ? colors.white : colors.slate[400],
                                }}
                            >
                                BAR
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Chart Area */}
            <View style={{ flexDirection: 'row', paddingLeft: spacing[4] }}>

                {/* LEFT Y-AXIS */}
                <View
                    style={{
                        width: 36,
                        justifyContent: 'space-between',
                        height: CHART_HEIGHT - 20,
                        paddingVertical: 10,
                    }}
                >
                    {yAxisLabels.map(label => (
                        <Text
                            key={label}
                            style={{
                                fontSize: 10,
                                fontWeight: '600',
                                color: colors.slate[400],
                            }}
                        >
                            {label}
                        </Text>
                    ))}
                </View>

                {/* CHART */}
                {chartType === 'line' ? (
                    <LineChart
                        {...commonProps}
                        bezier
                        withDots
                        withInnerLines
                        withVerticalLines={false}
                        withOuterLines={false}
                        segments={3}
                        yAxisInterval={1}
                    />
                ) : (
                    <BarChart
                        {...commonProps}
                        showBarTops={false}
                        withInnerLines={false}
                        segments={3}
                    />
                )}
            </View>
        </View>
    );
});

TrendCard.displayName = 'TrendCard';
