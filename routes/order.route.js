import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { createOrderController, createVnpayUrlController, getOrderDetailsController, totalSalesController, totalUsersController, updateOrderStatusController, vnpayIpnController, vnpayReturnController } from '../controllers/order.controller.js';

const orderRouter = Router();
orderRouter.post('/create', auth, createOrderController);
orderRouter.get('/order-list', auth, getOrderDetailsController);
orderRouter.put('/order-status/:id', auth, updateOrderStatusController);
orderRouter.get('/sales', auth, totalSalesController);
orderRouter.get('/users', auth, totalUsersController);
orderRouter.post('/create-vnpay-url', createVnpayUrlController);
orderRouter.get('/vnpay-return', vnpayReturnController);
orderRouter.get('/vnpay-ipn', vnpayIpnController);

export default orderRouter;