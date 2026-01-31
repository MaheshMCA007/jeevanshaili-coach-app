import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { PRIMARY_COLOR } from '../../src/utils/chartHelpers';

interface LoadingScreenProps {
    message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => (
    <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text className="text-slate-600 mt-4 text-sm">{message}</Text>
    </View>
);

interface ErrorScreenProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="text-slate-800 text-lg font-bold mb-2">Oops!</Text>
        <Text className="text-slate-600 text-center mb-4">{message}</Text>
        {onRetry && (
            <Text
                className="text-[#E07A5F] font-bold"
                onPress={onRetry}
            >
                Tap to retry
            </Text>
        )}
    </View>
);

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon }) => (
    <View className="flex-1 items-center justify-center py-12">
        {icon}
        <Text className="text-slate-800 text-lg font-bold mt-4">{title}</Text>
        <Text className="text-slate-500 text-sm text-center mt-2 px-8">{message}</Text>
    </View>
);
