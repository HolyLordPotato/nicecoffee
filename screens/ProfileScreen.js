import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppContext } from '../App';
import Header from '../components/Header';
import axios from 'axios';

const API_URL = "http://localhost:3000";

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
    { label: 'Orders', value: profile.orders, icon: 'package' },
    { label: 'Saved', value: profile.saved, icon: 'heart' },
    { label: 'Points', value: profile.points, icon: 'star' },
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
