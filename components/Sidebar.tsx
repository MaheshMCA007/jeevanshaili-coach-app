import { usePathname, useRouter } from "expo-router";
import {
    Calendar,
    CreditCard,
    Dumbbell,
    Home,
    LogOut,
    Settings,
    UserPlus,
    Users,
    Utensils,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../src/store";
import { logout } from "../src/store/slices/authSlice";
import SidebarProfile from "./ui/SidebarProfile";

const PRIMARY_COLOR = "#E07A5F";

const SidebarItem = ({ icon: Icon, label, path, active }: any) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(path)}
            className={`flex-row items-center px-5 py-3.5 mx-3 rounded-[16px] mb-2 ${active ? "bg-[#fff1ed]" : "bg-transparent"}`}
        >
            <Icon size={20} color={active ? PRIMARY_COLOR : "#94a3b8"} />
            <Text
                className={`ml-4 font-bold text-sm ${active ? "text-[#E07A5F]" : "text-slate-500"}`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default function Sidebar(props: any) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const menuItems = [
        { label: "Home", icon: Home, path: "/(drawer)" },
        { label: "Clients", icon: Users, path: "/(drawer)/clients" },
        { label: "Leads", icon: UserPlus, path: "/(drawer)/leads" },
        { label: "Follow-ups", icon: Calendar, path: "/(drawer)/followups" },
        { label: "Workouts", icon: Dumbbell, path: "/(drawer)/workouts" },
        { label: "Meals", icon: Utensils, path: "/(drawer)/meals" },
        { label: "Pricing Plans", icon: CreditCard, path: "/(drawer)/pricing-plans" },
        { label: "Settings", icon: Settings, path: "/(drawer)/settings" },
    ];

    const handleLogout = () => {
        dispatch(logout());
        router.replace("/login");
    };

    const isActive = (path: string) => {
        if (path === "/(drawer)" && pathname === "/") return true;
        return pathname.includes(path);
    };

    return (
        <View className="flex-1 bg-white pt-12">
            {/* Profile Card */}
            <TouchableOpacity onPress={handleLogout} className="px-2">
                <SidebarProfile />
            </TouchableOpacity>

            <View className="h-px bg-slate-50 mx-6 mb-4 mt-2" />

            {/* Menu */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        path={item.path}
                        active={isActive(item.path)}
                    />
                ))}
            </ScrollView>

            {/* Logout */}
            <View className="p-6 border-t border-slate-50">
                <TouchableOpacity onPress={handleLogout} className="flex-row items-center justify-center bg-slate-50 p-4 rounded-2xl">
                    <LogOut size={18} color="#64748b" />
                    <Text className="ml-2 font-bold text-slate-500 text-sm">Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
