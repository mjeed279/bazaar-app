import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProductCard = ({ product, onPress }) => {
  const discount = product.originalPrice > 0 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image 
            source={{ uri: product.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>لا توجد صورة</Text>
          </View>
        )}
        
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>خصم {discount}%</Text>
          </View>
        )}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {product.title}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {product.price.toFixed(2)} {product.currency}
          </Text>
          
          {discount > 0 && (
            <Text style={styles.originalPrice}>
              {product.originalPrice.toFixed(2)} {product.currency}
            </Text>
          )}
        </View>
        
        {product.rating && (
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            
            {product.totalOrders && (
              <Text style={styles.ordersText}>({product.totalOrders}+ طلب)</Text>
            )}
          </View>
        )}
        
        <TouchableOpacity style={styles.addToCartButton}>
          <Icon name="shopping-cart" size={14} color="#FFFFFF" style={styles.cartIcon} />
          <Text style={styles.addToCartText}>إضافة للسلة</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 8,
    flex: 1,
  },
  imageContainer: {
    height: 150,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EC4899',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
    height: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  originalPrice: {
    fontSize: 12,
    color: '#A0A0A0',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  ordersText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginLeft: 4,
  },
  addToCartButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProductCard;
