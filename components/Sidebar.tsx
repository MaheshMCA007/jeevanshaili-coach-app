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
import { colors, iconTextSpacing, radius, spacing } from "../src/theme/design-system";
import SidebarProfile from "./ui/SidebarProfile";

const PRIMARY_COLOR = colors.primary;

interface SidebarItemProps {
    icon: React.ComponentType<any>;
    label: string;
    path: string;
    active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, path, active }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(path as any)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing[5],
                paddingVertical: spacing[3],
                marginHorizontal: spacing[3],
                marginBottom: spacing[2],
                borderRadius: radius.xl,
                backgroundColor: active ? colors.primaryLight : 'transparent',
            }}
        >
            <Icon size={20} color={active ? PRIMARY_COLOR : colors.slate[400]} />
            <Text
                style={{
                    marginLeft: iconTextSpacing,
                    fontSize: 14,
                    fontWeight: '600',
                    color: active ? PRIMARY_COLOR : colors.slate[500],
                    flexShrink: 1,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
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
        <View style={{ flex: 1, backgroundColor: colors.white, paddingTop: spacing[12] }}>
            {/* Profile Card */}
            <TouchableOpacity
                onPress={handleLogout}
                style={{ paddingHorizontal: spacing[2] }}
            >
                <SidebarProfile />
            </TouchableOpacity>

            <View
                style={{
                    height: 1,
                    backgroundColor: colors.slate[50],
                    marginHorizontal: spacing[6],
                    marginBottom: spacing[4],
                    marginTop: spacing[2]
                }}
            />

            {/* Menu */}
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacing[4] }}
            >
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
            <View
                style={{
                    padding: spacing[6],
                    borderTopWidth: 1,
                    borderTopColor: colors.slate[50]
                }}
            >
                <TouchableOpacity
                    onPress={handleLogout}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.slate[50],
                        padding: spacing[4],
                        borderRadius: radius['2xl'],
                    }}
                >
                    <LogOut size={18} color={colors.slate[500]} />
                    <Text
                        style={{
                            marginLeft: iconTextSpacing,
                            fontWeight: '600',
                            color: colors.slate[500],
                            fontSize: 14,
                        }}
                    >
                        Sign Out
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
