import Image from "next/image";
import React from "react";
import EditAndDelete from "./_comp/EditAndDelete";

const MenuDetailespage = async ({
  params,
}: {
  params: Promise<{ menuid: string }>;
}) => {
  const { menuid } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${menuid}`);
  const menu = await res.json();
  return (
    <div>
      <ul>
        <li>Menu Name: {menu.name}</li>
        <li>category: {menu.category}</li>
        <li>price: {menu.price}</li>
        <li>description: {menu.description}</li>
        <li>available: {menu.available}</li>
        <li>status: {menu.status}</li>
        <li>
          vendor
          <ul>
            <li>Vendor Name {menu.vendor.name}</li>
            <li>
              vendor image{" "}
              <Image
                src={menu.vendor.image}
                width={60}
                height={60}
                alt={menu.vendor.name}
              />
            </li>
          </ul>
        </li>
        <li>
          <Image src={menu.image} width={60} height={60} alt={menu.name} />
        </li>
        <li>
            <EditAndDelete menu={menu}/>
        </li>
      </ul>
    </div>
  );
};

export default MenuDetailespage;
