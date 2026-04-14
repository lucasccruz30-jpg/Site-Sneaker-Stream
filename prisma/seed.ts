import {
  CouponType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
  ReviewStatus,
  UserRole,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

type SeedProduct = {
  brand: string;
  category: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  colorway: string;
  basePriceInCents: number;
  salePriceInCents?: number;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isNewRelease?: boolean;
  isOnSale?: boolean;
  images: string[];
  stockBySize: Record<string, number>;
  keywords: string[];
  highlights: string[];
  specs: Array<{ label: string; value: string }>;
};

const brands = [
  {
    name: "Nike",
    slug: "nike",
    isFeatured: true,
    description: "Silhuetas desejadas com curadoria focada em performance, lifestyle e valor de coleção.",
  },
  {
    name: "Jordan",
    slug: "jordan",
    isFeatured: true,
    description: "Ícones do streetwear premium e do universo basketball culture.",
  },
  {
    name: "Adidas",
    slug: "adidas",
    isFeatured: true,
    description: "Modelos clássicos e colaborações de forte apelo fashion.",
  },
  {
    name: "New Balance",
    slug: "new-balance",
    isFeatured: true,
    description: "Conforto sofisticado com linguagem contemporânea e acabamento premium.",
  },
  {
    name: "ASICS",
    slug: "asics",
    isFeatured: false,
    description: "Tecnologia, conforto e construção refinada para o uso urbano.",
  },
];

const categories = [
  {
    name: "Lançamentos",
    slug: "lancamentos",
    isFeatured: true,
    description: "Os drops mais recentes e desejados da curadoria Sneaker Stream.",
  },
  {
    name: "Streetwear Premium",
    slug: "streetwear-premium",
    isFeatured: true,
    description: "Modelos versáteis para compor visual com identidade e presença.",
  },
  {
    name: "Basketball Icons",
    slug: "basketball-icons",
    isFeatured: true,
    description: "Silhuetas históricas com valor de coleção e styling imponente.",
  },
  {
    name: "Running Lifestyle",
    slug: "running-lifestyle",
    isFeatured: true,
    description: "Conforto premium com acabamento e presença visual marcante.",
  },
];

const sizeLabels = ["38", "39", "40", "41", "42", "43", "44"];

const products: SeedProduct[] = [
  {
    brand: "Jordan",
    category: "Lançamentos",
    name: "Air Jordan 1 Bordeaux Legacy",
    slug: "air-jordan-1-bordeaux-legacy",
    sku: "SS-AJ1-001",
    shortDescription: "Silhueta icônica em leitura bordô premium, com presença forte e acabamento elevado.",
    description:
      "O Air Jordan 1 Bordeaux Legacy combina o peso histórico da linha Jordan com uma proposta visual sofisticada. Couro premium, contraste elegante e construção pensada para colecionadores e clientes que compram por identidade.",
    colorway: "Bordô / Off-white / Preto",
    basePriceInCents: 219990,
    salePriceInCents: 199990,
    isFeatured: true,
    isExclusive: true,
    isNewRelease: true,
    isOnSale: true,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    ],
    stockBySize: { "38": 2, "39": 4, "40": 5, "41": 3, "42": 2, "43": 1, "44": 0 },
    keywords: ["jordan", "air jordan 1", "bordo", "importado", "premium"],
    highlights: ["Couro premium", "Drop limitado", "Autenticidade garantida", "Curadoria Sneaker Stream"],
    specs: [
      { label: "Cabedal", value: "Couro premium com painéis contrastantes" },
      { label: "Solado", value: "Borracha com tração clássica Jordan" },
      { label: "Indicação", value: "Lifestyle / coleção / streetwear" },
    ],
  },
  {
    brand: "Nike",
    category: "Streetwear Premium",
    name: "Nike Dunk Low Shadow Smoke",
    slug: "nike-dunk-low-shadow-smoke",
    sku: "SS-NKD-002",
    shortDescription: "Um clássico urbano reinterpretado com cinza grafite e contraste limpo.",
    description:
      "O Nike Dunk Low Shadow Smoke entrega versatilidade imediata para quem busca um tênis premium para compor looks com presença. A silhueta tem forte apelo de revenda, coleção e uso diário.",
    colorway: "Grafite / Branco gelo",
    basePriceInCents: 169990,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
    ],
    stockBySize: { "38": 1, "39": 2, "40": 6, "41": 4, "42": 3, "43": 2, "44": 1 },
    keywords: ["nike dunk", "low", "grafite", "streetwear"],
    highlights: ["Silhueta versátil", "Baixo estoque em grades-chave", "Conforto urbano"],
    specs: [
      { label: "Cabedal", value: "Mistura de couro liso e camurça leve" },
      { label: "Estilo", value: "Streetwear premium" },
      { label: "Origem", value: "Importado" },
    ],
  },
  {
    brand: "Adidas",
    category: "Streetwear Premium",
    name: "Adidas Samba Noir Reserve",
    slug: "adidas-samba-noir-reserve",
    sku: "SS-ADS-003",
    shortDescription: "A leitura premium de um ícone atemporal, pronta para styling sofisticado.",
    description:
      "O Samba Noir Reserve reforça a tendência das silhuetas clássicas com acabamento mais sóbrio, couro macio e presença elegante. Um modelo para clientes que valorizam autenticidade e versatilidade.",
    colorway: "Preto / Off-white",
    basePriceInCents: 149990,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    ],
    stockBySize: { "38": 4, "39": 5, "40": 8, "41": 6, "42": 5, "43": 3, "44": 2 },
    keywords: ["samba", "adidas", "preto", "moda premium"],
    highlights: ["Ícone de estilo", "Design atemporal", "Construção premium"],
    specs: [
      { label: "Cabedal", value: "Couro premium com sobreposição em suede" },
      { label: "Solado", value: "Gum sole clássica" },
      { label: "Uso", value: "Lifestyle / casual premium" },
    ],
  },
  {
    brand: "New Balance",
    category: "Running Lifestyle",
    name: "New Balance 9060 Moon Dust",
    slug: "new-balance-9060-moon-dust",
    sku: "SS-NB9-004",
    shortDescription: "Conforto máximo e linguagem contemporânea para um visual premium imediato.",
    description:
      "O New Balance 9060 Moon Dust combina proporções marcantes, materiais refinados e conforto elevado. Ideal para quem procura um sneaker de lifestyle com identidade forte e acabamento sofisticado.",
    colorway: "Cinza quente / Off-white",
    basePriceInCents: 239990,
    isFeatured: true,
    isExclusive: true,
    images: [
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    ],
    stockBySize: { "38": 1, "39": 2, "40": 3, "41": 4, "42": 3, "43": 1, "44": 0 },
    keywords: ["new balance", "9060", "conforto", "premium"],
    highlights: ["Conforto premium", "Silhueta em alta", "Edição curada"],
    specs: [
      { label: "Entressola", value: "Espuma de alto conforto" },
      { label: "Visual", value: "Chunky refinado" },
      { label: "Perfil", value: "Streetwear / lifestyle premium" },
    ],
  },
  {
    brand: "ASICS",
    category: "Running Lifestyle",
    name: "ASICS Gel-Kayano Obsidian",
    slug: "asics-gel-kayano-obsidian",
    sku: "SS-ASK-005",
    shortDescription: "Equilíbrio perfeito entre conforto técnico e linguagem fashion contemporânea.",
    description:
      "O Gel-Kayano Obsidian entrega construção robusta, estabilidade e presença visual marcante. É um sneaker para clientes que acompanham tendências e não abrem mão de conforto real.",
    colorway: "Obsidiana / Cinza / Branco",
    basePriceInCents: 189990,
    salePriceInCents: 174990,
    isOnSale: true,
    images: [
      "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
    ],
    stockBySize: { "38": 3, "39": 5, "40": 4, "41": 5, "42": 4, "43": 2, "44": 1 },
    keywords: ["asics", "gel-kayano", "running lifestyle"],
    highlights: ["Conforto técnico", "Estética de tendência", "Preço especial"],
    specs: [
      { label: "Tecnologia", value: "Amortecimento GEL" },
      { label: "Uso", value: "Lifestyle e rotina urbana" },
      { label: "Estética", value: "Running premium" },
    ],
  },
  {
    brand: "Nike",
    category: "Lançamentos",
    name: "Nike Air Max Pulse Crimson",
    slug: "nike-air-max-pulse-crimson",
    sku: "SS-AMX-006",
    shortDescription: "Energia visual, conforto e contraste premium para a rotina urbana.",
    description:
      "O Air Max Pulse Crimson foi escolhido para a vitrine de lançamentos por unir apelo comercial, visual moderno e ótima leitura em looks streetwear. Um produto para quem compra desejo e presença.",
    colorway: "Preto / Crimson / Branco",
    basePriceInCents: 179990,
    isNewRelease: true,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?auto=format&fit=crop&w=1200&q=80",
    ],
    stockBySize: { "38": 2, "39": 2, "40": 5, "41": 5, "42": 4, "43": 2, "44": 1 },
    keywords: ["air max", "pulse", "nike", "lancamento"],
    highlights: ["Lançamento quente", "Conforto Air", "Ótima conversão mobile"],
    specs: [
      { label: "Cabedal", value: "Mesh técnico com sobreposições sintéticas" },
      { label: "Tecnologia", value: "Amortecimento Air" },
      { label: "Momento", value: "Drop recente" },
    ],
  },
  {
    brand: "Jordan",
    category: "Basketball Icons",
    name: "Jordan 4 Retro Phantom Wine",
    slug: "jordan-4-retro-phantom-wine",
    sku: "SS-J4R-007",
    shortDescription: "Estrutura icônica com acabamento sofisticado e forte apelo de exclusividade.",
    description:
      "O Jordan 4 Retro Phantom Wine entrega o tipo de presença que define vitrine premium. É um modelo para quem valoriza autenticidade, styling marcante e potencial de coleção.",
    colorway: "Phantom / Wine / Preto",
    basePriceInCents: 269990,
    isFeatured: true,
    isExclusive: true,
    images: [
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
    ],
    stockBySize: { "38": 1, "39": 1, "40": 2, "41": 3, "42": 2, "43": 1, "44": 0 },
    keywords: ["jordan 4", "retro", "exclusivo", "colecionador"],
    highlights: ["Baixíssima disponibilidade", "Silhueta histórica", "Curadoria premium"],
    specs: [
      { label: "Cabedal", value: "Couro estruturado premium" },
      { label: "Perfil", value: "Basketball icon / lifestyle" },
      { label: "Coleção", value: "Exclusiva" },
    ],
  },
  {
    brand: "New Balance",
    category: "Streetwear Premium",
    name: "New Balance 550 Ivory Court",
    slug: "new-balance-550-ivory-court",
    sku: "SS-NB5-008",
    shortDescription: "Minimalismo premium com influência esportiva e leitura sofisticada.",
    description:
      "O New Balance 550 Ivory Court funciona muito bem para clientes que procuram um tênis importado com linguagem limpa, fácil de combinar e percepção forte de valor.",
    colorway: "Ivory / Cinza",
    basePriceInCents: 159990,
    salePriceInCents: 149990,
    isOnSale: true,
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554735490-5974588cbc4f?auto=format&fit=crop&w=1200&q=80",
    ],
    stockBySize: { "38": 3, "39": 5, "40": 6, "41": 4, "42": 4, "43": 2, "44": 1 },
    keywords: ["new balance 550", "court", "minimalista"],
    highlights: ["Oferta selecionada", "Visual limpo", "Alta procura"],
    specs: [
      { label: "Visual", value: "Court premium" },
      { label: "Cabedal", value: "Couro com acabamento macio" },
      { label: "Posicionamento", value: "Lifestyle premium" },
    ],
  },
];

async function main() {
  await prisma.$transaction([
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.review.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.brand.deleteMany(),
    prisma.size.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.banner.deleteMany(),
    prisma.newsletterSubscriber.deleteMany(),
    prisma.contentPage.deleteMany(),
    prisma.address.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
    prisma.settings.deleteMany(),
  ]);

  for (const brand of brands) {
    await prisma.brand.create({ data: brand });
  }

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }

  for (const [index, label] of sizeLabels.entries()) {
    await prisma.size.create({
      data: {
        label,
        sortOrder: index + 1,
      },
    });
  }

  const brandMap = Object.fromEntries((await prisma.brand.findMany()).map((brand) => [brand.name, brand]));
  const categoryMap = Object.fromEntries((await prisma.category.findMany()).map((category) => [category.name, category]));
  const sizeMap = Object.fromEntries((await prisma.size.findMany()).map((size) => [size.label, size]));

  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        brandId: brandMap[product.brand].id,
        categoryId: categoryMap[product.category].id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        shortDescription: product.shortDescription,
        description: product.description,
        colorway: product.colorway,
        basePriceInCents: product.basePriceInCents,
        salePriceInCents: product.salePriceInCents,
        metaTitle: `${product.name} | Sneaker Stream`,
        metaDescription: product.shortDescription,
        searchKeywords: product.keywords,
        highlights: product.highlights,
        specs: product.specs,
        details: {
          authenticity: "Produto importado com curadoria e conferência interna Sneaker Stream.",
          shipping: "Envio seguro com rastreio e suporte humano rápido.",
        },
        isFeatured: Boolean(product.isFeatured),
        isExclusive: Boolean(product.isExclusive),
        isNewRelease: Boolean(product.isNewRelease),
        isOnSale: Boolean(product.isOnSale),
        installmentCount: 10,
        images: {
          create: product.images.map((image, index) => ({
            url: image,
            alt: product.name,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        },
      },
    });

    for (const [sizeLabel, stock] of Object.entries(product.stockBySize)) {
      await prisma.productVariant.create({
        data: {
          productId: created.id,
          sizeId: sizeMap[sizeLabel].id,
          stock,
        },
      });
    }
  }

  const adminPassword = await hash("Sneaker@123", 10);
  const customerPassword = await hash("Cliente@123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Equipe Sneaker Stream",
      email: "admin@sneakerstream.com.br",
      phone: "+55 11 99999-0001",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Lucas Andrade",
      email: "cliente@sneakerstream.com.br",
      phone: "+55 11 98888-7766",
      passwordHash: customerPassword,
      role: UserRole.CUSTOMER,
    },
  });

  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      label: "Casa",
      recipient: "Lucas Andrade",
      phone: "+55 11 98888-7766",
      zipCode: "04567-120",
      street: "Rua dos Sneakers",
      number: "145",
      neighborhood: "Vila Premium",
      city: "São Paulo",
      state: "SP",
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
  });

  await prisma.coupon.createMany({
    data: [
      {
        code: "STREAM10",
        description: "10% off para primeira compra",
        type: CouponType.PERCENTAGE,
        value: 10,
        minOrderCents: 120000,
        usageLimit: 100,
      },
      {
        code: "PIX5",
        description: "Benefício de 5% no PIX",
        type: CouponType.PERCENTAGE,
        value: 5,
      },
      {
        code: "FRETEGRATIS",
        description: "Frete grátis acima do mínimo",
        type: CouponType.FREE_SHIPPING,
        value: 0,
        minOrderCents: 180000,
      },
    ],
  });

  await prisma.banner.createMany({
    data: [
      {
        title: "Os sneakers mais desejados do momento",
        subtitle: "Curadoria premium, importados autênticos e drops com alta procura.",
        eyebrow: "SNEAKER STREAM",
        ctaLabel: "Explorar catálogo",
        ctaHref: "/shop",
        imageUrl: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1600&q=80",
        placement: "HERO",
        sortOrder: 1,
        accent: "#550D1A",
      },
      {
        title: "Drops selecionados com baixo estoque",
        subtitle: "Silhuetas exclusivas com reposição limitada.",
        ctaLabel: "Ver lançamentos",
        ctaHref: "/drops",
        placement: "FEATURED",
        sortOrder: 2,
        accent: "#575656",
      },
      {
        title: "Autenticidade, atendimento e entrega segura",
        subtitle: "Experiência premium de compra do primeiro clique ao pós-venda.",
        ctaLabel: "Saiba mais",
        ctaHref: "/autenticidade",
        placement: "MIDPAGE",
        sortOrder: 3,
        accent: "#131313",
      },
      {
        title: "Oferta de semana com leitura premium",
        subtitle: "Modelos com condição especial e curadoria já validada pela comunidade.",
        ctaLabel: "Aproveitar ofertas",
        ctaHref: "/drops",
        placement: "FOOTER",
        sortOrder: 4,
        accent: "#95898A",
      },
      {
        title: "Lançamentos e edições limitadas",
        subtitle: "Produtos recém-chegados para quem compra primeiro.",
        ctaLabel: "Ver drops",
        ctaHref: "/drops",
        placement: "DROPS",
        sortOrder: 1,
        accent: "#550D1A",
      },
    ],
  });

  await prisma.settings.create({
    data: {
      storeName: "Sneaker Stream",
      tagline: "A sua loja de tênis premium e importados",
      supportEmail: "contato@sneakerstream.com.br",
      supportPhone: "+55 11 99999-9999",
      whatsapp: "+55 11 99999-9999",
      logoUrl: "/brand/logo-primary.png",
      faviconUrl: "/brand/favicon.png",
      primaryColor: "#575656",
      accentColor: "#550D1A",
      highlightColor: "#131313",
      offWhiteColor: "#FEFDFC",
      metaTitle: "Sneaker Stream | Tênis importados, exclusivos e autênticos",
      metaDescription:
        "E-commerce premium de sneakers importados com curadoria, autenticidade garantida e experiência de compra pensada para conversão.",
      shippingLeadText: "Despacho rápido e rastreio seguro para todo o Brasil.",
      announcementText: "Frete especial em pedidos selecionados e 5% OFF no PIX.",
      instagramUrl: "https://instagram.com/sneakerstream",
      tiktokUrl: "https://tiktok.com/@sneakerstream",
      freeShippingThresholdCents: 199900,
      pixDiscountPercentage: 5,
      authenticityMessage: "Todos os pares passam por conferência interna de autenticidade antes do envio.",
    },
  });

  await prisma.contentPage.createMany({
    data: [
      {
        slug: "sobre",
        title: "Sobre a Sneaker Stream",
        heroTitle: "Curadoria premium para quem compra autenticidade e estilo.",
        heroSubtitle: "Mais do que vender sneakers, a Sneaker Stream constrói desejo com credibilidade.",
        body: {
          sections: [
            {
              title: "Posicionamento",
              content:
                "A Sneaker Stream nasceu para atender um público que valoriza exclusividade, origem, acabamento e experiência de compra. Nossa seleção une desejo, autenticidade e leitura premium.",
            },
            {
              title: "Curadoria",
              content:
                "Cada par é escolhido pela força comercial da silhueta, relevância cultural e percepção de valor para o mercado brasileiro.",
            },
          ],
        },
        seoTitle: "Sobre a Sneaker Stream",
        seoDescription: "Conheça a proposta premium da Sneaker Stream.",
      },
      {
        slug: "faq",
        title: "FAQ",
        heroTitle: "Dúvidas frequentes",
        heroSubtitle: "Respostas claras para comprar com segurança.",
        body: {
          items: [
            {
              question: "Os produtos são autênticos?",
              answer: "Sim. Todos os pares passam por conferência interna e seguem o nosso padrão de autenticidade.",
            },
            {
              question: "Vocês enviam para todo o Brasil?",
              answer: "Sim. Trabalhamos com logística rastreável e comunicação transparente do status do pedido.",
            },
          ],
        },
        seoTitle: "FAQ Sneaker Stream",
        seoDescription: "Perguntas frequentes sobre compra, envio e autenticidade.",
      },
    ],
  });

  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: "drops@sneakerstream.com.br", name: "Lead VIP", source: "home-hero" },
      { email: "collector@sneakerstream.com.br", name: "Colecionador", source: "footer" },
    ],
  });

  const seededProducts = await prisma.product.findMany({
    include: {
      images: true,
      variants: { include: { size: true } },
    },
  });

  const orderProduct = seededProducts[0];
  const orderVariant = orderProduct.variants.find((variant) => variant.size.label === "41") ?? orderProduct.variants[0];

  await prisma.order.create({
    data: {
      userId: customer.id,
      shippingAddressId: address.id,
      orderNumber: "SS-20260413-0001",
      guestName: customer.name,
      guestEmail: customer.email,
      guestPhone: customer.phone,
      shippingAddressJson: {
        recipient: address.recipient,
        phone: address.phone,
        zipCode: address.zipCode,
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
      },
      subtotalCents: orderProduct.salePriceInCents ?? orderProduct.basePriceInCents,
      discountCents: 10000,
      shippingCents: 0,
      totalCents: (orderProduct.salePriceInCents ?? orderProduct.basePriceInCents) - 10000,
      couponCode: "STREAM10",
      status: OrderStatus.PAID,
      paymentMethod: PaymentMethod.PIX,
      paymentStatus: PaymentStatus.PAID,
      paymentReference: "PIX-SEED-001",
      placedAt: new Date(),
      paidAt: new Date(),
      items: {
        create: [
          {
            productId: orderProduct.id,
            variantId: orderVariant.id,
            productName: orderProduct.name,
            productSlug: orderProduct.slug,
            productSku: orderProduct.sku,
            sizeLabel: orderVariant.size.label,
            imageUrl: orderProduct.images[0]?.url ?? "",
            quantity: 1,
            unitPriceCents: orderProduct.salePriceInCents ?? orderProduct.basePriceInCents,
            lineTotalCents: orderProduct.salePriceInCents ?? orderProduct.basePriceInCents,
          },
        ],
      },
    },
  });

  await prisma.review.createMany({
    data: [
      {
        userId: customer.id,
        productId: orderProduct.id,
        rating: 5,
        title: "Compra segura e produto impecável",
        comment: "Acabamento excelente, envio rápido e experiência premium do início ao fim.",
        status: ReviewStatus.APPROVED,
        verifiedPurchase: true,
      },
      {
        userId: customer.id,
        productId: seededProducts[1].id,
        rating: 4,
        title: "Ótima escolha para uso diário",
        comment: "Tênis confortável, visual elegante e atendimento muito bom.",
        status: ReviewStatus.APPROVED,
        verifiedPurchase: false,
      },
    ],
  });

  await prisma.wishlistItem.create({
    data: {
      userId: customer.id,
      productId: seededProducts[2].id,
    },
  });

  const reviewStats = await prisma.review.groupBy({
    by: ["productId"],
    _avg: { rating: true },
    _count: { rating: true },
  });

  for (const stats of reviewStats) {
    await prisma.product.update({
      where: { id: stats.productId },
      data: {
        ratingAverage: stats._avg.rating ?? 0,
        reviewCount: stats._count.rating,
      },
    });
  }

  console.log("Seed concluído com sucesso.");
  console.log("Admin:", admin.email, "| senha: Sneaker@123");
  console.log("Cliente:", customer.email, "| senha: Cliente@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
