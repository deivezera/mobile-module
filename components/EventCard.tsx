import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { Event } from '../store/useScheduleStore';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const timeRemaining = formatDistanceToNow(new Date(event.targetDate), { addSuffix: true });

  return (
    <Link href={`/(tabs)/home/${event.id}`} asChild>
      <Pressable className="bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100 active:bg-gray-50">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">{event.title}</Text>
            <Text className="text-sm text-gray-500 mt-1">{new Date(event.targetDate).toLocaleString()}</Text>
          </View>
          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-600 text-xs font-medium">{timeRemaining}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
