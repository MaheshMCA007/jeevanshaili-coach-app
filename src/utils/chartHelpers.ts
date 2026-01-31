import dayjs from 'dayjs';

export const PRIMARY_COLOR = "#E07A5F";
export const SECONDARY_COLOR = "#f97316";
export const TERTIARY_COLOR = "#3b82f6";

/**
 * Generate last 7 days with data or zeros
 */
export const generateLast7DaysData = (data: any[], valueKey: string) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        last7Days.push(dayjs().subtract(i, 'day'));
    }

    const labels = last7Days.map(d => `${d.month() + 1}/${d.date()}`);
    const values = last7Days.map(d => {
        const found = data?.find((item: any) =>
            dayjs(item.date || item._id).isSame(d, 'day')
        );

        if (found) {
            const val = found[valueKey] ?? found.value ?? found.amount ??
                found.steps ?? found.weight ?? found.calories ?? 0;
            return Number(val) || 0;
        }
        return 0;
    });

    return {
        labels,
        datasets: [{ data: values }]
    };
};

/**
 * Chart configuration factory
 */
export const createChartConfig = (color: string) => ({
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
        fontWeight: "bold" as const,
    },
    barPercentage: 0.7,
});

/**
 * Safe data formatter for charts
 */
export const formatChartData = (data: any) => {
    const safeLabels = data?.labels?.length ? data.labels : ["M", "T", "W", "T", "F", "S", "S"];
    const safeData = data?.datasets?.[0]?.data?.map((d: any) => Number(d) || 0) || [0, 0, 0, 0, 0, 0, 0];

    return {
        labels: safeLabels,
        datasets: [{ data: safeData }]
    };
};

/**
 * Format number with K suffix
 */
export const formatNumber = (num: number): string => {
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
};
