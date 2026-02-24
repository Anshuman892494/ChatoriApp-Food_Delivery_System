import DeliveryNavbar from './DeliveryNavbar';
import DeliveryFooter from './DeliveryFooter';
import { CartProvider } from '../context/CartContext';

const DeliveryLayout = ({ children }) => {
    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-poppins flex flex-col">
                <DeliveryNavbar />
                <main className="flex-1">
                    {children}
                </main>
                <DeliveryFooter />
            </div>
        </CartProvider>
    );
};

export default DeliveryLayout;
