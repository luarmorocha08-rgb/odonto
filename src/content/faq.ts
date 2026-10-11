/**
 * Perguntas frequentes — respostas editáveis, a serem validadas pela clínica.
 */
export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "Como funciona a primeira avaliação?",
    answer:
      "É um momento de conversa e análise. Entendemos o que você deseja, avaliamos suas características e apresentamos as possibilidades de tratamento adequadas ao seu caso — sem compromisso de realizar qualquer procedimento.",
  },
  {
    question: "Como posso agendar meu atendimento?",
    answer:
      "Pelo WhatsApp, usando qualquer botão “Agendar avaliação” do site, ou pelo formulário de contato. A equipe retorna para combinar o melhor dia e horário.",
  },
  {
    question: "Quais tratamentos a clínica oferece?",
    answer:
      "Atuamos com odontologia estética e harmonização facial. Na seção Tratamentos você encontra os procedimentos disponíveis e pode conhecer cada um em detalhes.",
  },
  {
    question: "Os tratamentos são personalizados?",
    answer:
      "Sim. Cada plano é construído a partir da avaliação individual, considerando suas características, expectativas e saúde. Não trabalhamos com protocolos padronizados para todos.",
  },
  {
    question: "Como recebo orientações sobre valores?",
    answer:
      "Os valores dependem do planejamento de cada caso e são apresentados após a avaliação. Para dúvidas iniciais, fale com a equipe pelo WhatsApp.",
  },
  {
    question: "Onde fica a clínica?",
    answer:
      "A J.A Odontologia Estética fica na Avenida Ana Costa, em Santos — SP. Na seção Contato você encontra o mapa e o botão “Como chegar”. O atendimento é de segunda a sábado, das 9h às 18h.",
  },
];
