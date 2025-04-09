import { transformOrderToAliexpress } from '../utils/markupUtils';
import { createPayment, checkPaymentStatus } from '../services/paymentService';

/**
 * وحدة تحكم معالجة الدفع
 * تتعامل مع طلبات الدفع وتكامل بوابات الدفع
 */

/**
 * إنشاء جلسة دفع جديدة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
const createPaymentSession = async (req, res) => {
  try {
    const { order, paymentMethod } = req.body;
    
    if (!order || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'بيانات الطلب أو طريقة الدفع غير متوفرة',
      });
    }
    
    // إنشاء جلسة دفع باستخدام خدمة الدفع
    const paymentResult = await createPayment(order, paymentMethod);
    
    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: paymentResult.error || 'فشل في إنشاء جلسة الدفع',
      });
    }
    
    // إذا كانت طريقة الدفع هي الدفع عند الاستلام، قم بإنشاء الطلب مباشرة
    if (paymentMethod === 'cod') {
      // تحويل الطلب إلى تنسيق علي إكسبريس (إزالة هامش الربح) للإرسال إلى علي إكسبريس
      const aliexpressOrder = transformOrderToAliexpress(order);
      
      // هنا يمكن إضافة منطق لإرسال الطلب إلى علي إكسبريس
      // وحفظ الطلب في قاعدة البيانات
      
      return res.status(200).json({
        success: true,
        paymentMethod: 'cod',
        message: 'تم إنشاء الطلب بنجاح',
        orderId: order.id || `ORD-${Date.now()}`,
      });
    }
    
    // إرجاع معلومات جلسة الدفع
    return res.status(200).json({
      success: true,
      ...paymentResult,
    });
  } catch (error) {
    console.error('خطأ في إنشاء جلسة الدفع:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء معالجة طلب الدفع',
      error: error.message,
    });
  }
};

/**
 * التحقق من حالة الدفع
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
const verifyPayment = async (req, res) => {
  try {
    const { paymentId, paymentMethod } = req.body;
    
    if (!paymentId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'معرف الدفع أو طريقة الدفع غير متوفرة',
      });
    }
    
    // التحقق من حالة الدفع باستخدام خدمة الدفع
    const paymentStatus = await checkPaymentStatus(paymentId, paymentMethod);
    
    if (!paymentStatus.success) {
      return res.status(400).json({
        success: false,
        message: paymentStatus.error || 'فشل في التحقق من حالة الدفع',
      });
    }
    
    // إذا تم الدفع بنجاح، قم بإنشاء الطلب
    if (paymentStatus.paid) {
      // هنا يمكن إضافة منطق لإنشاء الطلب وإرساله إلى علي إكسبريس
      // وتحديث حالة الطلب في قاعدة البيانات
    }
    
    // إرجاع حالة الدفع
    return res.status(200).json({
      success: true,
      ...paymentStatus,
    });
  } catch (error) {
    console.error('خطأ في التحقق من حالة الدفع:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التحقق من حالة الدفع',
      error: error.message,
    });
  }
};

/**
 * معالجة إشعارات webhook من بوابات الدفع
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
const handlePaymentWebhook = async (req, res) => {
  try {
    const { paymentMethod } = req.params;
    
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'طريقة الدفع غير متوفرة',
      });
    }
    
    // معالجة إشعارات webhook حسب بوابة الدفع
    switch (paymentMethod) {
      case 'stripe':
        // التحقق من صحة الإشعار
        const stripe = require('stripe')(process.env.STRIPE_API_KEY);
        const signature = req.headers['stripe-signature'];
        
        let event;
        try {
          event = stripe.webhooks.constructEvent(
            req.rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
          );
        } catch (err) {
          console.error('خطأ في التحقق من توقيع Stripe:', err);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        
        // معالجة الحدث
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
          
          // هنا يمكن إضافة منطق لإنشاء الطلب وإرساله إلى علي إكسبريس
          // وتحديث حالة الطلب في قاعدة البيانات
        }
        
        return res.status(200).json({ received: true });
      
      case 'paypal':
        // معالجة إشعارات PayPal
        // التحقق من صحة الإشعار وتنفيذ الإجراءات المناسبة
        
        return res.status(200).json({ received: true });
      
      default:
        return res.status(400).json({
          success: false,
          message: 'طريقة الدفع غير مدعومة',
        });
    }
  } catch (error) {
    console.error('خطأ في معالجة إشعار webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء معالجة إشعار webhook',
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentSession,
  verifyPayment,
  handlePaymentWebhook,
};
