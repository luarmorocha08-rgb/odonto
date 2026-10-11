/**
 * Tratamentos exibidos no site.
 *
 * ⚠️ CONTEÚDO PROVISÓRIO — sujeito à confirmação e revisão da profissional
 * responsável antes da publicação. Os textos são informativos e gerais; não
 * substituem avaliação individual e não prometem resultados.
 *
 * Para ocultar um tratamento, defina `published: false`.
 * Para trocar a foto, coloque o arquivo em /public/images e preencha `image.src`.
 */

import type { MediaAsset } from "./types";

export type Treatment = {
  slug: string;
  name: string;
  /** Rótulo curto exibido no card. */
  category: string;
  published: boolean;
  short: string;
  benefits: string[];
  image: MediaAsset;
  seo: { title: string; description: string };
  detail: {
    intro: string;
    howItWorks: string[];
    indications: string[];
    benefits: string[];
    care: string[];
    faq: { question: string; answer: string }[];
  };
};

const DISCLAIMER_FAQ = {
  question: "O resultado é garantido?",
  answer:
    "Nenhum procedimento de saúde tem resultado garantido. A resposta varia de pessoa para pessoa, e as possibilidades e limitações do seu caso são explicadas na avaliação.",
};

export const treatments: Treatment[] = [
  {
    slug: "harmonizacao-facial",
    name: "Harmonização Facial",
    category: "Face",
    published: true,
    short:
      "Um planejamento que observa o rosto como um todo, buscando equilíbrio entre as proporções e respeitando seus traços.",
    benefits: ["Planejamento individual", "Abordagem integrada", "Foco em naturalidade"],
    image: { src: null, alt: "Rosto feminino em luz suave, representando harmonização facial", art: "profile" },
    seo: {
      title: "Harmonização Facial em Santos",
      description:
        "Harmonização facial em Santos/SP com planejamento individualizado e foco em resultados naturais. Agende uma avaliação na J.A Odontologia Estética.",
    },
    detail: {
      intro:
        "A harmonização facial reúne diferentes procedimentos que podem ser combinados conforme a necessidade de cada pessoa. O ponto de partida é sempre uma avaliação cuidadosa das proporções, da expressão e das expectativas do paciente.",
      howItWorks: [
        "Conversa inicial para entender o que incomoda e o que você deseja preservar.",
        "Análise facial e definição de um plano, que pode envolver uma ou mais técnicas.",
        "Execução em etapas, quando indicado, com acompanhamento da evolução.",
      ],
      indications: [
        "Pessoas que desejam suavizar assimetrias ou sinais do envelhecimento.",
        "Quem busca realçar contornos de forma discreta.",
        "A indicação final depende da avaliação profissional.",
      ],
      benefits: [
        "Plano construído a partir das suas características.",
        "Possibilidade de combinar técnicas de forma equilibrada.",
        "Abordagem que prioriza naturalidade.",
      ],
      care: [
        "Podem ocorrer inchaço, vermelhidão ou pequenos hematomas temporários.",
        "Existem contraindicações (como gestação e algumas condições de saúde) avaliadas previamente.",
        "Siga as orientações pós-procedimento passadas pela profissional.",
      ],
      faq: [
        {
          question: "A harmonização deixa o rosto artificial?",
          answer:
            "O objetivo do planejamento na J.A é justamente evitar exageros. A proposta é realçar, não transformar — e isso é discutido com você antes de qualquer procedimento.",
        },
        DISCLAIMER_FAQ,
      ],
    },
  },
  {
    slug: "clareamento-dental",
    name: "Clareamento Dental",
    category: "Sorriso",
    published: true,
    short:
      "Tratamento para deixar os dentes mais claros, conduzido com acompanhamento profissional e respeito à saúde bucal.",
    benefits: ["Avaliação prévia da saúde bucal", "Protocolo orientado", "Acompanhamento"],
    image: { src: null, alt: "Sorriso em luz natural, representando clareamento dental", art: "smile" },
    seo: {
      title: "Clareamento Dental em Santos",
      description:
        "Clareamento dental em Santos/SP com avaliação prévia e acompanhamento profissional. Agende uma avaliação na J.A Odontologia Estética.",
    },
    detail: {
      intro:
        "O clareamento dental utiliza agentes clareadores para reduzir pigmentações e deixar a cor dos dentes mais clara. Antes de iniciar, é importante avaliar a saúde dos dentes e da gengiva.",
      howItWorks: [
        "Avaliação da saúde bucal e registro da cor inicial.",
        "Definição da técnica — em consultório, caseira supervisionada ou combinada.",
        "Acompanhamento durante o tratamento para ajustar o protocolo, se necessário.",
      ],
      indications: [
        "Dentes naturais com escurecimento ou manchas compatíveis com a técnica.",
        "Restaurações, facetas e coroas não clareiam — isso é avaliado antes.",
        "A indicação depende da avaliação profissional.",
      ],
      benefits: [
        "Dentes com tonalidade mais clara.",
        "Procedimento conservador, sem desgaste dental.",
        "Protocolo adaptado à sensibilidade de cada pessoa.",
      ],
      care: [
        "Sensibilidade temporária pode ocorrer durante o tratamento.",
        "Alimentos e bebidas com corantes podem ser restringidos por um período.",
        "A durabilidade varia conforme hábitos e cuidados de manutenção.",
      ],
      faq: [
        {
          question: "O clareamento enfraquece os dentes?",
          answer:
            "Quando indicado e acompanhado por profissional, o clareamento não tem como objetivo desgastar a estrutura dental. Os cuidados e possíveis efeitos são explicados na avaliação.",
        },
        DISCLAIMER_FAQ,
      ],
    },
  },
  {
    slug: "toxina-botulinica",
    name: "Toxina Botulínica",
    category: "Face",
    published: true,
    short:
      "Aplicação que pode suavizar linhas de expressão, com dosagem planejada para manter a naturalidade dos movimentos.",
    benefits: ["Procedimento rápido", "Planejamento de dosagem", "Expressão preservada"],
    image: { src: null, alt: "Detalhe de rosto em luz suave, representando toxina botulínica", art: "arch" },
    seo: {
      title: "Toxina Botulínica em Santos",
      description:
        "Aplicação de toxina botulínica em Santos/SP com planejamento individual e foco em naturalidade. Agende uma avaliação na J.A Odontologia Estética.",
    },
    detail: {
      intro:
        "A toxina botulínica atua relaxando temporariamente músculos específicos. Na estética, pode ser utilizada para suavizar linhas de expressão; na odontologia, também possui indicações funcionais avaliadas caso a caso.",
      howItWorks: [
        "Avaliação da musculatura e da sua expressão facial.",
        "Definição dos pontos e da dosagem adequados.",
        "Retorno para acompanhar o efeito, conforme orientação profissional.",
      ],
      indications: [
        "Linhas de expressão dinâmicas, como na testa e ao redor dos olhos.",
        "Algumas indicações funcionais, como o bruxismo, após avaliação.",
        "A indicação depende da avaliação profissional.",
      ],
      benefits: [
        "Aparência mais descansada, respeitando a expressão.",
        "Procedimento rápido, geralmente com retorno às atividades no mesmo dia.",
        "Efeito temporário e gradual.",
      ],
      care: [
        "O efeito é temporário e a duração varia de pessoa para pessoa.",
        "Há contraindicações, como gestação, amamentação e algumas condições neuromusculares.",
        "Siga as recomendações pós-aplicação nas primeiras horas.",
      ],
      faq: [
        {
          question: "Vou perder a expressão do rosto?",
          answer:
            "O planejamento busca suavizar, não paralisar. A dosagem é pensada para manter movimentos naturais, e isso é conversado na avaliação.",
        },
        DISCLAIMER_FAQ,
      ],
    },
  },
  {
    slug: "preenchimento-labial",
    name: "Preenchimento Labial",
    category: "Lábios",
    published: true,
    short:
      "Procedimento que pode realçar contorno, hidratação e volume dos lábios, sempre em proporção ao seu rosto.",
    benefits: ["Proporção facial", "Volume planejado", "Técnica delicada"],
    image: { src: null, alt: "Detalhe de lábios em luz suave, representando preenchimento labial", art: "lips" },
    seo: {
      title: "Preenchimento Labial em Santos",
      description:
        "Preenchimento labial em Santos/SP com planejamento proporcional e foco em naturalidade. Agende uma avaliação na J.A Odontologia Estética.",
    },
    detail: {
      intro:
        "O preenchimento labial geralmente utiliza ácido hialurônico para trabalhar contorno, volume e hidratação dos lábios. A quantidade e a técnica são definidas a partir das proporções do seu rosto.",
      howItWorks: [
        "Avaliação do formato, da simetria e das proporções faciais.",
        "Definição do objetivo: contorno, hidratação, volume ou combinação.",
        "Aplicação com técnica delicada e orientações de cuidado posterior.",
      ],
      indications: [
        "Lábios com perda de volume ou definição.",
        "Pequenas assimetrias.",
        "A indicação depende da avaliação profissional.",
      ],
      benefits: [
        "Realce do contorno de forma proporcional.",
        "Possibilidade de resultados graduais.",
        "Planejamento que respeita a identidade do rosto.",
      ],
      care: [
        "Inchaço e sensibilidade nos primeiros dias são esperados.",
        "Existem riscos e contraindicações, explicados antes do procedimento.",
        "O resultado final costuma ser avaliado após a redução do inchaço.",
      ],
      faq: [
        {
          question: "Posso escolher o tamanho dos lábios?",
          answer:
            "Suas preferências são sempre ouvidas. A proposta da clínica é encontrar um resultado harmônico com o restante do rosto, e isso é alinhado durante a avaliação.",
        },
        DISCLAIMER_FAQ,
      ],
    },
  },
  {
    slug: "rinomodelacao",
    name: "Rinomodelação",
    category: "Face",
    published: true,
    short:
      "Técnica não cirúrgica que pode suavizar pequenas irregularidades do perfil nasal, mediante avaliação criteriosa.",
    benefits: ["Não cirúrgico", "Avaliação criteriosa", "Ajustes sutis"],
    image: { src: null, alt: "Perfil feminino em luz suave, representando rinomodelação", art: "profile" },
    seo: {
      title: "Rinomodelação em Santos",
      description:
        "Rinomodelação não cirúrgica em Santos/SP mediante avaliação criteriosa. Conheça indicações e cuidados na J.A Odontologia Estética.",
    },
    detail: {
      intro:
        "A rinomodelação é um procedimento não cirúrgico que pode suavizar pequenas irregularidades do nariz por meio de preenchimento. Não substitui a cirurgia e possui indicações bem específicas.",
      howItWorks: [
        "Avaliação detalhada do perfil e da estrutura nasal.",
        "Explicação clara do que é possível — e do que não é — com a técnica.",
        "Aplicação cuidadosa e acompanhamento posterior.",
      ],
      indications: [
        "Pequenas irregularidades no dorso nasal.",
        "Pessoas que entendem as limitações de uma técnica não cirúrgica.",
        "A indicação depende da avaliação profissional.",
      ],
      benefits: [
        "Procedimento sem cortes.",
        "Ajustes sutis no perfil.",
        "Planejamento integrado à harmonia do rosto.",
      ],
      care: [
        "É uma região delicada, que exige avaliação e técnica criteriosas.",
        "Riscos e contraindicações são explicados antes do procedimento.",
        "Siga rigorosamente as orientações pós-procedimento.",
      ],
      faq: [
        {
          question: "A rinomodelação substitui a rinoplastia?",
          answer:
            "Não. Trata-se de uma técnica não cirúrgica com limitações próprias. Na avaliação, você entende se ela faz sentido para o seu caso.",
        },
        DISCLAIMER_FAQ,
      ],
    },
  },
  {
    slug: "odontologia-estetica",
    name: "Odontologia Estética",
    category: "Sorriso",
    published: true,
    short:
      "Cuidados voltados à forma, cor e harmonia do sorriso, planejados em equilíbrio com a saúde bucal.",
    benefits: ["Saúde e estética juntas", "Planejamento do sorriso", "Abordagem conservadora"],
    image: { src: null, alt: "Sorriso natural em luz suave, representando odontologia estética", art: "smile" },
    seo: {
      title: "Odontologia Estética em Santos",
      description:
        "Odontologia estética em Santos/SP: planejamento do sorriso com equilíbrio entre saúde e estética. Agende uma avaliação na J.A Odontologia Estética.",
    },
    detail: {
      intro:
        "A odontologia estética reúne procedimentos que cuidam da aparência do sorriso — forma, cor, proporção e alinhamento visual — sem deixar de lado a saúde dos dentes e da gengiva.",
      howItWorks: [
        "Avaliação clínica do sorriso e da saúde bucal.",
        "Planejamento com as alternativas possíveis para o seu caso.",
        "Execução por etapas, com acompanhamento.",
      ],
      indications: [
        "Quem deseja melhorar cor, forma ou proporção dos dentes.",
        "Pequenas imperfeições, desgastes ou restaurações antigas.",
        "A indicação depende da avaliação profissional.",
      ],
      benefits: [
        "Sorriso planejado em harmonia com o rosto.",
        "Prioridade a soluções conservadoras, quando possível.",
        "Integração entre estética e saúde.",
      ],
      care: [
        "Cada técnica tem indicações, limitações e cuidados próprios.",
        "Consultas de manutenção ajudam a preservar os resultados.",
        "Hábitos de higiene e alimentação influenciam a durabilidade.",
      ],
      faq: [
        {
          question: "Quais procedimentos fazem parte da odontologia estética?",
          answer:
            "Depende da necessidade de cada pessoa. As opções disponíveis na clínica e indicadas para o seu caso são apresentadas na avaliação.",
        },
        DISCLAIMER_FAQ,
      ],
    },
  },
];

export const publishedTreatments = treatments.filter((t) => t.published);

export function getTreatment(slug: string) {
  return publishedTreatments.find((t) => t.slug === slug);
}
