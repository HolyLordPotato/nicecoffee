import React, { useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { AppContext } from "../AppContext";
import { API_URL } from "../config";

export default function PaymentScreen({ route }) {
  const { cart, theme, removeFromCart, setCart } = useContext(AppContext);
  const { orderId } = route.params || {};

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePayment = async () => {
    if (!orderId) {
      alert('No order found. Please place an order first.');
      return;
    }

    try {
      await axios.post(`${API_URL}/payment`, {
        orderId,
        status: "paid",
      });
      setCart([]);
      alert("Payment successful!");
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Checkout</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderColor: theme.border }]}>
            <Text style={[styles.itemText, { color: theme.text }]}>
              {item.name} x {item.qty}
            </Text>
            <Text style={[styles.itemText, { color: theme.sub }]}>
              ${item.price * item.qty}
            </Text>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Text style={{ color: theme.accent }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={[styles.total, { color: theme.text }]}>
          Total: ${total.toFixed(2)}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={handlePayment}
        >
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  itemText: { fontSize: 16 },
  footer: {
    marginTop: "auto",
    paddingTop: 16,
    borderTopWidth: 1,
  },
  total: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  button: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
