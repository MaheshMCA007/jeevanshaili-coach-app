import dayjs from 'dayjs';
import { Calendar, Check, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../src/store';
import { fetchClientDetail } from '../src/store/slices/clientSlice';
import { assignMeal, fetchFoods } from '../src/store/slices/foodSlice';

interface MealPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    clientName: string;
}

const MEAL_TYPES = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'morning_snack', label: 'Morning Snack' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'evening_snack', label: 'Evening Snack' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'other', label: 'Other' },
];

export default function MealPlannerModal({ isOpen, onClose, clientId, clientName }: MealPlannerModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const { foods, loading: searchLoading, assigning } = useSelector((state: RootState) => state.foods);
    const { selectedClient, clientHealth } = useSelector((state: RootState) => state.clients);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMealType, setSelectedMealType] = useState('breakfast');
    const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
    const [notes, setNotes] = useState('');

    // Fetch initial foods when search query is empty
    useEffect(() => {
        if (isOpen) {
            dispatch(fetchFoods(''));
        }
    }, [isOpen]);

    const handleSearch = () => {
        dispatch(fetchFoods(searchQuery));
    };

    const toggleFoodSelection = (food: any) => {
        const index = selectedFoods.findIndex(f => f.id === food.id);
        if (index > -1) {
            setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
        } else {
            setSelectedFoods([...selectedFoods, food]);
        }
    };

    const handleAssignMeals = async () => {
        if (selectedFoods.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one food item.');
            return;
        }

        const payload = {
            foodIds: selectedFoods.map(f => f.id),
            mealType: selectedMealType,
            notes: notes,
            weekStart: dayjs(selectedDate).startOf('week').format('YYYY-MM-DD'),
            dayOfWeek: dayjs(selectedDate).day(), // 0 for Sunday, 1 for Monday...
            applyToWeek: false
        };

        try {
            await dispatch(assignMeal({ clientId, data: payload })).unwrap();
            Alert.alert('Success', 'Meals assigned successfully!');
            setSelectedFoods([]);
            setNotes('');
            setSearchQuery('');
            // Refresh client detail to show updated meals
            dispatch(fetchClientDetail(clientId));
            // Close modal after success or keep it open? User screenshot shows it open.
            // onClose();
        } catch (error: any) {
            Alert.alert('Error', error || 'Failed to assign meals');
        }
    };

    // Extract assigned items for the selected day and type from the client's current plan
    const mealPlan = selectedClient?.mealPlan;
    const mealPlanItems = Array.isArray(mealPlan?.items) ? mealPlan.items : [];

    const getAssignedItemsForType = (type: string) => {
        const targetDay = dayjs(selectedDate).day();
        // Only show items if they belong to the same week being viewed
        const currentWeekStart = dayjs(selectedDate).startOf('week').format('YYYY-MM-DD');
        const planWeekStart = mealPlan?.weekStart ? dayjs(mealPlan.weekStart).format('YYYY-MM-DD') : null;

        if (planWeekStart && planWeekStart !== currentWeekStart) {
            // If the plan in selectedClient is for a different week, we might need to fetch that week's plan
            // or for now, just show what's in the client object if it's the target day.
            // Usually selectedClient has the latest assigned plan.
        }

        return mealPlanItems.filter((item: any) => {
            return item.dayOfWeek === targetDay && item.mealType === type;
        });
    };

    const renderFoodItem = (food: any) => {
        const isSelected = selectedFoods.some(f => f.id === food.id);
        return (
            <TouchableOpacity
                key={food.id}
                onPress={() => toggleFoodSelection(food)}
                className={`flex-row items-center p-3 mb-2 rounded-2xl border ${isSelected ? 'border-teal-500 bg-teal-50' : 'border-gray-100 bg-white'}`}
            >
                {food.foodImage ? (
                    <Image source={{ uri: food.foodImage }} className="w-12 h-12 rounded-lg bg-gray-100" />
                ) : (
                    <View className="w-12 h-12 rounded-lg bg-gray-100 items-center justify-center">
                        <Plus size={20} color="#94a3b8" />
                    </View>
                )}
                <View className="flex-1 ml-3">
                    <Text className="text-gray-900 font-bold text-sm" numberOfLines={1}>{food.foodName}</Text>
                    <Text className="text-gray-500 text-[10px]">{Math.round(food.energyKcal)} kcal - {food.servingsUnit || 'serving'}</Text>
                </View>
                {isSelected ? (
                    <View className="bg-teal-500 rounded-full p-1">
                        <Check size={12} color="white" />
                    </View>
                ) : (
                    <Text className="text-teal-600 font-bold text-xs">Select</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={isOpen}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/60 justify-end">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="bg-white rounded-t-[40px] overflow-hidden"
                    style={{ height: '92%' }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50">
                        <View>
                            <Text className="text-2xl font-extrabold text-gray-900 tracking-tight">Daily Meal Planner</Text>
                            <Text className="text-gray-400 text-xs mt-0.5">Assign meals for a specific date.</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-10 h-10 rounded-full bg-red-50 items-center justify-center"
                        >
                            <Text className="text-red-600 font-extrabold text-lg">✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        {/* Date Selection */}
                        <View className="px-6 py-5">
                            <View className="flex-row items-center">
                                <Text className="text-gray-500 text-sm mr-4">Plan date</Text>
                                <View className="flex-row items-center bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                                    <Text className="text-gray-900 font-bold mr-3">{dayjs(selectedDate).format('DD-MM-YYYY')}</Text>
                                    <Calendar size={18} color="#64748b" />
                                </View>
                                <Text className="text-gray-400 text-sm ml-4">{dayjs(selectedDate).format('dddd')}</Text>
                            </View>
                        </View>

                        <View className={`${isMobile ? 'flex-col' : 'flex-row'} flex-1 border-t border-gray-50`}>
                            {/* Left Pane: Meal Types */}
                            <View className={`${isMobile ? 'w-full' : 'w-[55%]'} p-5 bg-white border-r border-gray-50`}>
                                {MEAL_TYPES.map((type) => {
                                    const assigned = getAssignedItemsForType(type.id);
                                    const isActive = selectedMealType === type.id;
                                    return (
                                        <TouchableOpacity
                                            key={type.id}
                                            onPress={() => setSelectedMealType(type.id)}
                                            className={`p-5 mb-4 rounded-3xl border ${isActive ? 'border-black bg-white shadow-xl shadow-black/5' : 'border-gray-100 bg-white'}`}
                                        >
                                            <View className="flex-row items-center justify-between mb-2">
                                                <Text className={`text-base font-bold ${isActive ? 'text-black' : 'text-gray-800'}`}>{type.label}</Text>
                                                <Text className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">{assigned.length} items</Text>
                                            </View>
                                            {assigned.length > 0 ? (
                                                <View className="space-y-2">
                                                    {assigned.map((item: any, idx: number) => (
                                                        <View key={idx} className="flex-row items-center justify-between">
                                                            <Text className="text-gray-600 font-medium text-xs flex-1 mr-2" numberOfLines={1}>
                                                                {item.foodName}
                                                            </Text>
                                                            <View className="bg-orange-50 px-2 py-0.5 rounded-md">
                                                                <Text className="text-orange-600 font-bold text-[8px] uppercase">Assigned</Text>
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>
                                            ) : (
                                                <Text className="text-gray-400 text-xs italic">No meals assigned yet.</Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Right Pane: Search & Assign */}
                            <View className={`${isMobile ? 'w-full' : 'w-[45%]'} p-5 bg-slate-50/50`}>
                                <Text className="text-gray-900 font-bold text-sm mb-1">Selected: {MEAL_TYPES.find(m => m.id === selectedMealType)?.label} · {dayjs(selectedDate).format('MMM D, YYYY')}</Text>
                                <Text className="text-[10px] text-gray-500 mb-5">Assign meals for this date.</Text>

                                <View className="mb-6">
                                    <View className="bg-white border border-gray-200 rounded-2xl px-4 h-12 mb-3 shadow-sm shadow-black/5 flex-row items-center">
                                        <TextInput
                                            className="flex-1 text-sm font-medium"
                                            placeholder="Search meal items"
                                            placeholderTextColor="#94a3b8"
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            onSubmitEditing={handleSearch}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleSearch}
                                        className="bg-slate-900 py-4 rounded-2xl items-center mb-4 shadow-lg shadow-slate-200"
                                        disabled={searchLoading}
                                    >
                                        {searchLoading ? (
                                            <ActivityIndicator size="small" color="white" />
                                        ) : (
                                            <Text className="text-white font-bold text-sm">Search Foods</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {foods.length > 0 && (
                                    <View className="mb-6">
                                        <Text className="text-xs font-bold text-gray-800 mb-3">Results</Text>
                                        <View>
                                            {foods.map(renderFoodItem)}
                                        </View>
                                    </View>
                                )}

                                <View className="mt-2">
                                    <Text className="text-xs font-bold text-gray-800 mb-2">Notes</Text>
                                    <TextInput
                                        className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm min-h-[100px] shadow-sm shadow-black/5"
                                        placeholder="Optional notes for this plan"
                                        placeholderTextColor="#94a3b8"
                                        multiline
                                        textAlignVertical="top"
                                        value={notes}
                                        onChangeText={setNotes}
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={handleAssignMeals}
                                    // className={`mt-6 py-5 rounded-3xl items-center shadow-xl ${assigning ? 'bg-gray-300' : 'bg-black shadow-black/30'}`}
                                    className={`py-4 rounded-2xl items-center mb-4 shadow-lg ${assigning
                                        ? 'bg-gray-300 shadow-gray-300'
                                        : 'bg-slate-900 shadow-black/30'
                                        }`}
                                    disabled={assigning}
                                >
                                    {assigning ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Text className="text-white font-extrabold text-base">Assign Selected Meals</Text>
                                    )}
                                </TouchableOpacity>

                                <View className="h-20" />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
