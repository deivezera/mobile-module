import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, Link } from 'expo-router';
import { useScheduleStore } from '../../../store/useScheduleStore';
import { formatDistanceToNow } from 'date-fns';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from 'react';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const events = useScheduleStore((state) => state.events);
  const deleteEvent = useScheduleStore((state) => state.deleteEvent);

  const event = events.find((e) => e.id === id);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (event) {
      const updateTime = () => {
        setTimeRemaining(formatDistanceToNow(new Date(event.targetDate), { addSuffix: true }));
      };
      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [event]);

  if (!event) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Event not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteEvent(id as string);
            router.back();
          }
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Stack.Screen
        options={{
          title: 'Event Details',
          headerRight: () => (
            <Link href={`/(tabs)/home/add?id=${id}`} asChild>
              <Pressable className="mr-4">
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={24}
                    color="#007AFF"
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          )
        }}
      />

      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">{event.title}</Text>
        <Text className="text-blue-600 text-xl font-medium mb-4">{timeRemaining}</Text>

        <View className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <Text className="text-gray-500 text-sm mb-1">Target Date</Text>
          <Text className="text-gray-800 text-lg font-medium">
            {new Date(event.targetDate).toLocaleString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      {event.description ? (
        <View className="mb-8">
          <Text className="text-gray-900 font-semibold text-lg mb-2">Description</Text>
          <Text className="text-gray-600 text-base leading-relaxed">{event.description}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleDelete}
        className="bg-red-50 p-4 rounded-xl items-center border border-red-100 mt-auto"
      >
        <Text className="text-red-600 font-bold text-lg">Delete Event</Text>
      </Pressable>
    </ScrollView>
  );
}
