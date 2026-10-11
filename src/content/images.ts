/**
 * Fotografias institucionais.
 *
 * Coloque os arquivos em /public/images e informe o caminho em `src`.
 * Enquanto `src` for `null`, o site mostra uma ilustração na identidade da
 * marca (arcos, linhas finas e pérola), decorativa.
 */
import type { MediaAsset } from "./types";

export const images = {
  hero: {
    src: null,
    alt: "Paciente sorrindo em ambiente de luz suave na J.A Odontologia Estética",
    art: "portrait",
  },
  about: {
    src: null,
    alt: "Profissional da J.A Odontologia Estética no consultório",
    art: "clinic",
  },
  aboutDetail: {
    src: null,
    alt: "Detalhe do ambiente da clínica",
    art: "arch",
  },
  statement: {
    src: null,
    alt: "Ambiente da clínica J.A Odontologia Estética",
    art: "clinic",
  },
  contact: {
    src: null,
    alt: "Recepção da J.A Odontologia Estética",
    art: "arch",
  },
} satisfies Record<string, MediaAsset>;
