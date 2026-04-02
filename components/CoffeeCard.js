import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppContext } from '../AppContext';

export default function CoffeeCard({ item }) {
  const { theme, addToCart } = useContext(AppContext);

  return (
    <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.img }} style={s.img} />
      <View style={s.body}>
        <Text style={[s.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[s.desc, { color: theme.sub }]}>{item.desc}</Text>
        <View style={s.row}>
          <Text style={[s.price, { color: theme.accent }]}>${item.price}</Text>
          <TouchableOpacity
            style={[s.btn, { backgroundColor: theme.accent }]}
            onPress={() => addToCart(item)}
          >
            <Feather name="plus" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 4,
  },
  img: { width: '100%', height: 130 },
  body: { padding: 12 },
  name: { fontSize: 15, fontWeight: '700', fontFamily: 'serif' },
  desc: { fontSize: 12, marginTop: 2, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { fontSize: 16, fontWeight: '800' },
  btn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
