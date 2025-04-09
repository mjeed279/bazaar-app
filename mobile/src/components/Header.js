import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
        <Icon name="bars" size={24} color="#333" />
      </TouchableOpacity>
      
      <Text style={styles.logo}>Bazaar</Text>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Cart')} 
        style={styles.cartButton}
      >
        <Icon name="shopping-cart" size={24} color="#333" />
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>0</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuButton: {
    padding: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EC4899',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
