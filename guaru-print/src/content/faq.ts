import type { FaqItem } from "./types";

/**
 * Perguntas frequentes — editáveis pelo painel.
 * Respostas marcadas com `pending` falam em termos gerais e pedem confirmação
 * no WhatsApp, porque a política ainda não foi confirmada pela empresa.
 */
export const faq: FaqItem[] = [
  {
    id: "arquivos",
    question: "Quais arquivos posso enviar?",
    answer:
      "Pelo site você pode enviar PDF, PNG, JPG ou SVG. Para impressão, o ideal é PDF em alta resolução, com textos convertidos em curvas e cores em CMYK. Se você só tiver uma imagem ou um rascunho, envie mesmo assim: a equipe avalia e orienta os próximos passos.",
    order: 1,
  },
  {
    id: "tamanho-adesivo",
    question: "Como escolher o tamanho do adesivo?",
    answer:
      "Meça a superfície onde o adesivo será aplicado e considere a distância de quem vai ler. Use a calculadora de medidas do site para conferir área e proporção, e o simulador para visualizar a arte aplicada. Na dúvida, a equipe ajuda a definir.",
    order: 2,
  },
  {
    id: "criacao-arte",
    question: "Vocês fazem artes personalizadas?",
    answer:
      "Informe no orçamento que precisa de criação ou ajuste de arte. A equipe confirma pelo WhatsApp como funciona esse serviço para o seu pedido.",
    pending: true,
    order: 3,
  },
  {
    id: "orcamento",
    question: "Como funciona o orçamento?",
    answer:
      "Escolha o produto, informe medidas, quantidade e acabamento, envie sua arte (opcional) e seus dados. O site monta um resumo e abre o WhatsApp com tudo preenchido. A equipe analisa e retorna com valores e prazos — não há cobrança para solicitar.",
    order: 4,
  },
  {
    id: "envio",
    question: "Vocês enviam para outros estados?",
    answer:
      "Sim, a Guaru Print envia para todo o Brasil. Informe sua cidade e CEP no orçamento para que a equipe confirme a forma de envio e o prazo para a sua região.",
    order: 5,
  },
  {
    id: "instalacao",
    question: "Como funciona a instalação de fachadas?",
    answer:
      "A necessidade de instalação é informada no orçamento. As condições — região atendida, visita técnica e agendamento — são combinadas diretamente com a equipe para cada projeto.",
    pending: true,
    order: 6,
  },
  {
    id: "prazo",
    question: "Qual é o prazo de produção?",
    answer:
      "O prazo depende do produto, da quantidade e da aprovação da arte. Ele é informado junto com o orçamento.",
    order: 7,
  },
];
