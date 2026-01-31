import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useRouter } from 'expo-router';
import { ChevronRight, Menu, Plus, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchClients, setSelectedClientId } from '../../src/store/slices/clientSlice';
import { colors, fontSize, iconTextSpacing, radius, sectionSpacing, spacing } from '../../src/theme/design-system';

const PRIMARY_COLOR = colors.primary;

export default function ClientsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { clients, loading } = useSelector((state: RootState) => state.clients);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    const filteredClients = clients.filter(client => {
        const fullName = `${client.firstName || ""} ${client.lastName || ""}`.toLowerCase();
        return (
            fullName.includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const renderClientItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={{
                backgroundColor: colors.white,
                padding: spacing[5],
                borderRadius: radius['3xl'],
                borderWidth: 1,
                borderColor: colors.slate[50],
                marginBottom: spacing[3],
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
            }}
            onPress={() => {
                dispatch(setSelectedClientId(item._id));
                router.push(`/client/${item._id}` as any);
            }}
        >
            <View style={{
                width: 56,
                height: 56,
                backgroundColor: colors.slate[50],
                borderRadius: radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing[4],
                borderWidth: 1,
                borderColor: colors.slate[100],
            }}>
                {item.profileImage ? (
                    <Image source={{ uri: item.profileImage }} style={{ width: 56, height: 56, borderRadius: radius.full }} />
                ) : (
                    <Text style={{ color: colors.slate[400], fontWeight: '700', fontSize: fontSize.lg }}>
                        {(item.firstName?.[0] || item.name?.[0] || '').toUpperCase()}
                    </Text>
                )}
            </View>
            <View style={{ flex: 1, marginRight: spacing[2] }}>
                <Text
                    style={{
                        color: colors.slate[800],
                        fontWeight: '700',
                        fontSize: fontSize.lg,
                    }}
                    numberOfLines={1}
                >
                    {item.firstName} {item.lastName}
                </Text>
                <Text
                    style={{
                        color: colors.slate[400],
                        fontSize: fontSize.xs,
                        fontWeight: '500',
                        marginTop: spacing[0.5],
                    }}
                    numberOfLines={1}
                >
                    {item.email}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing[2] }}>
                    <View style={{
                        paddingHorizontal: spacing[2.5],
                        paddingVertical: spacing[1],
                        borderRadius: radius.full,
                        backgroundColor: item.status === 'active' ? '#f0fdf4' : colors.slate[50],
                    }}>
                        <Text style={{
                            fontSize: 9,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            color: item.status === 'active' ? colors.success : colors.slate[500],
                        }}>
                            {item.status?.toUpperCase() || 'STANDARD'}
                        </Text>
                    </View>
                    {item.plan && (
                        <Text
                            style={{
                                color: colors.slate[300],
                                fontSize: 10,
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                marginLeft: spacing[2]
                            }}
                            numberOfLines={1}
                        >
                            • {item.plan}
                        </Text>
                    )}
                </View>
            </View>
            <View style={{
                width: 32,
                height: 32,
                borderRadius: radius.full,
                backgroundColor: colors.slate[50],
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <ChevronRight size={16} color={colors.slate[400]} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.slate[50] }} edges={['top']}>
            <View style={{ paddingHorizontal: sectionSpacing.horizontal, paddingVertical: sectionSpacing.vertical, flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[8] }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            style={{
                                width: 48,
                                height: 48,
                                backgroundColor: colors.white,
                                borderRadius: radius.full,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: colors.slate[100],
                                marginRight: spacing[4],
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 2,
                                elevation: 1,
                            }}
                        >
                            <Menu size={22} color={colors.slate[800]} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: colors.slate[400], fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 }}>
                                Management
                            </Text>
                            <Text
                                style={{ fontSize: 30, fontWeight: '600', color: colors.slate[800] }}
                                numberOfLines={1}
                            >
                                Your Clients
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{
                            width: 48,
                            height: 48,
                            backgroundColor: PRIMARY_COLOR,
                            borderRadius: radius.full,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: PRIMARY_COLOR,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 4,
                        }}
                    >
                        <Plus size={24} color={colors.white} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.white,
                    borderRadius: radius.full,
                    paddingHorizontal: sectionSpacing.horizontal,
                    paddingVertical: spacing[3.5],
                    borderWidth: 1,
                    borderColor: colors.slate[100],
                    marginBottom: spacing[8],
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                }}>
                    <Search size={20} color={colors.slate[400]} />
                    <TextInput
                        style={{
                            flex: 1,
                            color: colors.slate[800],
                            fontWeight: '500',
                            marginLeft: iconTextSpacing,
                            fontSize: fontSize.base,
                        }}
                        placeholder="Search clients..."
                        placeholderTextColor={colors.slate[400]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Client List */}
                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    </View>
                ) : (
                    <FlatList
                        data={filteredClients}
                        renderItem={renderClientItem}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: spacing[6] }}
                        ListEmptyComponent={
                            <View style={{
                                backgroundColor: colors.white,
                                padding: spacing[12],
                                borderRadius: radius['3xl'],
                                borderWidth: 1,
                                borderColor: colors.slate[100],
                                alignItems: 'center',
                            }}>
                                <Text style={{ color: colors.slate[400], fontSize: fontSize.sm, textAlign: 'center' }}>
                                    {searchQuery ? 'No clients found' : 'No clients yet'}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
