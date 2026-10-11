/**
 * Depoimentos.
 *
 * ⚠️ Somente depoimentos reais e autorizados. Enquanto a lista estiver vazia,
 * a seção fica oculta no site publicado.
 */
export type Testimonial = {
  id: string;
  /** Nome ou iniciais, conforme autorizado pelo paciente. */
  author: string;
  text: string;
  /** Tratamento relacionado (opcional). */
  treatment?: string;
  consentOnFile: true;
};

export const testimonials: Testimonial[] = [];
