
import { defineType } from 'sanity';

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'The ID of the user placing the order',
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The name of the user placing the order',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'The email address of the user',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
      description: 'The shipping address for the order',
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      description: 'City of the shipping address',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'User’s phone number',
    },
    {
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Products included in the order',
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
      description: 'Total price for the order',
    },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'Pending' },
          { title: 'Shipped', value: 'Shipped' },
          { title: 'Delivered', value: 'Delivered' },
          { title: 'Cancelled', value: 'Cancelled' },
        ],
        layout: 'radio',
      },
      description: 'The status of the order',
    },
    {
      name: 'orderDate',
      title: 'Order Date',
      type: 'datetime',
      description: 'The date when the order was placed',
    },
  ],
});
