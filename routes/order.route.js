import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { captureOrderPaypalController, createOrderController, createOrderPaypalController, getOrderDetailsController, updateOrderStatusController } from '../controllers/order.controller.js';

const orderRouter = Router();
orderRouter.post('/create', auth, createOrderController);
orderRouter.get('/order-list', auth, getOrderDetailsController);
orderRouter.put('/order-status/:id', auth, updateOrderStatusController);
orderRouter.get('/create-order-paypal', auth, createOrderPaypalController);
orderRouter.post('/capture-order-paypal', auth, captureOrderPaypalController);

export default orderRouter;