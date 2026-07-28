export interface ClothingItem {
  id: string;
  name: string;
  category: 'men' | 'women' | 'children' | 'household';
  genderLabel: string;
  iconName: string;
  basePrices: {
    wash_iron: number;
    wash_fold: number;
    iron_only: number;
    dry_clean?: number;
  };
  popular?: boolean;
  description: string;
  image?: string;
}

export type ServiceType = 'wash_iron' | 'wash_fold' | 'iron_only' | 'dry_clean';

export interface CartItem {
  cartItemId: string;
  item: ClothingItem;
  serviceType: ServiceType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  isVerified: boolean;
}

export interface CustomerOrder {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  pickupDate: string;
  pickupTimeSlot: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Cash on Delivery' | 'Card';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  status: 'Order Placed' | 'Pickup Scheduled' | 'In Washing & Ironing' | 'Quality Inspection' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  wash_iron: 'Wash & Iron',
  wash_fold: 'Wash & Fold',
  iron_only: 'Iron Only',
  dry_clean: 'Dry Cleaning',
};

export const LAUNDRY_CATALOG: ClothingItem[] = [
  // --- MEN'S SECTION ---
  {
    id: 'men-shirt',
    name: 'Formal / Casual Shirt',
    category: 'men',
    genderLabel: "Men's Section",
    iconName: 'Shirt',
    popular: true,
    description: 'Cotton, linen, or formal dress shirt laundry.',
    basePrices: {
      wash_iron: 50,
      wash_fold: 35,
      iron_only: 20,
      dry_clean: 120,
    },
  },
  {
    id: 'men-pants',
    name: 'Trousers / Jeans / Chinos',
    category: 'men',
    genderLabel: "Men's Section",
    iconName: 'Scissors',
    popular: true,
    description: 'Formal pants, denim jeans, or gabardine trousers.',
    basePrices: {
      wash_iron: 60,
      wash_fold: 40,
      iron_only: 25,
      dry_clean: 150,
    },
  },
  {
    id: 'men-tshirt',
    name: 'T-Shirt / Polo Shirt',
    category: 'men',
    genderLabel: "Men's Section",
    iconName: 'Shirt',
    description: 'Casual t-shirts, polo shirts, or tank tops.',
    basePrices: {
      wash_iron: 40,
      wash_fold: 30,
      iron_only: 15,
      dry_clean: 90,
    },
  },
  {
    id: 'men-panjabi',
    name: 'Panjabi / Kurta',
    category: 'men',
    genderLabel: "Men's Section",
    iconName: 'Sparkles',
    popular: true,
    description: 'Traditional cotton or silk Panjabi.',
    basePrices: {
      wash_iron: 80,
      wash_fold: 55,
      iron_only: 30,
      dry_clean: 200,
    },
  },
  {
    id: 'men-suit',
    name: '2-Piece Suit (Blazer + Pants)',
    category: 'men',
    genderLabel: "Men's Section",
    iconName: 'ShieldCheck',
    description: 'Premium blazer & matching trousers dry clean & steam press.',
    basePrices: {
      wash_iron: 250,
      wash_fold: 180,
      iron_only: 100,
      dry_clean: 350,
    },
  },
  {
    id: 'men-jacket',
    name: 'Jacket / Hoodie / Sweater',
    category: 'men',
    genderLabel: "Men's Section",
    iconName: 'Flame',
    description: 'Winter jackets, fleece hoodies, or woolen sweaters.',
    basePrices: {
      wash_iron: 120,
      wash_fold: 90,
      iron_only: 40,
      dry_clean: 250,
    },
  },

  // --- WOMEN'S SECTION ---
  {
    id: 'women-saree-cotton',
    name: 'Cotton / Printed Saree',
    category: 'women',
    genderLabel: "Women's Section",
    iconName: 'Sparkles',
    popular: true,
    description: 'Cotton or georgette saree wash & press.',
    basePrices: {
      wash_iron: 120,
      wash_fold: 80,
      iron_only: 40,
      dry_clean: 220,
    },
  },
  {
    id: 'women-saree-silk',
    name: 'Silk / Katan / Heavy Work Saree',
    category: 'women',
    genderLabel: "Women's Section",
    iconName: 'Crown',
    popular: true,
    description: 'Delicate silk or bridal designer saree delicate dry clean.',
    basePrices: {
      wash_iron: 200,
      wash_fold: 150,
      iron_only: 60,
      dry_clean: 380,
    },
  },
  {
    id: 'women-salwar',
    name: 'Salwar Kameez 3-Piece Set',
    category: 'women',
    genderLabel: "Women's Section",
    iconName: 'Shirt',
    popular: true,
    description: 'Kameez, Salwar/Pants & Orna/Dupatta complete 3pc set.',
    basePrices: {
      wash_iron: 100,
      wash_fold: 70,
      iron_only: 35,
      dry_clean: 220,
    },
  },
  {
    id: 'women-top',
    name: 'Tops / Kurti / Blouse',
    category: 'women',
    genderLabel: "Women's Section",
    iconName: 'Shirt',
    description: 'Western tops, kurtis, or saree blouses.',
    basePrices: {
      wash_iron: 50,
      wash_fold: 35,
      iron_only: 20,
      dry_clean: 120,
    },
  },
  {
    id: 'women-dress',
    name: 'Gown / Long Dress',
    category: 'women',
    genderLabel: "Women's Section",
    iconName: 'Sparkles',
    description: 'Evening gowns, maxi dresses, or party dresses.',
    basePrices: {
      wash_iron: 150,
      wash_fold: 100,
      iron_only: 50,
      dry_clean: 300,
    },
  },

  // --- CHILDREN'S SECTION ---
  {
    id: 'child-shirt',
    name: "Kid's Shirt / T-Shirt / Top",
    category: 'children',
    genderLabel: "Children's Section",
    iconName: 'HeartHandshake',
    popular: true,
    description: "Children's shirts, t-shirts, or tops (ages 0-12).",
    basePrices: {
      wash_iron: 30,
      wash_fold: 20,
      iron_only: 12,
      dry_clean: 70,
    },
  },
  {
    id: 'child-pants',
    name: "Kid's Pants / Shorts / Frock",
    category: 'children',
    genderLabel: "Children's Section",
    iconName: 'Smile',
    popular: true,
    description: "Kids jeans, trousers, shorts, or little dresses/frocks.",
    basePrices: {
      wash_iron: 35,
      wash_fold: 25,
      iron_only: 15,
      dry_clean: 80,
    },
  },
  {
    id: 'child-uniform',
    name: 'School Uniform Set',
    category: 'children',
    genderLabel: "Children's Section",
    iconName: 'ShieldCheck',
    description: 'School shirt + pants/skirt + tie crisp wash & iron.',
    basePrices: {
      wash_iron: 60,
      wash_fold: 45,
      iron_only: 25,
      dry_clean: 130,
    },
  },

  // --- HOUSEHOLD / LINENS ---
  {
    id: 'bedsheet-double',
    name: 'Double / King Bed Sheet Set',
    category: 'household',
    genderLabel: 'Household Linens',
    iconName: 'Layers',
    popular: true,
    description: 'King or queen bedsheet + 2 pillowcases.',
    basePrices: {
      wash_iron: 120,
      wash_fold: 90,
      iron_only: 45,
      dry_clean: 220,
    },
  },
  {
    id: 'towel-large',
    name: 'Bath Towel (Large)',
    category: 'household',
    genderLabel: 'Household Linens',
    iconName: 'Wind',
    description: 'Soft bath towels & spa towels.',
    basePrices: {
      wash_iron: 45,
      wash_fold: 35,
      iron_only: 15,
      dry_clean: 80,
    },
  },
  {
    id: 'blanket-heavy',
    name: 'Comforter / Heavy Blanket',
    category: 'household',
    genderLabel: 'Household Linens',
    iconName: 'Box',
    description: 'Quilt, comforter, or winter blanket deep wash & dry clean.',
    basePrices: {
      wash_iron: 300,
      wash_fold: 250,
      iron_only: 80,
      dry_clean: 450,
    },
  },
];

export const INITIAL_MOCK_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    orderId: 'ORD-93021',
    customerName: 'Tanvir Ahmed',
    phone: '+880 1712-345678',
    email: 'tanvir@example.com',
    address: 'House 42, Road 11, Banani, Dhaka-1213',
    pickupDate: '2026-07-27',
    pickupTimeSlot: '10:00 AM - 12:00 PM',
    paymentMethod: 'bKash',
    items: [
      {
        cartItemId: 'item-1',
        item: LAUNDRY_CATALOG[0], // Formal Shirt
        serviceType: 'wash_iron',
        quantity: 4,
        unitPrice: 50,
        totalPrice: 200,
      },
      {
        cartItemId: 'item-2',
        item: LAUNDRY_CATALOG[1], // Pants
        serviceType: 'wash_iron',
        quantity: 3,
        unitPrice: 60,
        totalPrice: 180,
      },
      {
        cartItemId: 'item-3',
        item: LAUNDRY_CATALOG[6], // Saree
        serviceType: 'dry_clean',
        quantity: 1,
        unitPrice: 220,
        totalPrice: 220,
      },
    ],
    subtotal: 600,
    deliveryFee: 0, // Free over 500
    discount: 0,
    totalAmount: 600,
    status: 'In Washing & Ironing',
    createdAt: '2026-07-26 14:30',
  },
];
