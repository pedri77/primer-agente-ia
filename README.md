# Tu primer agente de IA en la empresa

Historia interactiva de IAcademy. Faltan 21 días para el Black Friday y te toca poner un agente de IA a contestar el correo de clientes de Lanaria, una tienda online ficticia. Decides qué datos le das, qué puede hacer solo, qué revisa una persona y qué haces cuando se equivoca. Tiene 5 finales y un repaso de cada decisión.

Hecha con la skill `web-aventura` (Vite + React + Tailwind). Guion en `GUION.md`.

```bash
npm install
npm run dev        # http://127.0.0.1:3028/
npm test           # rutas a cada final
node scripts/validar_grafo.mjs
```

## Fuentes de las consecuencias

Lanaria, sus personas, sus correos y sus cifras son ficticios. Las consecuencias imitan casos documentados:

| Decisión | Caso o norma |
|---|---|
| Culpar al agente de lo que prometió | [Moffatt contra Air Canada, 2024 BCCRT 149](https://decisions.civilresolutionbc.ca/crt/crtd/en/525448/1/document.do): la aerolínea tuvo que pagar lo que dijo su chatbot. |
| Permisos de dinero sin límite | [Chatbot de Chevrolet de Watsonville que «aceptó» vender un Tahoe por 1 dólar](https://venturebeat.com/ai/a-chevy-for-1-car-dealer-chatbots-show-perils-of-ai-for-customer-service) (2023). |
| Firmar como persona | [Cursor y el bot «Sam»](https://incidentdatabase.ai/entities/cursor-users/) (2025, incidente 1039); [AI Act, art. 50](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32024R1689). |
| Enviar sin revisión | [DPD desactiva su chatbot tras insultar a un cliente](https://itv.com/news/2024-01-19/dpd-disables-ai-chatbot-after-customer-service-bot-appears-to-go-rogue) (2024). |
| Recortar plantilla tras el agente | [Klarna vuelve a contratar personas](https://fortune.com/2025/05/09/klarna-ai-humans-return-on-investment/) (2025). |
| Equipo fuera del proyecto | [MIT NANDA, «The GenAI Divide» (2025)](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/): los fracasos vienen de la integración, no del modelo; [AI Act, art. 4](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32024R1689) (alfabetización). |
| Conectar la carpeta entera | [RGPD, art. 5.1.c](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679) (minimización); dos versiones de una política en las fuentes, como en el caso Air Canada (el chatbot contradecía la página enlazada). |

Sin imágenes ni personajes generados con IA.
