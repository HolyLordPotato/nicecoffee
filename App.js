import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { light, dark } from "./theme";
import { AppContext } from "./AppContext";
import ShopsScreen from "./screens/ShopsScreen";
import MenuScreen from "./screens/MenuScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PaymentScreen from "./screens/PaymentScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const theme = isDark ? dark : light;

  const addToCart = (item) =>
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      return found
        ? prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
        : [...prev, { ...item, qty: 1 }];
    });

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((c) => c.id !== id));

  const ICONS = {
    Shops: "map-pin",
    Menu: "coffee",
    Cart: "shopping-bag",
    Profile: "user",
    Payment: "credit-card",
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        isDark,
        setIsDark,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        selectedShop,
        setSelectedShop,
      }}
    >
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.tab,
              borderTopColor: theme.border,
              height: 62,
            },
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.sub,
            tabBarLabelStyle: {
              fontFamily: "serif",
              fontSize: 11,
              marginBottom: 6,
            },
            tabBarIcon: ({ color, size }) => (
              <Feather name={ICONS[route.name]} size={size} color={color} />
            ),
          })}
        >
          <Tab.Screen name="Menu" component={MenuScreen} />
          <Tab.Screen name="Shops" component={ShopsScreen} />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              tabBarBadge: cart.reduce((s, c) => s + c.qty, 0) || undefined,
            }}
          />
          <Tab.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ tabBarButton: () => null }} // hides it from tab bar
          />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
