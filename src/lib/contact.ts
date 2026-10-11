/** Validação compartilhada (cliente e servidor) do formulário de contato. */

export type ContactPayload = {
  name: string;
  phone: string;
  treatment: string;
  message: string;
  consent: boolean;
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export const MESSAGE_MAX = 500;

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

/** Máscara simples para telefones brasileiros: (13) 99999-9999 */
export function formatPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function validateContact(data: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  const name = data.name.trim();
  if (name.length < 2) errors.name = "Informe seu nome.";
  else if (name.length > 80) errors.name = "Use no máximo 80 caracteres.";

  const phone = onlyDigits(data.phone);
  if (phone.length < 10 || phone.length > 11) errors.phone = "Informe um telefone válido com DDD.";

  if (!data.treatment) errors.treatment = "Selecione um tratamento de interesse.";
  if (data.message.length > MESSAGE_MAX) errors.message = `Use no máximo ${MESSAGE_MAX} caracteres.`;
  if (!data.consent) errors.consent = "É necessário autorizar o contato para continuar.";
  return errors;
}
