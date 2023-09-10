import { promises as fs } from "fs";
import { nanoid } from "nanoid";
// import ProductManager from "../../controllers/ProductManager.js";

const productAll = new ProductManager();

class CartManager {
    constructor() {
        this.path = './src/models/carts.json';
    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(carts);
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2))
    }

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(cart => cart.id === id)
    }

    addCarts = async (cart) => {
        let cartsOld = await this.readCarts();
        let id = nanoid(2);
        let cartsConcat = [{ id: id, products: [] }, ...cartsOld]
        await this.writeCarts(cartsConcat);
        return "Carrito agregado con éxito";
    }

    getCartsById = async (id) => {
        let cartById = await this.exist(id);
        if (!cartById) {
            return "Carrito no encontrado";
        }
        return cartById;
    };

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId);
        if (!cartById) {
            return "Carrito no encontrado";
        }
        let productById = await productAll.exist(productId);
        if (!productById) {
            return "Producto no encontrado";
        }
        
        let cartsAll = await this.readCarts();
        let cartFilter = cartsAll.filter(cart => cart.id != cartId);

        if (cartById.products.some((prod) => prod.id === productId)) {
            let moreProductInCart = cartById.products.find((prod) => prod.id === productId);
            moreProductInCart.cantidad++;
            let cartsConcat = [cartById, ...cartFilter]
            await this.writeCarts(cartsConcat);
            return "Producto sumado con éxito";
        }
        cartById.products.push({ id : productById.id, cantidad: 1})
        let cartsConcat = [cartById, ...cartFilter]
        await this.writeCarts(cartsConcat);
        return "Producto agregado con éxito";
    }
}

export default CartManager;
