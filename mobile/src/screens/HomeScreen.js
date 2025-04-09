import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import FeaturedProducts from '../components/FeaturedProducts';
import { fetchFeaturedProducts, fetchCategories } from '../api/api';

const HomeScreen = ({ navigation }) => {
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // جلب المنتجات المميزة
        const productsData = await fetchFeaturedProducts();
        setFeaturedProducts(productsData);
        
        // جلب الفئات
        const categoriesData = await fetchCategories();
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (searchTerm) => {
    navigation.navigate('Search', { query: searchTerm });
  };

  const handleSelectCategory = (categoryId) => {
    if (categoryId === 'all') {
      navigation.navigate('Categories');
    } else {
      navigation.navigate('CategoryProducts', { categoryId });
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Header navigation={navigation} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar onSearch={handleSearch} />
        
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>تسوق بأفضل الأسعار</Text>
          <Text style={styles.bannerSubtitle}>اكتشف آلاف المنتجات من علي إكسبريس</Text>
        </View>
        
        <CategoryList 
          categories={categories} 
          onSelectCategory={handleSelectCategory} 
        />
        
        <FeaturedProducts 
          title="منتجات مميزة"
          products={featuredProducts} 
          loading={loading}
          onProductPress={handleProductPress}
        />
        
        <FeaturedProducts 
          title="الأكثر مبيعاً"
          products={featuredProducts.slice().reverse()} 
          loading={loading}
          onProductPress={handleProductPress}
        />
        
        <FeaturedProducts 
          title="وصل حديثاً"
          products={featuredProducts.slice(2, 8)} 
          loading={loading}
          onProductPress={handleProductPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  banner: {
    backgroundColor: '#0EA5E9',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
});

export default HomeScreen;
