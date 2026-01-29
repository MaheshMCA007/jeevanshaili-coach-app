import React from "react";
import { Image, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../src/store";

export default function SidebarProfile() {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) return null;

    const avatar = user?.profile?.avatar;
    const role = user?.role;
    const name = user?.name;
    const email = user?.email;

    return (
        <View className="mx-2 mt-2 mb-2 p-4 rounded-[28px] bg-slate-50 border border-slate-100">
            <View className="flex-row items-center">
                {/* Avatar */}
                <View className="w-12 h-12 rounded-full overflow-hidden border border-white shadow-sm bg-slate-200">
                    {avatar ? (
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-full bg-[#E07A5F] items-center justify-center">
                            <Text className="text-lg text-white font-serif font-bold">
                                {name?.charAt(0)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Info */}
                <View className="ml-3 flex-1">
                    <Text className="text-slate-800 font-serif font-bold text-base" numberOfLines={1}>
                        {name}
                    </Text>

                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                        {role}
                    </Text>
                </View>
            </View>
        </View>
    );
}
