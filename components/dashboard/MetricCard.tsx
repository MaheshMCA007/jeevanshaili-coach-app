import { LucideIcon } from 'lucide-react-native';
import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../src/theme/design-system';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    color: 'orange' | 'indigo';
    trend?: string;
}

export const MetricCard = memo<MetricCardProps>(({
    title,
    value,
    unit,
    icon: Icon,
    color,
    trend
}) => {
    const iconColor = color === 'orange' ? colors.primary : '#6366f1';
    const bgColor = color === 'orange' ? colors.primaryLight : '#eef2ff';

    return (
        <View
            style={{
                backgroundColor: colors.white,
                padding: spacing[4],
                borderRadius: radius['3xl'],
                borderWidth: 1,
                borderColor: colors.slate[50],
                width: '47%',
                marginBottom: spacing[3],
                justifyContent: 'space-between',
                minHeight: 112,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
            }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View
                    style={{
                        padding: spacing[2],
                        borderRadius: radius['2xl'],
                        backgroundColor: bgColor,
                    }}
                >
                    <Icon size={18} color={iconColor} />
                </View>
                {trend && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: colors.success, fontSize: fontSize.xs, fontWeight: '700' }}>
                            ↑ {trend}%
                        </Text>
                    </View>
                )}
                {!trend && unit && (
                    <Text
                        style={{
                            color: colors.slate[400],
                            fontSize: fontSize.xs,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                        }}
                    >
                        {unit}
                    </Text>
                )}
            </View>
            <View>
                <Text
                    style={{
                        fontSize: fontSize['2xl'],
                        fontWeight: '900',
                        color: colors.slate[800],
                        letterSpacing: -0.5,
                    }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {value}
                </Text>
                <Text
                    style={{
                        color: colors.slate[400],
                        fontSize: fontSize.xs,
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        marginTop: spacing[1],
                    }}
                    numberOfLines={1}
                >
                    {title}
                </Text>
            </View>
        </View>
    );
});

MetricCard.displayName = 'MetricCard';
