import { Stack } from "expo-router";
import { Pressable } from "react-native";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Important Dates",
          headerRight: () => (
            <Link href="/(tabs)/home/add" asChild>
              <Pressable className="mr-4">
                {({ pressed }) => (
                  <FontAwesome
                    name="plus"
                    size={24}
                    color="#007AFF"
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="add" options={{ title: "Add Event", presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: "Event Details" }} />
    </Stack>
  );
}