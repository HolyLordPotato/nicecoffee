import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppContext } from "../App";
import Header from "../components/Header";
import axios from "axios";

const API_URL = "http://localhost:3000";

export default function ShopsScreen({ navigation }) {
  const { theme, selectedShop, setSelectedShop } = useContext(AppContext);
  const [query, setQuery] = useState("");
  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/shops`)
      .then(res => setShops(res.data))
      .catch(err => console.error(err));
  }, []);

  const filtered = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.area.toLowerCase().includes(query.toLowerCase()) ||
      s.tag.toLowerCase().includes(query.toLowerCase())
  );

  const pick = (shop) => {
    setSelectedShop(shop);
    navigation.navigate("Menu");
  };

    return (
        <View style={[s.wrap, { backgroundColor: theme.bg }]}>
            <Header title="Coffee Shops" />
            <View style={s.search}>
                <Feather name="search" size={16} color={theme.sub} />
                <TextInput
                    style={[s.input, { color: theme.text } ]}
                    placeholder = "Search by name, area, style..."
                    placeholderTextColor={theme.sub}
                    value={query}
                    onChangeText={setQuery}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery("")}>
                        <Feather name="x" size={16} color={theme.sub} />
                    </TouchableOpacity>
                )}
                
            </View>

            {/* Selected badge */}
            {selectedShop && (
                <View style={[
                    s.badge,
                    { backgroundColor: theme.surfece, borderColor: theme.accent },
                ]}
            >
                <Feather name="check-circle" size={14} color={theme.accent} />
                <Text style={[s.badgeText, { color: theme.accent }]}>
                    Ordering from {selectedShop.name}
                </Text>
                <TouchableOpacity onPress={() => setSelectedShop(null)}>
                    <Feather name="x" size={14} color={theme.sub} />
                </TouchableOpacity>
            </View>
            )}

            <FlatList
                data={filtered}
                keyExtractor={(i) => i.id}
                contentContainerStyle={s.list}
                renderItem={({ item }) => {
                    const active = selectedShop?.id === item.id;
                    return (
                        <TouchableOpacity
                            style={[
                                s.card,
                                {
                                    backgroundColor: theme.card,
                                    borderColor: active ? theme.accent : theme.border,
                                    borderWidth: active ? 2 : 1,
                                },
                            ]}
                            onPress={() => pick(item)}
                            activeOpacity={0.85}
                            >
                            <Image source={{ uri: item.img }} style={s.img} />
                            <View style={s.overlay} />
                            {active && (
                                <View style={[s.activePill, { backgroundColor: theme.accent}]}>
                                    <Feather name="check" size={12} color="#FFF" />
                                    <Text style={s.activeText}>Selected</Text>
                                </View>
                            )}
                            <View style={s.info}>
                                <View style={s.row}>
                                    <Text style={s.name}>{item.name}</Text>
                                    <View style={s.ratingBox}>
                                        <Feather name="star" size={12} color="#F5C842" />
                                        <Text style={s.rating}>{item.rating}</Text>
                                    </View>
                                </View>
                                <Text style={s.tag}>{item.tag}</Text>
                                <View style={s.meta}>
                                    <Feather 
                                        name="clock"
                                        size={12}
                                        color="rgba(255,255,255,0.7)"
                                        style={{ marginLeft: 10 }}
                                    />
                                    <Text style={s.metaText}>{item.mins} min</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

const s = StyleSheet.create({
    wrap: { flex: 1 },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginTop: 14,
        marginBottom: 8,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 10,
    },
    input: { flex: 1, fontSize: 14, fontFamily: "serif" },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 10,
        borderWidth: 1,
        gap: 8,
    },
    badgeTxt: {flex: 1, fontSize: 13, fontWeight: "600" },
    list: { padding: 16, gap: 14, paddingBottom: 24 },
    card: { borderRadius: 18, overflow: "hidden", position: "absolute" },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.42)",
    },
    activePill: {
        position: "absolute",
        top: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 4,
    },
    activeTxt: { color: "#FFF", fontSize: 12, fontWeight: "700" },
    info: { position: "absolute", bottom: 0, width: "100%", padding: 14, },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: { color: "#FFF", fontSize: 20, fontWeight: "800" },
    ratingBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(0,0,0,0.45)",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    rating: { color: "#FFF", fontSize: 13, fontWeight: "700" },
    tag: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 12,
        marginTop: 2,
        fontStyle: "italic",
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
        gap: 4, },
    metaTxt: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
});
