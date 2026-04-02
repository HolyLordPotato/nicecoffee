import React, { useContext, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from "axios";
import { Feather } from '@expo/vector-icons';
import { AppContext } from '../AppContext';
import Header from '../components/Header';
import { useNavigation } from "@react-navigation/native";
import { API_URL } from '../config';

export default function CartScreen() {
  const { theme, cart, removeFromCart } = useContext(AppContext);
  const navigation = useNavigation();
  const [isPlacing, setIsPlacing] = useState(false);

  const total = cart.reduce(
    (sum, c) => sum + parseFloat(c.price) * c.qty,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Add items to your cart before placing an order.');
      return;
    }

    setIsPlacing(true);
    try {
      const res = await axios.post(`${API_URL}/orders`, {
        userId: 1, // replace with logged-in user id when auth is added
        cart,
      });
      const orderId = res.data.orderId;
      navigation.navigate("Payment", { orderId });
    } catch (err) {
      console.error(err);
      alert("Order failed. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };


  return (
    <View style={[s.wrap, { backgroundColor: theme.bg }]}>
      <Header title="Your Cart" />

      {cart.length === 0 ? (
        <View style={s.empty}>
          <Feather name="shopping-bag" size={48} color={theme.sub} />
          <Text style={[s.emptyTxt, { color: theme.sub }]}>
            Your cart is empty
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={i => i.id}
            contentContainerStyle={s.list}
            renderItem={({ item }) => (
              <View
                style={[
                  s.row,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Image source={{ uri: item.img }} style={s.img} />
                <View style={s.info}>
                  <Text style={[s.name, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[s.price, { color: theme.accent }]}>
                    ${(parseFloat(item.price) * item.qty).toFixed(2)}
                  </Text>
                  <Text style={[s.qty, { color: theme.sub }]}>
                    Qty: {item.qty}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Feather name="trash-2" size={18} color={theme.sub} />
                </TouchableOpacity>
              </View>
            )}
          />

          <View
            style={[
              s.footer,
              { backgroundColor: theme.surface, borderTopColor: theme.border },
            ]}
          >
            <Text style={[s.total, { color: theme.text }]}>
              Total{' '}
              <Text style={{ color: theme.accent }}>
                ${total.toFixed(2)}
              </Text>
            </Text>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: theme.accent }]}
              onPress={placeOrder}
              disabled={cart.length === 0 || isPlacing}
            >
              <Text style={s.btnTxt}>{isPlacing ? 'Placing order...' : 'Place Order'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTxt: { fontSize: 16, fontWeight: '500' },
  list: { padding: 12, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  img: { width: 64, height: 64, borderRadius: 8 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600' },
  price: { fontSize: 14, fontWeight: '500' },
  qty: { fontSize: 13 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderFooter: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  total: { fontSize: 16, fontWeight: '600' },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  btnTxt: { color: '#FFF', fontWeight: '600' },
});
