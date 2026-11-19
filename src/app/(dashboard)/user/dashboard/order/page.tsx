import type { OrderType } from "@/app/type/type";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const CustomerOrderPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer_order/${user?.id}`);
    const orders = await res.json();
    return (
        <div>
            {orders.map((order: OrderType) => (
                <ul key={order._id}>
                    <li>{order.menuName}</li>
                    <li>{order.quantity}</li>
                    <li>{order.unitPrice}</li>
                    <li>{order.subtotal}</li>
                    <li>{order.payment}</li>
                    <li>{order.order_status}</li>
                    <li>{order.vendor.name}</li>
                    <li>{order.customer.name}</li>
                    <li>
                        <button className="btn btn-primary" disabled={order.order_status !== "PENDING"}>
                            Cancel
                        </button>
                    </li>
                </ul>
            ))}
        </div>
    );
};

export default CustomerOrderPage;