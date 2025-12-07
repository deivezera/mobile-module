import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          title: "Home"
        }}
      />
    </Tabs>
  );
}