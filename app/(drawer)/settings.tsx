import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Bell, ChevronRight, CircleHelp, LogOut, Menu, Shield, User } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store';

const PRIMARY_COLOR = "#E07A5F";

const SettingItem = ({ icon: Icon, label, value, color }: any) => (
    <TouchableOpacity className="flex-row items-center p-4 bg-white mb-3 rounded-[24px] border border-slate-50 shadow-sm">
        <View className={`w-12 h-12 rounded-2xl items-center justify-center bg-${color}-50`}>
            <Icon size={22} color={color === 'teal' ? '#0d9488' : color === 'blue' ? '#2563eb' : color === 'red' ? '#dc2626' : '#64748b'} />
        </View>
        <View className="flex-1 ml-4">
            <Text className="text-slate-800 font-bold text-base">{label}</Text>
            {value && <Text className="text-slate-400 text-xs mt-0.5 font-medium">{value}</Text>}
        </View>
        <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
            <ChevronRight size={16} color="#cbd5e1" />
        </View>
    </TouchableOpacity>
);

export default function SettingsScreen() {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="mb-8 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100 mr-4"
                    >
                        <Menu size={22} color="#1e293b" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">Configuration</Text>
                        <Text className="text-3xl font-serif font-semibold text-slate-800">Settings</Text>
                    </View>
                </View>

                {/* Profile Card */}
                <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm mb-10 items-center relative overflow-hidden">
                    <View className="absolute top-0 left-0 right-0 h-24 bg-slate-100" />
                    <View className="w-24 h-24 rounded-full bg-slate-200 items-center justify-center mb-4 border-4 border-white shadow-sm mt-4">
                        {/* <Text className="text-slate-500 text-3xl font-serif font-bold">{user?.name?.charAt(0) || 'M'}</Text> */}
                        <Image
                            source={{ uri: user?.profile?.avatar }}
                            className="w-full h-full rounded-full"
                            resizeMode="cover"
                        />
                    </View>
                    <Text className="text-2xl font-serif font-bold text-slate-800">{user?.name || 'Coach Chandan'}</Text>
                    <Text className="text-slate-400 font-medium text-sm mb-6">{user?.email || 'coach@jeevanshaili.com'}</Text>

                    {/* <TouchableOpacity className="bg-slate-900 px-8 py-3 rounded-2xl shadow-lg shadow-slate-200">
                        <Text className="text-white font-bold text-sm">Edit Profile</Text>
                    </TouchableOpacity> */}
                </View>

                <View className="mb-8">
                    <Text className="mb-4 text-slate-400 text-xs font-bold uppercase tracking-widest pl-2">Account</Text>
                    <SettingItem icon={User} label="Personal Info" value="Name, Email, Phone" color="teal" />
                    <SettingItem icon={Bell} label="Notifications" value="Manage alerts" color="blue" />
                </View>

                <View className="mb-8">
                    <Text className="mb-4 text-slate-400 text-xs font-bold uppercase tracking-widest pl-2">Security & Support</Text>
                    <SettingItem icon={Shield} label="Privacy & Security" color="teal" />
                    <SettingItem icon={CircleHelp} label="Help Center" color="blue" />
                </View>

                <View className="mb-8">
                    <Text className="mb-4 text-slate-400 text-xs font-bold uppercase tracking-widest pl-2">Session</Text>
                    <SettingItem icon={LogOut} label="Log Out" color="red" />
                </View>

                <View className="items-center py-6">
                    {/* <Text className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">Version 1.0.0 (Build 42)</Text> */}
                    <Text className="text-slate-300 text-[10px] font-bold uppercase tracking-wider mt-1">Powered by JeevanShali Coach</Text>
                </View>

                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
