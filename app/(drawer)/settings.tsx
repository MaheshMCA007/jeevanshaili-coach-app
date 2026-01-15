import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Bell, ChevronRight, CircleHelp, LogOut, Menu, Shield, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store';

const SettingItem = ({ icon: Icon, label, value, color }: any) => (
    <TouchableOpacity className="flex-row items-center px-4 py-4 bg-white mb-0.5">
        <View className={`w-10 h-10 rounded-xl items-center justify-center bg-${color}-50`}>
            <Icon size={20} color={color === 'teal' ? '#0d9488' : color === 'blue' ? '#2563eb' : color === 'red' ? '#dc2626' : '#64748b'} />
        </View>
        <View className="flex-1 ml-4">
            <Text className="text-gray-900 font-bold">{label}</Text>
            {value && <Text className="text-gray-400 text-xs mt-0.5">{value}</Text>}
        </View>
        <ChevronRight size={18} color="#cbd5e1" />
    </TouchableOpacity>
);

export default function SettingsScreen() {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()}
                    className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4"
                >
                    <Menu size={24} color="#0d4d44" />
                </TouchableOpacity>
                <Text className="text-xl font-black text-gray-900">Settings</Text>
            </View>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 py-8 items-center">
                    <View className="w-24 h-24 rounded-full bg-teal-100 items-center justify-center mb-4 border-4 border-white shadow-sm">
                        <Text className="text-teal-600 text-3xl font-black">{user?.name?.charAt(0) || 'J'}</Text>
                    </View>
                    <Text className="text-2xl font-black text-gray-900">{user?.name || 'Coach Chandan'}</Text>
                    <Text className="text-gray-500 font-medium">{user?.email || 'coach@jeevanshaili.com'}</Text>
                    <TouchableOpacity className="mt-4 bg-teal-600 px-6 py-2 rounded-full">
                        <Text className="text-white font-bold">Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-4">
                    <Text className="px-6 mb-2 text-gray-400 text-xs font-black uppercase tracking-widest">Account</Text>
                    <SettingItem icon={User} label="Profile Information" value="Name, Email, Phone" color="teal" />
                    <SettingItem icon={Bell} label="Notifications" value="Toggle app alerts" color="blue" />
                </View>

                <View className="mt-6">
                    <Text className="px-6 mb-2 text-gray-400 text-xs font-black uppercase tracking-widest">Security & Help</Text>
                    <SettingItem icon={Shield} label="Privacy & Security" color="teal" />
                    <SettingItem icon={CircleHelp} label="Help Center" color="blue" />
                </View>

                <View className="mt-6">
                    <Text className="px-6 mb-2 text-gray-400 text-xs font-black uppercase tracking-widest">More</Text>
                    <SettingItem icon={LogOut} label="Logout" color="red" />
                </View>

                <View className="items-center py-10">
                    <Text className="text-gray-300 text-[10px] font-black uppercase tracking-tighter">Version 1.0.0 (Build 42)</Text>
                    <Text className="text-gray-300 text-[10px] font-black uppercase tracking-tighter">Powered by JeevanShali AI</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
