import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';

const CheckoutScreen = ({ navigation, route }) => {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'creditCard',
  });

  const [errors, setErrors] = React.useState({});

  const updateFormField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // إزالة الخطأ عند تحديث الحقل
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'المدينة مطلوبة';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'الرمز البريدي مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (validateForm()) {
      // إنشاء الطلب وإرساله إلى الخادم
      // ثم الانتقال إلى صفحة نجاح الطلب
      navigation.navigate('OrderSuccess', { orderId: 'ORD-' + Math.floor(Math.random() * 1000000) });
    }
  };

  // بيانات ملخص الطلب الافتراضية
  const orderSummary = {
    subtotal: 749.97,
    shipping: 25,
    total: 774.97,
    currency: 'ر.س',
    items: [
      {
        id: '1',
        title: 'سماعات بلوتوث لاسلكية مع إلغاء الضوضاء النشط',
        price: 349.99,
        quantity: 1,
      },
      {
        id: '2',
        title: 'ساعة ذكية مقاومة للماء مع قياس معدل ضربات القلب',
        price: 199.99,
        quantity: 2,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      
      <ScrollView style={styles.content}>
        <Text style={styles.title}>إتمام الطلب</Text>
        
        {/* معلومات الشحن */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات الشحن</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>الاسم الكامل</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              value={formData.fullName}
              onChangeText={(text) => updateFormField('fullName', text)}
              placeholder="أدخل الاسم الكامل"
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => updateFormField('email', text)}
              placeholder="أدخل البريد الإلكتروني"
              keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>رقم الهاتف</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={(text) => updateFormField('phone', text)}
              placeholder="أدخل رقم الهاتف"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>العنوان</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={formData.address}
              onChangeText={(text) => updateFormField('address', text)}
              placeholder="أدخل العنوان"
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>المدينة</Text>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                value={formData.city}
                onChangeText={(text) => updateFormField('city', text)}
                placeholder="المدينة"
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>الرمز البريدي</Text>
              <TextInput
                style={[styles.input, errors.postalCode && styles.inputError]}
                value={formData.postalCode}
                onChangeText={(text) => updateFormField('postalCode', text)}
                placeholder="الرمز البريدي"
                keyboardType="numeric"
              />
              {errors.postalCode && <Text style={styles.errorText}>{errors.postalCode}</Text>}
            </View>
          </View>
        </View>
        
        {/* طرق الدفع */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>طريقة الدفع</Text>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              formData.paymentMethod === 'creditCard' && styles.selectedPaymentOption
            ]}
            onPress={() => updateFormField('paymentMethod', 'creditCard')}
          >
            <Icon 
              name="credit-card" 
              size={24} 
              color={formData.paymentMethod === 'creditCard' ? '#0EA5E9' : '#666666'} 
            />
            <Text style={[
              styles.paymentOptionText,
              formData.paymentMethod === 'creditCard' && styles.selectedPaymentOptionText
            ]}>
              بطاقة ائتمان
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              formData.paymentMethod === 'applePay' && styles.selectedPaymentOption
            ]}
            onPress={() => updateFormField('paymentMethod', 'applePay')}
          >
            <Icon 
              name="apple" 
              size={24} 
              color={formData.paymentMethod === 'applePay' ? '#0EA5E9' : '#666666'} 
            />
            <Text style={[
              styles.paymentOptionText,
              formData.paymentMethod === 'applePay' && styles.selectedPaymentOptionText
            ]}>
              Apple Pay
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              formData.paymentMethod === 'paypal' && styles.selectedPaymentOption
            ]}
            onPress={() => updateFormField('paymentMethod', 'paypal')}
          >
            <Icon 
              name="paypal" 
              size={24} 
              color={formData.paymentMethod === 'paypal' ? '#0EA5E9' : '#666666'} 
            />
            <Text style={[
              styles.paymentOptionText,
              formData.paymentMethod === 'paypal' && styles.selectedPaymentOptionText
            ]}>
              PayPal
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              formData.paymentMethod === 'cod' && styles.selectedPaymentOption
            ]}
            onPress={() => updateFormField('paymentMethod', 'cod')}
          >
            <Icon 
              name="money" 
              size={24} 
              color={formData.paymentMethod === 'cod' ? '#0EA5E9' : '#666666'} 
            />
            <Text style={[
              styles.paymentOptionText,
              formData.paymentMethod === 'cod' && styles.selectedPaymentOptionText
            ]}>
              الدفع عند الاستلام
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* ملخص الطلب */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ملخص الطلب</Text>
          
          {orderSummary.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemTitle} numberOfLines={1}>
                {item.title} × {item.quantity}
              </Text>
              <Text style={styles.orderItemPrice}>
                {(item.price * item.quantity).toFixed(2)} {orderSummary.currency}
              </Text>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>المجموع الفرعي:</Text>
            <Text style={styles.summaryValue}>
              {orderSummary.subtotal.toFixed(2)} {orderSummary.currency}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>الشحن:</Text>
            <Text style={styles.summaryValue}>
              {orderSummary.shipping.toFixed(2)} {orderSummary.currency}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>الإجمالي:</Text>
            <Text style={styles.totalValue}>
              {orderSummary.total.toFixed(2)} {orderSummary.currency}
            </Text>
          </View>
        </View>
        
        {/* زر إتمام الطلب */}
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderButtonText}>إتمام الطلب</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.backToCartButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToCartButtonText}>العودة إلى سلة التسوق</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333333',
    textAlign: 'right',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPaymentOption: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 12,
  },
  selectedPaymentOptionText: {
    color: '#0EA5E9',
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  orderItemTitle: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    marginRight: 8,
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  placeOrderButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToCartButton: {
    borderWidth: 1,
    borderColor: '#0EA5E9',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  backToCartButtonText: {
    color: '#0EA5E9',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CheckoutScreen;
