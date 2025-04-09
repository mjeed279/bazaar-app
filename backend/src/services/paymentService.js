import { MARKUP_PERCENTAGE } from '../utils/markupUtils';

/**
 * وحدة خدمة معالجة الدفع
 * تتعامل مع تكامل بوابات الدفع المختلفة وتطبيق هامش الربح
 */

const axios = require('axios');
const crypto = require('crypto');

// تكوين بوابات الدفع
const paymentGateways = {
  stripe: {
    apiKey: process.env.STRIPE_API_KEY || 'sk_test_example',
    publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_example',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_example',
  },
  mada: {
    merchantId: process.env.MADA_MERCHANT_ID || 'merchant_id_example',
    apiKey: process.env.MADA_API_KEY || 'api_key_example',
    environment: process.env.MADA_ENVIRONMENT || 'test',
  },
  applePay: {
    merchantId: process.env.APPLE_PAY_MERCHANT_ID || 'merchant_id_example',
    certificatePath: process.env.APPLE_PAY_CERTIFICATE_PATH || '/path/to/certificate',
    environment: process.env.APPLE_PAY_ENVIRONMENT || 'sandbox',
  },
  stcPay: {
    merchantId: process.env.STC_PAY_MERCHANT_ID || 'merchant_id_example',
    apiKey: process.env.STC_PAY_API_KEY || 'api_key_example',
    environment: process.env.STC_PAY_ENVIRONMENT || 'test',
  },
  tamara: {
    merchantId: process.env.TAMARA_MERCHANT_ID || 'merchant_id_example',
    apiKey: process.env.TAMARA_API_KEY || 'api_key_example',
    environment: process.env.TAMARA_ENVIRONMENT || 'sandbox',
  },
  tabby: {
    merchantId: process.env.TABBY_MERCHANT_ID || 'merchant_id_example',
    apiKey: process.env.TABBY_API_KEY || 'api_key_example',
    environment: process.env.TABBY_ENVIRONMENT || 'sandbox',
  }
};

/**
 * إنشاء جلسة دفع مع Stripe
 * @param {Object} order - بيانات الطلب
 * @returns {Promise<Object>} - بيانات جلسة الدفع
 */
const createStripeCheckoutSession = async (order) => {
  try {
    const stripe = require('stripe')(paymentGateways.stripe.apiKey);
    
    // تحويل عناصر الطلب إلى تنسيق Stripe
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'sar',
        product_data: {
          name: item.title,
          images: item.images ? [item.images[0]] : [],
        },
        unit_amount: Math.round(item.price * 100), // تحويل إلى أصغر وحدة (هللة)
      },
      quantity: item.quantity,
    }));
    
    // إضافة تكلفة الشحن كعنصر منفصل
    if (order.shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'sar',
          product_data: {
            name: 'تكلفة الشحن',
          },
          unit_amount: Math.round(order.shipping * 100),
        },
        quantity: 1,
      });
    }
    
    // إنشاء جلسة الدفع
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order.id,
        originalSubtotal: order.originalSubtotal, // للاستخدام الداخلي
        markup: order.markup, // للاستخدام الداخلي
      },
    });
    
    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('خطأ في إنشاء جلسة دفع Stripe:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * إنشاء طلب دفع مع مدى
 * @param {Object} order - بيانات الطلب
 * @returns {Promise<Object>} - بيانات طلب الدفع
 */
const createMadaPayment = async (order) => {
  try {
    // هذه محاكاة لتكامل مدى، يجب استبدالها بالتكامل الفعلي
    const apiUrl = paymentGateways.mada.environment === 'test' 
      ? 'https://api.test.mada.com/v1/payments' 
      : 'https://api.mada.com/v1/payments';
    
    const requestData = {
      merchantId: paymentGateways.mada.merchantId,
      amount: (order.subtotal + order.shipping).toFixed(2),
      currency: 'SAR',
      orderId: order.id,
      description: `طلب رقم ${order.id}`,
      callbackUrl: `${process.env.FRONTEND_URL}/checkout/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/cart`,
    };
    
    // توقيع الطلب
    const signature = crypto
      .createHmac('sha256', paymentGateways.mada.apiKey)
      .update(JSON.stringify(requestData))
      .digest('hex');
    
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${paymentGateways.mada.apiKey}`,
        'X-Signature': signature,
      },
    });
    
    return {
      success: true,
      paymentId: response.data.paymentId,
      checkoutUrl: response.data.checkoutUrl,
    };
  } catch (error) {
    console.error('خطأ في إنشاء طلب دفع مدى:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * إنشاء طلب دفع مع Apple Pay
 * @param {Object} order - بيانات الطلب
 * @returns {Promise<Object>} - بيانات طلب الدفع
 */
const createApplePayPayment = async (order) => {
  try {
    // هذه محاكاة لتكامل Apple Pay، يجب استبدالها بالتكامل الفعلي
    const apiUrl = paymentGateways.applePay.environment === 'sandbox' 
      ? 'https://apple-pay-gateway.sandbox.apple.com/paymentservices/startSession' 
      : 'https://apple-pay-gateway.apple.com/paymentservices/startSession';
    
    const requestData = {
      merchantIdentifier: paymentGateways.applePay.merchantId,
      domainName: process.env.FRONTEND_URL.replace(/^https?:\/\//, ''),
      displayName: 'Bazaar',
    };
    
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return {
      success: true,
      sessionId: response.data.sessionId,
      merchantSession: response.data.merchantSession,
    };
  } catch (error) {
    console.error('خطأ في إنشاء طلب دفع Apple Pay:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * إنشاء طلب دفع مع STC Pay
 * @param {Object} order - بيانات الطلب
 * @returns {Promise<Object>} - بيانات طلب الدفع
 */
const createStcPayPayment = async (order) => {
  try {
    // هذه محاكاة لتكامل STC Pay، يجب استبدالها بالتكامل الفعلي
    const apiUrl = paymentGateways.stcPay.environment === 'test' 
      ? 'https://api.test.stcpay.com.sa/v1/payments' 
      : 'https://api.stcpay.com.sa/v1/payments';
    
    const requestData = {
      merchantId: paymentGateways.stcPay.merchantId,
      amount: (order.subtotal + order.shipping).toFixed(2),
      currency: 'SAR',
      orderId: order.id,
      description: `طلب رقم ${order.id}`,
      callbackUrl: `${process.env.FRONTEND_URL}/checkout/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/cart`,
    };
    
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${paymentGateways.stcPay.apiKey}`,
      },
    });
    
    return {
      success: true,
      paymentId: response.data.paymentId,
      checkoutUrl: response.data.checkoutUrl,
    };
  } catch (error) {
    console.error('خطأ في إنشاء طلب دفع STC Pay:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * إنشاء طلب دفع مع Tamara (الدفع الآجل)
 * @param {Object} order - بيانات الطلب
 * @returns {Promise<Object>} - بيانات طلب الدفع
 */
const createTamaraPayment = async (order) => {
  try {
    // هذه محاكاة لتكامل Tamara، يجب استبدالها بالتكامل الفعلي
    const apiUrl = paymentGateways.tamara.environment === 'sandbox' 
      ? 'https://api.sandbox.tamara.co/checkout' 
      : 'https://api.tamara.co/checkout';
    
    const requestData = {
      merchantId: paymentGateways.tamara.merchantId,
      amount: (order.subtotal + order.shipping).toFixed(2),
      currency: 'SAR',
      orderId: order.id,
      description: `طلب رقم ${order.id}`,
      items: order.items.map(item => ({
        name: item.title,
        sku: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      shipping: {
        amount: order.shipping,
      },
      consumer: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        email: order.email,
        phone: order.phone,
      },
      shippingAddress: {
        line1: order.shippingAddress.address,
        city: order.shippingAddress.city,
        countryCode: 'SA',
      },
      callbackUrl: `${process.env.FRONTEND_URL}/checkout/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/cart`,
    };
    
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${paymentGateways.tamara.apiKey}`,
      },
    });
    
    return {
      success: true,
      checkoutId: response.data.checkoutId,
      checkoutUrl: response.data.checkoutUrl,
    };
  } catch (error) {
    console.error('خطأ في إنشاء طلب دفع Tamara:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * إنشاء طلب دفع مع Tabby (الدفع على أقساط)
 * @param {Object} order - بيانات الطلب
 * @returns {Promise<Object>} - بيانات طلب الدفع
 */
const createTabbyPayment = async (order) => {
  try {
    // هذه محاكاة لتكامل Tabby، يجب استبدالها بالتكامل الفعلي
    const apiUrl = paymentGateways.tabby.environment === 'sandbox' 
      ? 'https://api.tabby.ai/api/v1/checkout' 
      : 'https://api.tabby.ai/api/v1/checkout';
    
    const requestData = {
      merchantId: paymentGateways.tabby.merchantId,
      amount: (order.subtotal + order.shipping).toFixed(2),
      currency: 'SAR',
      orderId: order.id,
      description: `طلب رقم ${order.id}`,
      buyer: {
        email: order.email,
        phone: order.phone,
        name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      },
      shippingAddress: {
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        zip: order.shippingAddress.postalCode,
      },
      items: order.items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unitPrice: item.price,
        category: item.category,
      })),
      shipping: {
        amount: order.shipping,
      },
      successUrl: `${process.env.FRONTEND_URL}/checkout/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/cart`,
    };
    
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${paymentGateways.tabby.apiKey}`,
      },
    });
    
    return {
      success: true,
      sessionId: response.data.id,
      checkoutUrl: response.data.checkoutUrl,
    };
  } catch (error) {
    console.error('خطأ في إنشاء طلب دفع Tabby:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * إنشاء طلب دفع باستخدام بوابة الدفع المحددة
 * @param {Object} order - بيانات الطلب
 * @param {string} paymentMethod - طريقة الدفع (stripe, mada, applePay, stcPay, tamara, tabby)
 * @returns {Promise<Object>} - بيانات طلب الدفع
 */
const createPayment = async (order, paymentMethod) => {
  // التحقق من صحة البيانات
  if (!order || !order.items || !Array.isArray(order.items) || order.items.length === 0) {
    return {
      success: false,
      error: 'بيانات الطلب غير صالحة',
    };
  }
  
  // إضافة معلومات هامش الربح للتتبع الداخلي
  const orderWithMarkupInfo = {
    ...order,
    markupPercentage: MARKUP_PERCENTAGE,
  };
  
  // إنشاء طلب الدفع حسب طريقة الدفع المحددة
  switch (paymentMethod) {
    case 'stripe':
      return await createStripeCheckoutSession(orderWithMarkupInfo);
    
    case 'mada':
      return await createMadaPayment(orderWithMarkupInfo);
    
    case 'applePay':
      return await createApplePayPayment(orderWithMarkupInfo);
    
    case 'stcPay':
      return await createStcPayPayment(orderWithMarkupInfo);
    
    case 'tamara':
      return await createTamaraPayment(orderWithMarkupInfo);
    
    case 'tabby':
      return await createTabbyPayment(orderWithMarkupInfo);
    
    default:
      return {
        success: false,
        error: 'طريقة الدفع غير مدعومة',
      };
  }
};

/**
 * التحقق من حالة الدفع
 * @param {string} paymentId - معرف الدفع
 * @param {string} paymentMethod - طريقة الدفع
 * @returns {Promise<Object>} - حالة الدفع
 */
const checkPaymentStatus = async (paymentId, paymentMethod) => {
  try {
    switch (paymentMethod) {
      case 'stripe':
        const stripe = require('stripe')(paymentGateways.stripe.apiKey);
        const session = await stripe.checkout.sessions.retrieve(paymentId);
        
        return {
          success: true,
          status: session.payment_status,
          paid: session.payment_status === 'paid',
          metadata: session.metadata,
        };
      
      case 'mada':
        // التحقق من حالة الدفع مع مدى
        const madaApiUrl = paymentGateways.mada.environment === 'test' 
          ? `https://api.test.mada.com/v1/payments/${paymentId}` 
          : `https://api.mada.com/v1/payments/${paymentId}`;
        
        const madaResponse = await axios.get(madaApiUrl, {
          headers: {
            'Authorization': `Bearer ${paymentGateways.mada.apiKey}`,
          },
        });
        
        return {
          success: true,
          status: madaResponse.data.status,
          paid: madaResponse.data.status === 'COMPLETED',
        };
      
      case 'applePay':
        // التحقق من حالة الدفع مع Apple Pay
        // هذه محاكاة، يجب استبدالها بالتكامل الفعلي
        return {
          success: true,
          status: 'COMPLETED',
          paid: true,
        };
      
      case 'stcPay':
        // التحقق من حالة الدفع مع STC Pay
        const stcPayApiUrl = paymentGateways.stcPay.environment === 'test' 
          ? `https://api.test.stcpay.com.sa/v1/payments/${paymentId}` 
          : `https://api.stcpay.com.sa/v1/payments/${paymentId}`;
        
        const stcPayResponse = await axios.get(stcPayApiUrl, {
          headers: {
            'Authorization': `Bearer ${paymentGateways.stcPay.apiKey}`,
          },
        });
        
        return {
          success: true,
          status: stcPayResponse.data.status,
          paid: stcPayResponse.data.status === 'COMPLETED',
        };
      
      case 'tamara':
        // التحقق من حالة الدفع مع Tamara
        const tamaraApiUrl = paymentGateways.tamara.environment === 'sandbox' 
          ? `https://api.sandbox.tamara.co/checkout/${paymentId}` 
          : `https://api.tamara.co/checkout/${paymentId}`;
        
        const tamaraResponse = await axios.get(tamaraApiUrl, {
          headers: {
            'Authorization': `Bearer ${paymentGateways.tamara.apiKey}`,
          },
        });
        
        return {
          success: true,
          status: tamaraResponse.data.status,
          paid: tamaraResponse.data.status === 'APPROVED',
        };
      
      case 'tabby':
        // التحقق من حالة الدفع مع Tabby
        const tabbyApiUrl = paymentGateways.tabby.environment === 'sandbox' 
          ? `https://api.tabby.ai/api/v1/checkout/${paymentId}` 
          : `https://api.tabby.ai/api/v1/checkout/${paymentId}`;
        
        const tabbyResponse = await axios.get(tabbyApiUrl, {
          headers: {
            'Authorization': `Bearer ${paymentGateways.tabby.apiKey}`,
          },
        });
        
        return {
          success: true,
          status: tabbyResponse.data.status,
          paid: tabbyResponse.data.status === 'APPROVED',
        };
      
      default:
        return {
          success: false,
          error: 'طريقة الدفع غير مدعومة',
        };
    }
  } catch (error) {
    console.error(`خطأ في التحقق من حالة الدفع (${paymentMethod}):`, error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  createPayment,
  checkPaymentStatus,
  paymentGateways,
};
