import { DrawerNavigationProp } from '@react-navigation/drawer';
import dayjs from 'dayjs';
import { useNavigation } from 'expo-router';
import { CheckCircle2, Clock, Edit2, Menu, MessageCircle, MessageSquare, Search, UserPlus, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { addFollowUp, assignPricingPlan, convertToClient, createLead, fetchLeads, updateLead } from '../../src/store/slices/leadsSlice';
import { fetchPricingPlans } from '../../src/store/slices/pricingSlice';

const PRIMARY_COLOR = "#E07A5F";

const StatusBadge = ({ status }: { status: string }) => {
    const getColors = () => {
        switch (status?.toLowerCase()) {
            case 'new': return 'bg-blue-50 text-blue-600';
            case 'cold': return 'bg-slate-50 text-slate-600';
            case 'warm': return 'bg-orange-50 text-orange-600';
            case 'hot': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };
    return (
        <View className={`px-2.5 py-1 rounded-full ${getColors().split(' ')[0]}`}>
            <Text className={`text-[9px] font-extrabold uppercase tracking-wider ${getColors().split(' ')[1]}`}>
                {status || 'NEW'}
            </Text>
        </View>
    );
};

export default function LeadsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const { leads, loading, error } = useSelector((state: RootState) => state.leads);
    const { plans } = useSelector((state: RootState) => state.pricing);

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [modalType, setModalType] = useState<'followup' | 'edit' | 'plan' | 'add' | null>(null);

    // Form States
    const [followUpData, setFollowUpData] = useState({ asked: '', response: '', status: 'warm', callbackAt: '' });
    const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
    const [planData, setPlanData] = useState({ planId: '', endDate: '' });
    const [addData, setAddData] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        dispatch(fetchLeads());
        dispatch(fetchPricingPlans());
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchLeads());
        setRefreshing(false);
    };

    const handleCreateLead = async () => {
        if (!addData.name || !addData.email || !addData.phone) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        const resultAction = await dispatch(createLead(addData));
        if (createLead.fulfilled.match(resultAction)) {
            setModalType(null);
            setAddData({ name: '', email: '', phone: '' });
            Alert.alert('Success', 'Lead created successfully');
        } else {
            Alert.alert('Error', resultAction.payload as string || 'Failed to create lead');
        }
    };

    const filteredLeads = leads?.filter((lead: any) =>
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery)
    ) || [];

    const handleAddFollowUp = async () => {
        if (!selectedLead?.id) return;
        if (!followUpData.asked || !followUpData.response) {
            Alert.alert('Error', 'Please fill all follow-up fields');
            return;
        }
        const resultAction = await dispatch(addFollowUp({
            leadId: selectedLead.id,
            data: { ...followUpData, source: 'app' }
        }));

        if (addFollowUp.fulfilled.match(resultAction)) {
            // Update selectedLead locally for immediate feedback
            if (selectedLead) {
                const newFollowUp = {
                    ...followUpData,
                    createdAt: new Date().toISOString()
                };
                setSelectedLead({
                    ...selectedLead,
                    followUps: [...(selectedLead.followUps || []), newFollowUp]
                });
            }
            setFollowUpData({ asked: '', response: '', status: 'warm', callbackAt: '' });
            Alert.alert('Success', 'Follow-up added successfully');
        } else {
            Alert.alert('Error', resultAction.payload as string || 'Failed to add follow-up');
        }
    };

    const handleUpdateLead = async () => {
        if (!selectedLead?.id) return;
        const resultAction = await dispatch(updateLead({ leadId: selectedLead.id, data: editData }));

        if (updateLead.fulfilled.match(resultAction)) {
            setModalType(null);
            Alert.alert('Success', 'Lead updated successfully');
        } else {
            Alert.alert('Error', resultAction.payload as string || 'Failed to update lead');
        }
    };

    const handleAssignPlan = async () => {
        if (!selectedLead?.id) return;
        if (!planData.planId) {
            Alert.alert('Error', 'Please select a plan');
            return;
        }
        const resultAction = await dispatch(assignPricingPlan({
            userId: selectedLead.id,
            planId: planData.planId,
            endDate: planData.endDate
        }));

        if (assignPricingPlan.fulfilled.match(resultAction)) {
            setModalType(null);
            Alert.alert('Success', 'Plan assigned successfully');
        } else {
            Alert.alert('Error', resultAction.payload as string || 'Failed to assign plan');
        }
    };

    const handleConvertToClient = (leadId: string, name: string) => {
        Alert.alert(
            'Convert to Client',
            `Are you sure you want to convert ${name} to a client?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Convert',
                    style: 'default',
                    onPress: async () => {
                        const resultAction = await dispatch(convertToClient(leadId));
                        if (convertToClient.fulfilled.match(resultAction)) {
                            const message = (resultAction.payload as any)?.message || 'Lead converted to client successfully';
                            Alert.alert('Success', message);
                        } else {
                            Alert.alert('Error', resultAction.payload as string || 'Failed to convert lead');
                        }
                    }
                }
            ]
        );
    };

    const renderLeadItem = ({ item, index }: any) => (
        <View className="bg-white p-5 mb-4 rounded-[32px] border border-slate-50 shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-3 border border-slate-100">
                        <Text className="text-slate-400 font-serif font-bold text-sm">{index + 1}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-800 font-serif font-bold text-lg" numberOfLines={1}>{item.name || 'Unknown'}</Text>
                        <Text className="text-slate-400 text-xs font-medium tracking-wide" numberOfLines={1}>{item.email}</Text>
                        <View className="flex-row items-center mt-1">
                            <TouchableOpacity onPress={() => item.phone && item.phone !== '-' && Linking.openURL(`tel:${item.phone}`)}>
                                <Text className="text-slate-500 text-[11px] font-bold">{item.phone || (item.phone === '-' ? '-' : 'No Phone')}</Text>
                            </TouchableOpacity>
                            {item.phone && item.phone !== '-' && (
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`whatsapp://send?phone=${item.phone.replace(/\D/g, '')}`)}
                                    className="ml-2"
                                >
                                    <MessageCircle size={14} color="#25D366" fill="#25D366" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
                <View className="items-end">
                    <StatusBadge status={item.leadStatus} />
                    <TouchableOpacity
                        onPress={() => handleConvertToClient(item.id, item.name)}
                        className="bg-[#E07A5F] px-4 py-2.5 rounded-xl mt-3 shadow-sm shadow-orange-100"
                    >
                        <Text className="text-white text-[10px] font-extrabold text-center uppercase tracking-wider">Convert{'\n'}to Client</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {item.pricingPlanName && item.pricingPlanName !== 'Unknown' && (
                <View className="flex-row items-center mb-4 bg-slate-50 p-3 rounded-2xl border border-dotted border-slate-200">
                    <View className="w-6 h-6 rounded-full bg-teal-100 items-center justify-center mr-2">
                        <CheckCircle2 size={12} color="#0d9488" />
                    </View>
                    <View>
                        <Text className="text-slate-600 text-[10px] font-extrabold uppercase">{item.pricingPlanName}</Text>
                        {item.pricingExpiresAt && (
                            <Text className="text-slate-400 text-[9px] font-medium">Expires: {dayjs(item.pricingExpiresAt).format('MMM D, YYYY')}</Text>
                        )}
                    </View>
                </View>
            )}

            <View className="flex-row items-center justify-between border-t border-slate-50 pt-4">
                <View className="flex-row items-center">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-slate-400 text-[11px] font-bold ml-1.5 uppercase tracking-tighter">
                        {dayjs(item.inquiryDate).format('MMM D, YYYY')}
                    </Text>
                </View>
                <View className="flex-row gap-2.5">
                    <TouchableOpacity
                        onPress={() => { setSelectedLead(item); setFollowUpData({ ...followUpData, status: item.leadStatus }); setModalType('followup'); }}
                        className="bg-slate-50 p-3 rounded-2xl items-center justify-center border border-slate-100"
                    >
                        <MessageSquare size={18} color={PRIMARY_COLOR} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedLead(item);
                            setEditData({ name: item.name, email: item.email, phone: item.phone || '' });
                            setModalType('edit');
                        }}
                        className="bg-slate-50 p-3 rounded-2xl items-center justify-center border border-slate-100"
                    >
                        <Edit2 size={18} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedLead(item);
                            setPlanData({ planId: item.pricingPlanId || '', endDate: '' });
                            setModalType('plan');
                        }}
                        className="bg-slate-800 px-5 py-3 rounded-2xl shadow-sm"
                    >
                        <Text className="text-white text-[10px] font-extrabold uppercase tracking-wider">Set Plan</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 flex-1 pt-6">
                <View className="flex-row justify-between items-center mb-8">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100 mr-4"
                        >
                            <Menu size={22} color="#1e293b" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px]">Conversion</Text>
                            <Text className="text-3xl font-serif font-semibold text-slate-800">Leads Pipeline</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => setModalType('add')}
                        className="bg-[#E07A5F] w-12 h-12 rounded-full items-center justify-center shadow-lg shadow-orange-200"
                    >
                        <UserPlus size={22} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="flex-row items-center bg-white rounded-full px-6 py-3.5 border border-slate-100 shadow-sm mb-8">
                    <Search size={20} color="#94a3b8" className="mr-3" />
                    <TextInput
                        className="flex-1 text-slate-800 font-medium h-full"
                        placeholder="Search leads..."
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={16} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                </View>

                {loading && !leads.length ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} className="mt-10" />
                ) : (
                    <FlatList
                        data={filteredLeads}
                        renderItem={renderLeadItem}
                        keyExtractor={(item) => item?.id || Math.random().toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        ListEmptyComponent={
                            <View className="items-center justify-center mt-20 bg-white p-8 rounded-[32px] border border-dashed border-slate-200">
                                <Text className="text-slate-400 font-medium">No leads found</Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* Modals */}
            <Modal visible={modalType !== null} animationType="slide" transparent>
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-[40px] p-6 pb-12 shadow-2xl">
                        <View className="flex-row justify-between items-center mb-8">
                            <View>
                                <Text className="text-2xl font-serif font-bold text-slate-800">
                                    {modalType === 'add' ? 'Add New Lead' :
                                        modalType === 'followup' ? 'Add Follow-up' :
                                            modalType === 'edit' ? 'Edit Details' : 'Pricing Plan'}
                                </Text>
                                <Text className="text-slate-400 text-xs mt-1 font-medium">{selectedLead?.name || 'Input details below'}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setModalType(null)} className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
                                <X size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {modalType === 'add' && (
                                <View className="space-y-5">
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Full Name</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium"
                                            placeholder="Lead name"
                                            value={addData.name}
                                            onChangeText={t => setAddData({ ...addData, name: t })}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Email</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium"
                                            placeholder="email@example.com"
                                            keyboardType="email-address"
                                            value={addData.email}
                                            onChangeText={t => setAddData({ ...addData, email: t })}
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Phone</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium"
                                            placeholder="Phone number"
                                            keyboardType="phone-pad"
                                            value={addData.phone}
                                            onChangeText={t => setAddData({ ...addData, phone: t })}
                                        />
                                    </View>
                                    <View className="flex-row gap-3 mt-4">
                                        <TouchableOpacity
                                            onPress={handleCreateLead}
                                            className="flex-[2] bg-[#E07A5F] py-4 rounded-2xl items-center shadow-lg shadow-orange-100"
                                        >
                                            <Text className="text-white font-bold text-lg">Create Lead</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setModalType(null)}
                                            className="flex-1 bg-white border border-slate-100 py-4 rounded-2xl items-center"
                                        >
                                            <Text className="text-slate-400 font-bold text-lg">Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            {modalType === 'followup' && (
                                <View className="space-y-5">
                                    {/* History */}
                                    {selectedLead?.followUps?.length > 0 && (
                                        <View className="mb-6">
                                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">Recent Activity</Text>
                                            {selectedLead.followUps.slice().reverse().map((f: any, i: number) => (
                                                <View key={i} className="mb-3 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                                                    <View className="flex-row justify-between items-center mb-2">
                                                        <Text className="text-slate-400 text-[10px] font-medium">{dayjs(f.createdAt).format('MMM D • h:mm A')}</Text>
                                                        <Text className={`text-[9px] font-bold uppercase ${f.status === 'hot' ? 'text-red-500' : 'text-slate-500'}`}>{f.status}</Text>
                                                    </View>
                                                    <Text className="text-slate-600 text-xs">{f.asked}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Follow-up Details</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium mb-3"
                                            placeholder="What was discussed?"
                                            value={followUpData.asked}
                                            onChangeText={t => setFollowUpData({ ...followUpData, asked: t })}
                                        />
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium"
                                            placeholder="Client's response..."
                                            value={followUpData.response}
                                            onChangeText={t => setFollowUpData({ ...followUpData, response: t })}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Status</Text>
                                        <View className="flex-row gap-2">
                                            {['cold', 'warm', 'hot'].map(s => (
                                                <TouchableOpacity
                                                    key={s}
                                                    onPress={() => setFollowUpData({ ...followUpData, status: s })}
                                                    className={`flex-1 py-3 rounded-xl items-center border ${followUpData.status === s ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-100'}`}
                                                >
                                                    <Text className={`text-xs font-bold uppercase ${followUpData.status === s ? 'text-white' : 'text-slate-400'}`}>{s}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Next Call (YYYY-MM-DD)</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium"
                                            placeholder="e.g. 2026-02-15"
                                            value={followUpData.callbackAt}
                                            onChangeText={t => setFollowUpData({ ...followUpData, callbackAt: t })}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={handleAddFollowUp} className="bg-[#E07A5F] py-4 rounded-2xl items-center mt-4 border border-orange-200">
                                        <Text className="text-white font-bold text-lg">Add Activity</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {modalType === 'edit' && (
                                <View className="space-y-4">
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Name</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium"
                                            value={editData.name}
                                            onChangeText={t => setEditData({ ...editData, name: t })}
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Email</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium"
                                            value={editData.email}
                                            onChangeText={t => setEditData({ ...editData, email: t })}
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Phone</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium"
                                            value={editData.phone}
                                            onChangeText={t => setEditData({ ...editData, phone: t })}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                    <TouchableOpacity onPress={handleUpdateLead} className="bg-slate-800 py-4 rounded-2xl items-center mt-4">
                                        <Text className="text-white font-bold text-lg">Update Lead</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {modalType === 'plan' && (
                                <View className="space-y-4">
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Choose a Plan</Text>
                                        <View className="bg-slate-50 border border-slate-100 rounded-2xl p-2">
                                            {plans.map((p: any) => (
                                                <TouchableOpacity
                                                    key={p.id}
                                                    onPress={() => setPlanData({ ...planData, planId: p.id })}
                                                    className={`p-4 rounded-xl mb-1 flex-row justify-between items-center ${planData.planId === p.id ? 'bg-white shadow-sm' : ''}`}
                                                >
                                                    <View>
                                                        <Text className={`font-bold ${planData.planId === p.id ? 'text-slate-800' : 'text-slate-500'}`}>{p.name}</Text>
                                                        <Text className="text-slate-300 text-[9px] uppercase font-bold tracking-wider">{p.tier}</Text>
                                                    </View>
                                                    {planData.planId === p.id && <CheckCircle2 size={18} color={PRIMARY_COLOR} />}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    <View>
                                        <Text className="text-slate-500 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">Expire Date (Optional)</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-800 font-medium"
                                            placeholder="YYYY-MM-DD"
                                            value={planData.endDate}
                                            onChangeText={t => setPlanData({ ...planData, endDate: t })}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={handleAssignPlan} className="bg-slate-800 py-4 rounded-2xl items-center mt-4">
                                        <Text className="text-white font-bold text-lg">Assign Plan</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
