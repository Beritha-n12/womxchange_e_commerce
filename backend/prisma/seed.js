import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const USER_IDS = [2, 3]; // Existing users only

async function main() {
  console.log('🌱 Seeding database using existing users (IDs 1, 2, 3)...');

  // 1. Create Categories (ensure unique names)
  const categories = [];
  const usedNames = new Set();

  while (categories.length < 10) {
    const name = faker.commerce.department().slice(0, 90) + ` ${faker.number.int(1000)}`;
    if (!usedNames.has(name)) {
      const category = await prisma.category.create({
        data: {
          name,
          description: faker.commerce.productDescription(),
          image: faker.image.url(),
        },
      });
      categories.push(category);
      usedNames.add(name);
    }
  }

  // 2. Create Products (createdById: user 1, 2, or 3)
  const products = [];
  for (let i = 0; i < 20; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName().slice(0, 255),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        stock: faker.number.int({ min: 10, max: 30 }),
        availableStock: faker.number.int({ min: 5, max: 90 }),
        categoryId: faker.helpers.arrayElement(categories).id,
        createdById: faker.helpers.arrayElement(USER_IDS),
        coverImage: faker.image.url(),
        sku: faker.string.alphanumeric(10).slice(0, 100),
        weight: parseFloat(faker.number.float({ min: 0.5, max: 5, precision: 0.01 })),
        dimensions: `${faker.number.int({ min: 10, max: 30 })}x${faker.number.int({ min: 10, max: 30 })}`.slice(0, 100),
        colors: [faker.color.human().slice(0, 50)],
        sizes: ['S', 'M', 'L', 'XL'],
        tags: [faker.commerce.productAdjective().slice(0, 255)],
        isOnSale: faker.datatype.boolean(),
        salePrice: parseFloat(faker.commerce.price({ min: 5, max: 200 })),
      },
    });
    products.push(product);
  }

  // 3. Create Orders
  for (let i = 0; i < 30; i++) {
    await prisma.order.create({
      data: {
        userId: faker.helpers.arrayElement(USER_IDS),
        orderNumber: faker.string.alphanumeric(50).slice(0, 50),
        customerName: faker.person.fullName().slice(0, 255),
        customerEmail: faker.internet.email().toLowerCase().slice(0, 255),
        customerPhone: faker.phone.number().slice(0, 20),
        shippingAddress: {
          city: faker.location.city().slice(0, 255),
          street: faker.location.streetAddress().slice(0, 255),
        },
        billingAddress: {
          city: faker.location.city().slice(0, 255),
          street: faker.location.streetAddress().slice(0, 255),
          zip: faker.location.zipCode().slice(0, 255),
        },
        totalPrice: parseFloat(faker.commerce.price({ min: 50, max: 800 })),
        shippingPrice: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
        taxPrice: parseFloat(faker.commerce.price({ min: 1, max: 50 })),
        status: 'PENDING',
        isPaid: faker.datatype.boolean(),
        isDelivered: faker.datatype.boolean(),
        paymentCode: faker.string.alphanumeric(100).slice(0, 100),
        paymentMethod: faker.commerce.productName().slice(0, 50),
        trackingNumber: faker.string.alphanumeric(100).slice(0, 100),
        notes: faker.lorem.sentence(),
      },
    });
  }

  

  console.log('\n✅ Seeding complete using existing users.');
  console.log(`All data uses user IDs: ${USER_IDS.join(', ')}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
