/** Textos de la portada, el cierre y el pie. Los de la historia van en historia.ts. */
export const contenido: {
  antetitulo: string;
  entradilla: string;
  /** Llamada a la acción tras el repaso. Solo lo que se pueda promocionar hoy. Opcional. */
  cta?: {texto: string; boton: string; enlace: string};
  /** Casos y normas en que se apoyan las consecuencias. Se muestran en el pie. Opcional. */
  fuentes?: {texto: string; enlace: string}[];
  pie: string;
} = {
  antetitulo: 'IAcademy · Una historia en la que decides tú',
  entradilla:
    'Faltan 21 días para el Black Friday y te toca poner un agente de IA a contestar a los clientes. Qué datos le das, qué puede hacer solo, qué revisa una persona y qué haces cuando se equivoca. Hay cinco finales.',
  cta: {
    texto: 'Si quieres aprender a usar la IA en tu trabajo con criterio, empieza gratis en IAcademy.',
    boton: 'Empezar gratis',
    enlace: 'https://iacedemy.com/free',
  },
  fuentes: [
    {texto: 'Moffatt contra Air Canada, 2024 BCCRT 149 (chatbot y tarifa de duelo)', enlace: 'https://decisions.civilresolutionbc.ca/crt/crtd/en/525448/1/document.do'},
    {texto: 'El chatbot del concesionario Chevrolet de Watsonville y el Tahoe por 1 dólar (VentureBeat, 2023)', enlace: 'https://venturebeat.com/ai/a-chevy-for-1-car-dealer-chatbots-show-perils-of-ai-for-customer-service'},
    {texto: 'Cursor y el bot de soporte «Sam» que se inventó una política (AI Incident Database, 2025)', enlace: 'https://incidentdatabase.ai/entities/cursor-users/'},
    {texto: 'DPD desactiva su chatbot tras insultar a un cliente (ITV, 2024)', enlace: 'https://itv.com/news/2024-01-19/dpd-disables-ai-chatbot-after-customer-service-bot-appears-to-go-rogue'},
    {texto: 'Klarna vuelve a contratar personas en atención al cliente (Fortune, 2025)', enlace: 'https://fortune.com/2025/05/09/klarna-ai-humans-return-on-investment/'},
    {texto: 'MIT NANDA, «The GenAI Divide: State of AI in Business 2025» (Fortune)', enlace: 'https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/'},
    {texto: 'Reglamento (UE) 2024/1689 de inteligencia artificial, arts. 4 y 50', enlace: 'https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32024R1689'},
    {texto: 'RGPD, art. 5.1.c (minimización de datos)', enlace: 'https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679'},
  ],
  pie: 'Historia interactiva de IAcademy. Lanaria, sus personas y sus correos son ficticios; los casos citados en las notas son reales.',
};
