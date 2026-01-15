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

const SidebarItem = ({ icon: Icon, label, path, active }: any) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(path)}
            className={`flex-row items-center px-6 py-4 mx-2 rounded-xl mb-1 ${active ? "bg-white" : ""
                }`}
        >
            <Icon size={20} color={active ? "#0d9488" : "#cbd5e1"} />
            <Text
                className={`ml-3 font-medium ${active ? "text-teal-800" : "text-slate-300"
                    }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default function Sidebar() {
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
        <View className="flex-1 bg-[#0d4d44] pt-12">
            {/* Profile Card */}
            <SidebarProfile />

            {/* Menu */}
            <ScrollView className="flex-1">
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
            <View className="p-6 border-t border-teal-900/50">
                <TouchableOpacity onPress={handleLogout} className="flex-row items-center">
                    <LogOut size={20} color="#cbd5e1" />
                    <Text className="ml-3 font-medium text-slate-300">Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
