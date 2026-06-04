# FIAP-javascript-calculator — Mapa de Integrações

## Visão Geral

```
          ┌─────────────────────────┐
          │ FIAP-javascript-calculator │
          └─────────────────────────┘
              ↑                 ↓
   (DOM: eventos do usuário)  (DOM: atualização de UI)
```

## Dependências de Saída (Outbound)

> O que este serviço chama/usa fora do seu próprio código (SDKs/recursos do navegador e integrações com infraestrutura).

| Serviço / Sistema | Tipo | Finalidade | Crítico? |
|---|---|---|---|
| Navegador (DOM) | SDK / Integração com UI | Ler `input`/`button` e atualizar elementos (ex.: elemento de resultado `id="result"`). | Sim |
| Navegador (`alert`/Dialogs) | SDK / Integração com UI | Exibir mensagens de erro/feedback para inputs vazios e divisão por zero. | Não |
| Navegador (Eventos: `click`, `keypress`) | Integração por eventos | Registrar handlers e reagir a interações do usuário (clique para operação; keypress para validações V2). | Sim |
| GitHub Actions (`.github/workflows/alicerce.yml`) | CI/CD | Pipeline automatizado para rotinas do repositório. | Não |

### Detalhes das integrações críticas

#### Navegador (DOM / Atualização de UI)
- **Endpoint/Tópico:** Elementos do documento (ex.: `id="result"`, `input` de valores, `button` com `name` da operação)
- **Autenticação:** Não aplicável
- **Comportamento em falha:** Se elementos/IDs esperados não existirem ou seletoras estiverem incorretas, o resultado/feedback pode não ser renderizado (falha local no cliente; sem retry).

#### Navegador (Eventos: `click`, `keypress`)
- **Endpoint/Tópico:** Eventos do navegador/DOM:
  - `click` em botões (handler usa `event.target.name` para decidir a operação no V2)
  - `keypress` nos inputs (V2 bloqueia `E`/`e` via `preventDefault`)
- **Autenticação:** Não aplicável
- **Comportamento em falha:** Se handlers não estiverem vinculados corretamente, as validações e a execução das operações não disparam (falha local no cliente; sem retry).

## Dependências de Entrada (Inbound)

> Quem “chama” (aciona) este serviço: interações do usuário via navegador.

| Chamador | Tipo | O que usa |
|---|---|---|
| Navegador (Usuário / DOM) | Event | `click` nos botões da calculadora para executar soma/subtração/multiplicação/divisão |
| Navegador (Usuário / DOM) | Event | `keypress` nos inputs numéricos (modo V2) para impedir notação científica (`E`/`e`) |

## Eventos

### Publica
| Evento | Tópico/Exchange | Consumidores conhecidos |
|---|---|---|
| PREENCHER | PREENCHER | PREENCHER |

### Consome
| Evento | Origem | Ação executada |
|---|---|---|
| `click (button)` | Navegador (DOM) | Lê os dois inputs; valida vazio; identifica operação (no V2 via `event.target.name`); executa operação; bloqueia divisão por zero; atualiza UI com `innerText` no elemento `id="result"` (ou equivalente na versão V1). |
| `keypress (first-input)` | Navegador (DOM) (V2) | Se tecla for `E`/`e`, chama `preventDefault()` para bloquear notação científica. |
| `keypress (second-input)` | Navegador (DOM) (V2) | Se tecla for `E`/`e`, chama `preventDefault()` para bloquear notação científica. |

---  
> ⚠️ Rascunho gerado automaticamente pelo Alicerce by Malha. Valide os endpoints e tópicos com o código antes de mergear.