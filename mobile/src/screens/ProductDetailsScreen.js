import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import { getProductDetails } from '../api/api';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setLoading(true);
        const productData = await getProductDetails(productId);
        setProduct(productData);
        setLoading(false);
      } catch (error) {
        console.error('خطأ في تحميل تفاصيل المنتج:', error);
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    // إضافة المنتج إلى سلة التسوق
    navigation.navigate('Cart');
  };

  const handleBuyNow = () => {
    // الانتقال مباشرة إلى صفحة الدفع
    navigation.navigate('Checkout');
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText}>جاري تحميل تفاصيل المنتج...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation} />
        <View style={styles.errorContainer}>
          <Icon name="exclamation-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>عذراً، لم يتم العثور على المنتج</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>العودة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // بيانات المنتج الافتراضية للعرض
  const dummyProduct = {
    id: productId,
    title: 'سماعات بلوتوث لاسلكية مع إلغاء الضوضاء النشط',
    price: 349.99,
    originalPrice: 499.99,
    currency: 'ر.س',
    rating: 4.7,
    totalOrders: 1250,
    description: 'سماعات بلوتوث لاسلكية مع تقنية إلغاء الضوضاء النشط، وجودة صوت عالية، وبطارية تدوم طويلاً. مثالية للاستخدام اليومي والسفر والرياضة.',
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
    ],
    specifications: [
      { name: 'البطارية', value: '30 ساعة' },
      { name: 'البلوتوث', value: 'الإصدار 5.0' },
      { name: 'مقاومة الماء', value: 'IPX4' },
      { name: 'الوزن', value: '250 جرام' },
    ],
    colors: ['أسود', 'أبيض', 'أزرق'],
    shipping: {
      price: 25,
      estimatedDelivery: '7-14 يوم',
    },
  };

  // استخدام البيانات الافتراضية إذا لم تكن بيانات المنتج متوفرة
  const displayProduct = product || dummyProduct;

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* صور المنتج */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: displayProduct.images?.[selectedImage] || 'https://via.placeholder.com/400' }} 
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {/* معرض الصور المصغرة */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsContainer}
          >
            {(displayProduct.images || []).map((image, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.thumbnailButton,
                  selectedImage === index && styles.selectedThumbnail
                ]}
                onPress={() => setSelectedImage(index)}
              >
                <Image 
                  source={{ uri: image || 'https://via.placeholder.com/100' }} 
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* تفاصيل المنتج */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{displayProduct.title}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {displayProduct.price.toFixed(2)} {displayProduct.currency}
            </Text>
            
            {displayProduct.originalPrice > 0 && (
              <Text style={styles.originalPrice}>
                {displayProduct.originalPrice.toFixed(2)} {displayProduct.currency}
              </Text>
            )}
            
            {displayProduct.originalPrice > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  خصم {Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100)}%
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{displayProduct.rating}</Text>
            <Text style={styles.ordersText}>({displayProduct.totalOrders}+ طلب)</Text>
          </View>
          
          {/* الوصف */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الوصف</Text>
            <Text style={styles.description}>{displayProduct.description}</Text>
          </View>
          
          {/* المواصفات */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المواصفات</Text>
            {(displayProduct.specifications || []).map((spec, index) => (
              <View key={index} style={styles.specificationRow}>
                <Text style={styles.specificationName}>{spec.name}</Text>
                <Text style={styles.specificationValue}>{spec.value}</Text>
              </View>
            ))}
          </View>
          
          {/* الألوان */}
          {displayProduct.colors && displayProduct.colors.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الألوان المتاحة</Text>
              <View style={styles.colorsContainer}>
                {displayProduct.colors.map((color, index) => (
                  <View key={index} style={styles.colorItem}>
                    <Text style={styles.colorText}>{color}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* الشحن */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الشحن</Text>
            <View style={styles.shippingInfo}>
              <Text style={styles.shippingPrice}>
                تكلفة الشحن: {displayProduct.shipping?.price || 0} {displayProduct.currency}
              </Text>
              <Text style={styles.deliveryTime}>
                وقت التوصيل المتوقع: {displayProduct.shipping?.estimatedDelivery || '7-14 يوم'}
              </Text>
            </View>
          </View>
          
          {/* الكمية */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الكمية</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={decrementQuantity}
              >
                <Icon name="minus" size={16} color="#333333" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Icon name="plus" size={16} color="#333333" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* أزرار الشراء */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Icon name="shopping-cart" size={18} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>إضافة للسلة</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.buyNowButton}
          onPress={handleBuyNow}
        >
          <Icon name="bolt" size={18} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>شراء الآن</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  thumbnailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  thumbnailButton: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  selectedThumbnail: {
    borderColor: '#0EA5E9',
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discountBadge: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  ordersText: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 8,
  },
  section: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  specificationName: {
    fontSize: 14,
    color: '#666666',
  },
  specificationValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  colorText: {
    fontSize: 14,
    color: '#333333',
  },
  shippingInfo: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  shippingPrice: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#EC4899',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;
