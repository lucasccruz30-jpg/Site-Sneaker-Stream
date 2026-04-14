import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";

import type { NavLink } from "@/types";

export const siteConfig = {
  name: "Sneaker Stream",
  title: "Sneaker Stream | Sneakers importados com curadoria premium",
  description:
    "Loja premium de tênis importados com foco em autenticidade, exclusividade e experiência de compra pensada para conversão.",
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
    "tênis importados",
    "sneakers premium",
    "streetwear premium",
    "jordans autênticos",
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
  { href: "/shop", label: "Shop", description: "Catálogo completo" },
  { href: "/drops", label: "Drops", description: "Lançamentos e exclusividades" },
  { href: "/autenticidade", label: "Autenticidade", description: "Compra com confiança" },
  { href: "/sobre", label: "Marca", description: "Posicionamento da Sneaker Stream" },
  { href: "/contato", label: "Contato", description: "Atendimento consultivo" },
];

export const institutionalLinks: NavLink[] = [
  { href: "/faq", label: "FAQ" },
  { href: "/politica-de-troca-e-devolucao", label: "Troca e devolução" },
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
  { href: "/admin/avaliacoes", label: "Avaliações" },
  { href: "/admin/conteudo", label: "Conteúdo" },
  { href: "/admin/relatorios", label: "Relatórios" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export const trustPillars = [
  {
    title: "Produtos autênticos",
    description: "Curadoria premium e conferência interna antes do envio.",
  },
  {
    title: "Envio seguro",
    description: "Rastreio, embalagem protegida e suporte próximo ao cliente.",
  },
  {
    title: "Atendimento rápido",
    description: "Respostas ágeis para destravar a compra sem atrito.",
  },
  {
    title: "Compra facilitada",
    description: "Checkout simples, PIX e fluxo otimizado para mobile.",
  },
];

export const testimonials = [
  {
    name: "Matheus Costa",
    role: "Cliente recorrente",
    quote: "Experiência premium de verdade. Atendimento rápido, produto impecável e entrega muito segura.",
  },
  {
    name: "Bruna Sales",
    role: "Colecionadora",
    quote: "A curadoria é muito acima da média. Dá para perceber confiança e cuidado em cada detalhe.",
  },
  {
    name: "Guilherme Nunes",
    role: "Streetwear enthusiast",
    quote: "Consegui um modelo difícil de achar e o processo foi direto, bonito e profissional.",
  },
];

export const instagramHighlights = [
  {
    title: "Curadoria diária",
    subtitle: "Looks, detalhes e drops em destaque",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Lifestyle premium",
    subtitle: "Sneakers com presença no dia a dia",
    image:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Exclusividade real",
    subtitle: "Grades limitadas e reposição seletiva",
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
    question: "Os produtos da Sneaker Stream são autênticos?",
    answer:
      "Sim. Trabalhamos com curadoria, conferência interna e comunicação clara sobre origem, condição e disponibilidade.",
  },
  {
    question: "Existe opção de pagamento por PIX?",
    answer: "Sim. O checkout já nasce preparado para PIX, com destaque comercial e benefício de desconto.",
  },
  {
    question: "O frete é calculado no checkout?",
    answer:
      "Sim. O cálculo é exibido no resumo do pedido e o fluxo prioriza clareza para reduzir abandono.",
  },
  {
    question: "Como acompanho meu pedido?",
    answer: "Na área de pedidos você acompanha status, código de rastreio e histórico da compra.",
  },
];
