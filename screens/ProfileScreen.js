import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppContext } from '../AppContext';
import Header from '../components/Header';
import axios from 'axios';
import { API_URL } from '../config';

export default function ProfileScreen() {
  const { theme, isDark, setIsDark } = useContext(AppContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/profile/1`) // example user id
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!profile) {
    return <Text style={{ color: theme.text }}>Loading...</Text>;
  }

  const stats = [
    { label: 'Orders', value: profile.orders ?? 0, icon: 'package' },
    { label: 'Saved', value: profile.saved ?? 0, icon: 'heart' },
    { label: 'Points', value: profile.points ?? 0, icon: 'star' },
  ];

  return (
    <View style={[s.wrap, { backgroundColor: theme.bg }]}>
      <Header title="Profile" />

      {/* Profile card */}
      <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Image source={{ uri: profile.avatar }} style={s.avatar} />
        <Text style={[s.name, { color: theme.text }]}>{profile.name}</Text>
        <Text style={[s.email, { color: theme.sub }]}>{profile.email}</Text>
      </View>

      {/* Stats row */}
      <View style={s.stats}>
        {stats.map(st => (
          <View
            key={st.label}
            style={[s.stat, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <Feather name={st.icon} size={20} color={theme.accent} />
            <Text style={[s.val, { color: theme.text }]}>{st.value}</Text>
            <Text style={[s.lbl, { color: theme.sub }]}>{st.label}</Text>
          </View>
        ))}
      </View>

      {/* Dark mode toggle */}
      <View style={[s.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Feather name={isDark ? 'moon' : 'sun'} size={18} color={theme.sub} />
        <Text style={[s.rowTxt, { color: theme.text }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={setIsDark}
          trackColor={{ true: theme.accent }}
          thumbColor="#FFF"
        />
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: { width: 92, height: 92, borderRadius: 46, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  email: { fontSize: 14, marginTop: 4 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 18 },
  stat: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  val: { fontSize: 20, fontWeight: '700' },
  lbl: { fontSize: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
  },
  rowTxt: { fontSize: 15, fontWeight: '600' },
});