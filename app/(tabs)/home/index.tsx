import { View, FlatList, Text } from 'react-native';
import { useScheduleStore } from '../../../store/useScheduleStore';
import EventCard from '../../../components/EventCard';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../../../utils/notifications';

export default function HomeScreen() {
  const events = useScheduleStore((state) => state.events);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {events.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">No upcoming events</Text>
          <Text className="text-gray-400 mt-2">Tap + to add one</Text>
        </View>
      ) : (
        <FlatList
          data={events.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard event={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}