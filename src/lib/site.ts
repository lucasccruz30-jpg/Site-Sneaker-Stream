import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";

import type { NavLink } from "@/types";

export const siteConfig = {
  name: "Sneaker Stream",
  title: "Sneaker Stream | Sneakers importados com curadoria premium",
  description:
    "Loja premium de tenis importados com foco em autenticidade, exclusividade e uma jornada de compra pensada para converter.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    "http://localhost:3000",
  ogImage: "/brand/logo-primary.png",
  keywords: [
    "sneaker stream",
    "tenis importados",
    "sneakers premium",
    "streetwear premium",
    "jordans autenticos",
    "nike dunk importado",
  ],
  colors: {
    charcoal: "#575656",
    black: "#131313",
    wine: "#550D1A",
    offWhite: "#FEFDFC",
    warmGray: "#95898A",
    lightGray: "#D4CACA",
  },
};

export const mainNavigation: NavLink[] = [
  { href: "/shop", label: "Shop", description: "Catalogo completo" },
  { href: "/drops", label: "Drops", description: "Lancamentos e exclusividades" },
  { href: "/autenticidade", label: "Autenticidade", description: "Compra com confianca" },
  { href: "/sobre", label: "Marca", description: "Posicionamento da Sneaker Stream" },
  { href: "/contato", label: "Contato", description: "Atendimento consultivo" },
];

export const institutionalLinks: NavLink[] = [
  { href: "/faq", label: "FAQ" },
  { href: "/politica-de-troca-e-devolucao", label: "Troca e devolucao" },
  { href: "/politica-de-entrega", label: "Entrega" },
  { href: "/politica-de-privacidade", label: "Privacidade" },
  { href: "/termos-de-uso", label: "Termos de uso" },
];

export const accountLinks: NavLink[] = [
  { href: "/minha-conta", label: "Minha conta" },
  { href: "/meus-pedidos", label: "Meus pedidos" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/login", label: "Entrar" },
];

export const adminNavigation: NavLink[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/marcas", label: "Marcas" },
  { href: "/admin/estoque", label: "Estoque" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/cupons", label: "Cupons" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/avaliacoes", label: "Avaliacoes" },
  { href: "/admin/conteudo", label: "Conteudo" },
  { href: "/admin/relatorios", label: "Relatorios" },
  { href: "/admin/configuracoes", label: "Configuracoes" },
];

export const trustPillars = [
  {
    title: "Autenticidade verificada",
    description: "Cada par passa por conferencia interna antes do despacho, com leitura de produto e origem.",
  },
  {
    title: "Envio seguro",
    description: "Rastreio, embalagem protegida e atualizacao clara em cada etapa da entrega.",
  },
  {
    title: "Atendimento consultivo",
    description: "Suporte agil para tirar duvidas de numeracao, autenticidade e pagamento sem atrito.",
  },
  {
    title: "Checkout pensado para converter",
    description: "Fluxo direto, PIX com destaque comercial e experiencia otimizada para mobile.",
  },
];

export const testimonials = [
  {
    name: "Matheus Costa",
    role: "Cliente recorrente",
    quote: "A compra foi direta, o atendimento respondeu rapido e o par chegou exatamente como esperado. Passa muita seguranca.",
  },
  {
    name: "Bruna Sales",
    role: "Colecionadora",
    quote: "A curadoria foge do generico. O site e o atendimento fazem a loja parecer muito mais seria do que a media.",
  },
  {
    name: "Guilherme Nunes",
    role: "Streetwear enthusiast",
    quote: "Consegui um modelo dificil de achar com uma experiencia limpa, premium e sem enrolacao no checkout.",
  },
];

export const instagramHighlights = [
  {
    title: "Curadoria diaria",
    subtitle: "Looks, detalhes e drops em destaque",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Lifestyle premium",
    subtitle: "Sneakers com presenca no dia a dia",
    image:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Exclusividade real",
    subtitle: "Grades limitadas e reposicao seletiva",
    image:
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80",
  },
];

export const socialLinks = [
  { href: "https://instagram.com/sneakerstream", label: "Instagram", icon: FaInstagram },
  { href: "https://tiktok.com/@sneakerstream", label: "TikTok", icon: FaTiktok },
  { href: "https://wa.me/5511999999999", label: "WhatsApp", icon: FaWhatsapp },
];

export const faqs = [
  {
    question: "Os produtos da Sneaker Stream sao autenticos?",
    answer:
      "Sim. Trabalhamos com curadoria, conferencia interna e comunicacao clara sobre origem, condicao e disponibilidade.",
  },
  {
    question: "Existe opcao de pagamento por PIX?",
    answer: "Sim. O checkout ja nasce preparado para PIX, com destaque comercial e beneficio de desconto.",
  },
  {
    question: "O frete e calculado no checkout?",
    answer:
      "Sim. O calculo e exibido no resumo do pedido e o fluxo prioriza clareza para reduzir abandono.",
  },
  {
    question: "Como acompanho meu pedido?",
    answer: "Na area de pedidos voce acompanha status, codigo de rastreio e historico da compra.",
  },
];
