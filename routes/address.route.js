import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { addAddressController, deleteAddressController, getAddressController, getSingleAddressController, updateAddressController } from '../controllers/address.controller.js';

const addressRouter = Router();
addressRouter.post('/add', auth, addAddressController);
addressRouter.get('/get', auth, getAddressController);
addressRouter.get('/:id', auth, getSingleAddressController);
addressRouter.delete('/:id', auth, deleteAddressController);
addressRouter.put('/:id', auth, updateAddressController);

export default addressRouter;