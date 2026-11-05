import { slugify } from './core/slug.js';

/** Ponto de entrada do esqueleto: imprime o slug do argumento recebido (ou de um exemplo). */
export function main(args: readonly string[]): void {
  const title = args.join(' ') || 'Olá, Mundo!';
  console.log(slugify(title));
}

main(process.argv.slice(2));
