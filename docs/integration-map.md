# FIAP-javascript-calculator — Mapa de Integrações

## Visão Geral

```
            (navegador/DOM)
      ┌─────────────────────────┐
      │  FIAP-javascript-calculator│
      └─────────────────────────┘
         ↑               ↓
  [usuário/DOM]     [atualiza UI]
  (eventos)          (resultado/histórico)
```

## Dependências de Saída (Outbound)

> Este serviço é uma aplicação front-end estática (HTML/CSS/JavaScript) e **não realiza chamadas HTTP externas**, **não usa banco de dados**, **não integra com filas** e **não publica/consome eventos de mensageria**. Integrações observadas são exclusivamente com o **DOM do navegador** (eventos e manipulação de elementos).

| Serviço / Sistema | Tipo | Finalidade | Crítico? |
|---|---|---|---|
| Navegador (DOM/Window) | Event / UI | Escutar `click` e `keypress` para disparar cálculos/validações e atualizar campos de resultado e histórico na página | Não |
| Navegador (Alert/Dialogs) | UI | Exibir avisos/erros ao usuário (ex.: divisão por zero; inputs vazios) | Não |
| `eval()` (v1) | Função de runtime | Executar expressão montada da calculadora (v1) | Não |

### Detalhes das integrações críticas
> **Não há integrações outbound críticas** identificadas. As interações são locais ao navegador.

## Dependências de Entrada (Inbound)

> Quem “chama” o serviço aqui é o **navegador/usuário** por meio de eventos no DOM.

| Chamador | Tipo | O que usa |
|---|---|---|
| Navegador (DOM) | Event | `click` nos botões (atributo `name` para identificar operação) |
| Navegador (DOM) | Event | `keypress` nos inputs (bloqueio de `e`/`E` para evitar notação científica) |
| Navegador (DOM) | Event | `keypress` no campo de expressão v1 (teclas permitidas + Enter para disparar cálculo) |

## Eventos

> Eventos aqui são **eventos do DOM** (não mensageria externa).

### Publica
| Evento | Tópico/Exchange | Consumidores conhecidos |
|---|---|---|
| PREENCHER | PREENCHER | PREENCHER |

### Consome
| Evento | Origem | Ação executada |
|---|---|---|
| `click (button)` | Navegador/DOM | Identifica operação pelo atributo `name` do botão, executa validações (V2), chama função de operação e atualiza a UI (resultado) |
| `keypress (inputs)` | Navegador/DOM | V2: bloqueia tecla `E`/`e` nos inputs para impedir notação científica |
| `keypress (campo de expressão v1)` | Navegador/DOM | V1: processa teclas permitidas para montar expressão e, ao detectar Enter (`=` ou `13`), dispara cálculo |

---
> ⚠️ Rascunho gerado automaticamente pelo Alicerce by Malha. Valide os endpoints e tópicos com o código antes de mergear.