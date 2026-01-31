import dayjs from 'dayjs';
import { Calendar, Check } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import { assignWorkout, fetchWorkouts } from '../src/store/slices/workoutSlice';

interface WorkoutPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    clientName: string;
}

export default function WorkoutPlannerModal({ isOpen, onClose, clientId, clientName }: WorkoutPlannerModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const { workouts, loading: searchLoading, assigning } = useSelector((state: RootState) => state.workouts);
    const { selectedClient, clientHealth } = useSelector((state: RootState) => state.clients);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchWorkouts(''));
        }
    }, [isOpen]);

    const handleSearch = () => {
        dispatch(fetchWorkouts(searchQuery));
    };

    const toggleWorkoutSelection = (workout: any) => {
        const index = selectedWorkouts.findIndex(w => w.id === workout.id);
        if (index > -1) {
            setSelectedWorkouts(selectedWorkouts.filter(w => w.id !== workout.id));
        } else {
            setSelectedWorkouts([...selectedWorkouts, workout]);
        }
    };

    const handleAssignWorkouts = async () => {
        if (selectedWorkouts.length === 0) {
            Alert.alert('Selection Required', 'Please select at least one workout.');
            return;
        }

        const payload = {
            workoutIds: selectedWorkouts.map(w => w.id),
            duration: duration,
            notes: notes,
            weekStart: dayjs(selectedDate).startOf('week').format('YYYY-MM-DD'),
            dayOfWeek: dayjs(selectedDate).day(),
            applyToWeek: false
        };

        try {
            await dispatch(assignWorkout({ clientId, data: payload })).unwrap();
            Alert.alert('Success', 'Workouts assigned successfully!');
            setSelectedWorkouts([]);
            setDuration('');
            setNotes('');
            setSearchQuery('');
            dispatch(fetchClientDetail(clientId));
        } catch (error: any) {
            Alert.alert('Error', error || 'Failed to assign workouts');
        }
    };

    // Extract assigned workouts for the selected day from the client's current plan
    const workoutPlan = selectedClient?.workoutPlan;
    const workoutPlanItems = Array.isArray(workoutPlan?.items) ? workoutPlan.items : [];

    const assignedForDay = workoutPlanItems.filter((item: any) => {
        const targetDay = dayjs(selectedDate).day();
        return item.dayOfWeek === targetDay;
    });

    const renderWorkoutItem = (workout: any) => {
        const isSelected = selectedWorkouts.some(w => w.id === workout.id);
        return (
            <TouchableOpacity
                key={workout.id}
                onPress={() => toggleWorkoutSelection(workout)}
                className={`flex-row items-center p-4 mb-3 rounded-2xl border ${isSelected ? 'border-teal-500 bg-teal-50' : 'border-gray-100 bg-white'}`}
            >
                <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-sm">{workout.workoutName}</Text>
                    <Text className="text-gray-500 text-[10px]">{workout.category}</Text>
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
                    style={{ height: '94%' }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50">
                        <View>
                            <Text className="text-2xl font-extrabold text-gray-900 tracking-tight">Daily Workout Planner</Text>
                            <Text className="text-gray-400 text-xs mt-0.5">Assign workouts for a specific date.</Text>
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

                        {/* Assigned Workouts List */}
                        <View className="px-6 mb-6">
                            {assignedForDay.map((item: any, idx: number) => (
                                <View key={idx} className="bg-white border border-gray-100 p-4 rounded-2xl flex-row items-center justify-between mb-2">
                                    <Text className="text-gray-800 font-bold text-sm">{item.workoutName}</Text>
                                    <View className="bg-orange-50 px-3 py-1 rounded-lg">
                                        <Text className="text-orange-600 font-bold text-[10px] uppercase">Assigned</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View className="px-6 pb-20">
                            <Text className="text-gray-900 font-bold text-sm mb-1">Selected: {dayjs(selectedDate).format('MMM D, YYYY')}</Text>
                            <Text className="text-[10px] text-gray-500 mb-5">Assign workouts for this date.</Text>

                            <View className="mb-6">
                                <Text className="text-xs font-bold text-gray-800 mb-2">Search workouts</Text>
                                <View className="bg-white border border-gray-200 rounded-2xl px-4 h-12 mb-3 shadow-sm shadow-black/5 flex-row items-center">
                                    <TextInput
                                        className="flex-1 text-sm font-medium"
                                        placeholder="Search workout items"
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
                                        <Text className="text-white font-bold text-sm">Search Workouts</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {workouts.length > 0 && (
                                <View className="mb-6">
                                    <Text className="text-xs font-bold text-gray-800 mb-3">Results</Text>
                                    <View>
                                        {workouts.map(renderWorkoutItem)}
                                    </View>
                                </View>
                            )}

                            <View className="mb-6">
                                <Text className="text-xs font-bold text-gray-800 mb-2">Duration (minutes)</Text>
                                <TextInput
                                    className="bg-white border border-gray-200 rounded-2xl px-4 h-12 shadow-sm shadow-black/5"
                                    placeholder="e.g. 30"
                                    keyboardType="numeric"
                                    value={duration}
                                    onChangeText={setDuration}
                                />
                            </View>

                            <View>
                                <Text className="text-xs font-bold text-gray-800 mb-2">Notes</Text>
                                <TextInput
                                    className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm min-h-[100px] shadow-sm shadow-black/5"
                                    placeholder="Optional notes for this plan"
                                    multiline
                                    textAlignVertical="top"
                                    value={notes}
                                    onChangeText={setNotes}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleAssignWorkouts}
                                className={`py-4 rounded-2xl items-center mb-4 shadow-lg ${assigning
                                    ? 'bg-gray-300 shadow-gray-300'
                                    : 'bg-slate-900 shadow-black/30'
                                    }`}
                                disabled={assigning}
                            >
                                {assigning ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text className="text-white font-extrabold text-base">Assign Selected Workouts</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
