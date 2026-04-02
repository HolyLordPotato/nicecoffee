import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppContext } from "../AppContext";

export default function Header({ title }) {
  const { theme, isDark, setIsDark } = useContext(AppContext);

  return (
    <View style={[s.wrap, { backgroundColor: theme.bg }]}> 
      <Text style={[s.title, { color: theme.text }]}>{title}</Text>
      <TouchableOpacity onPress={() => setIsDark((d) => !d)}>
        <Feather name={isDark ? "sun" : "moon"} size={20} color={theme.sub} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingTop: StatusBar.currentHeight + 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "serif",
  },
});

