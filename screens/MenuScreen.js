import React, { useContext, useState, useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppContext } from "../AppContext";
import Header from "../components/Header";
import CoffeeCard from "../components/CoffeeCard";
import axios from "axios";
import { API_URL } from "../config";

const CATEGORIES = ["All", "Espresso", "Latte", "Cold Brew", "Tea"];

export default function MenuScreen({ navigation }) {
  const { theme, selectedShop } = useContext(AppContext);
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const url = selectedShop
      ? `${API_URL}/shops/${selectedShop.id}/menu`
      : `${API_URL}/menu`;

    axios.get(url)
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, [selectedShop]);

  const filtered = items
    .filter((i) => cat === "All" || i.cat === cat)
    .filter(
      (i) =>
        i.name.toLowerCase().includes(query.toLowerCase()) ||
        i.desc.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <View style={[s.wrap, { backgroundColor: theme.bg }]}>
      <Header title={selectedShop ? selectedShop.name : "All Menu"} />

      {/* Shop context bar */}
      {selectedShop ? (
        <View
          style={[
            s.shopBar,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Feather name="map-pin" size={13} color={theme.accent} />
          <Text style={[s.shopBarTxt, { color: theme.sub }]}>
            {selectedShop.area} · {selectedShop.tag}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Shops")}>
            <Text style={[s.changeBtn, { color: theme.accent }]}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            s.shopBar,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={() => navigation.navigate("Shops")}
        >
          <Feather name="map-pin" size={13} color={theme.accent} />
          <Text style={[s.shopBarTxt, { color: theme.sub }]}>
            Showing all shops
          </Text>
          <Text style={[s.changeBtn, { color: theme.accent }]}>
            Pick a shop
          </Text>
        </TouchableOpacity>
      )}

      {/* Search */}
      <View
        style={[
          s.searchBox,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Feather name="search" size={15} color={theme.sub} />
        <TextInput
          style={[s.input, { color: theme.text }]}
          placeholder="Search drinks..."
          placeholderTextColor={theme.sub}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Feather name="x" size={15} color={theme.sub} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category chips */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.cats}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              s.chip,
              {
                backgroundColor: item === cat ? theme.accent : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setCat(item)}
          >
            <Text
              style={{
                color: item === cat ? "#FFF" : theme.sub,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Count */}
      <Text style={[s.count, { color: theme.sub }]}>
        {filtered.length} drinks
      </Text>

      {/* Grid */}
      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Feather name="coffee" size={40} color={theme.sub} />
          <Text style={[s.emptyTxt, { color: theme.sub }]}>
            No drinks found
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          numColumns={2}
          columnWrapperStyle={s.cols}
          contentContainerStyle={s.list}
          renderItem={({ item }) => (
            <View style={s.col}>
              <CoffeeCard item={item} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1 },
  shopBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  shopBarTxt: { flex: 1, fontSize: 13 },
  changeBtn: { fontSize: 13, fontWeight: "700" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  input: { flex: 1, fontSize: 14, fontFamily: "serif" },
  cats: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, height: 60},
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  count: { fontSize: 12, marginLeft: 18, marginBottom: 6 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  emptyTxt: { fontSize: 15, fontFamily: "serif" },
  list: { padding: 12, paddingBottom: 24 },
  cols: { gap: 10 },
  col: { flex: 1 },
});
