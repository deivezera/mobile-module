import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useScheduleStore } from '../../../store/useScheduleStore';

export default function AddEventScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const events = useScheduleStore((state) => state.events);
  const addEvent = useScheduleStore((state) => state.addEvent);
  const updateEvent = useScheduleStore((state) => state.updateEvent);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (id) {
      const event = events.find((e) => e.id === id);
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setDate(new Date(event.targetDate));
      }
    }
  }, [id, events]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (id) {
      await updateEvent(id as string, title, date, description);
    } else {
      await addEvent(title, date, description);
    }
    router.back();
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDate = date;
      currentDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(new Date(currentDate));
    }
  };

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const currentDate = date;
      currentDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setDate(new Date(currentDate));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Stack.Screen options={{ title: id ? 'Edit Event' : 'Add Event' }} />

      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-1">Title</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-lg"
          placeholder="Event Title"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 font-medium mb-1">Description</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-base h-24"
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 font-medium mb-2">Date & Time</Text>
        <View className="flex-row space-x-4">
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-1 bg-gray-100 p-3 rounded-lg items-center"
          >
            <Text className="text-blue-600 font-medium">{date.toLocaleDateString()}</Text>
          </Pressable>
          <Pressable
            onPress={() => setShowTimePicker(true)}
            className="flex-1 bg-gray-100 p-3 rounded-lg items-center"
          >
            <Text className="text-blue-600 font-medium">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </Pressable>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>

      <View className="flex-row space-x-4 mt-4">
        <Pressable
          onPress={() => router.back()}
          className="flex-1 bg-gray-200 p-4 rounded-xl items-center"
        >
          <Text className="text-gray-700 font-bold text-lg">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          className="flex-1 bg-blue-600 p-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-lg">Save</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
