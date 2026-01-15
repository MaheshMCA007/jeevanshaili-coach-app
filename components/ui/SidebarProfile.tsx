import React from "react";
import { Image, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../src/store";

export default function SidebarProfile() {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) return null;

    const avatar = user?.profile?.avatar;
    const brand = user?.tenantId?.name;
    const role = user?.role;
    const name = user?.name;
    const email = user?.email;

    return (
        <View className="mx-4 mt-4 mb-6 p-4 rounded-2xl bg-[#115e59] shadow-xl">
            <View className="flex-row items-center">
                {/* Avatar */}
                <View className="w-14 h-14 rounded-full overflow-hidden border-2 border-teal-300">
                    {avatar ? (
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-full bg-teal-400 items-center justify-center">
                            <Text className="text-xl text-white font-bold">
                                {name?.charAt(0)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Info */}
                <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold text-lg" numberOfLines={1}>
                        {name}
                    </Text>

                    <Text className="text-teal-200 text-xs capitalize">
                        {role} • {brand}
                    </Text>

                    <Text className="text-teal-300 text-xs mt-1" numberOfLines={1}>
                        {email}
                    </Text>
                </View>

                {/* Status */}
                <View className="bg-green-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">ACTIVE</Text>
                </View>
            </View>
        </View>
    );
}
