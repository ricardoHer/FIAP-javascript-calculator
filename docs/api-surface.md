# FIAP-javascript-calculator — Superfície de API

## Visão Geral
- **Tipo:** REST / GraphQL / gRPC: **Sem API server-side**
- **Base URL:** **PREENCHER**
- **Autenticação:** **sem auth**
- **Formato:** **PREENCHER**

> Este repositório é uma aplicação **front-end estática** (HTML/CSS/JavaScript). A “superfície de API” observável consiste apenas em **eventos de interface (DOM)** e regras de cálculo/validação executadas no navegador, **sem endpoints HTTP** e **sem schema de dados externo**.

---

## Endpoints

Não aplicável: **não existem rotas HTTP (`GET/POST/...`)** nem recursos consumidos por rede descritos no repositório.

---

## Eventos (Superfície de Interação da Aplicação)

### `click (button)`
**Descrição:** Ao clicar em um botão, a aplicação identifica a operação pelo atributo **`name`** do botão, valida os inputs e executa a função correspondente, atualizando a área de exibição do resultado.

**Request (origem do evento):**
```json
{
  "event": "click",
  "target": {
    "type": "button",
    "name": "PREENCHER — valor do atributo name que indica a operação (ex.: soma/subtração/multiplicação/divisão)"
  }
}
```

**Response (efeitos na UI):**
```json
{
  "ui": {
    "result": "atualizado com innerText — valor numérico ou mensagem de erro conforme regras"
  }
}
```

**Erros comuns:**
| Status | Quando ocorre |
|---|---|
| 400 | PREENCHER (não existe HTTP; erros aparecem via `alert`/não cálculo no DOM) |
| 404 | PREENCHER |
| 422 | PREENCHER |

> Observação: o comportamento de “erro” é feito via **`alert(...)`** e/ou substituição do campo de resultado, não por códigos HTTP.

---

### `keypress (inputs) — V2`
**Descrição:** Impede que o usuário digite a letra **`E`** ou **`e`** nos campos do primeiro e segundo valor, evitando notação científica.

**Request (origem do evento):**
```json
{
  "event": "keypress",
  "target": {
    "type": "input",
    "role": "primeiro ou segundo valor"
  },
  "key": "e|E"
}
```

**Response (efeitos na UI):**
```json
{
  "ui": {
    "input": "não aceita o caractere 'e'/'E' (bloqueio do evento)"
  }
}
```

**Erros comuns:**
| Status | Quando ocorre |
|---|---|
| 400 | PREENCHER |
| 404 | PREENCHER |
| 422 | PREENCHER |

---

### `keypress (campo de expressão v1)`
**Descrição:** Em V1, processa teclas permitidas para montar uma expressão numérica e dispara o cálculo ao pressionar **Enter** (equivalente a `=` ou código `13`).

**Request (origem do evento):**
```json
{
  "event": "keypress",
  "target": {
    "type": "input/textarea",
    "role": "campo de expressão"
  },
  "key": "=",
  "keyCode": 13
}
```

**Response (efeitos na UI):**
```json
{
  "ui": {
    "result": "calculado e exibido conforme a expressão montada (v1), com regras de Infinity/Divisão por 0"
  }
}
```

**Erros comuns:**
| Status | Quando ocorre |
|---|---|
| 400 | PREENCHER |
| 404 | PREENCHER |
| 422 | PREENCHER |

---

## Autenticação e Autorização
- **sem autenticação** (aplicação local no navegador).
- Não existem roles/escopos por endpoint porque **não há endpoints**.

---

## Regras de Negócio Aplicadas na UI (Contratos funcionais)

### Divisão por zero — V2
**Regra:** se o **segundo valor** for `0`, exibir alerta:
- **Mensagem:** `"Não é possível efetuar a divisão por zero"`
- **Efeito:** **não efetua a conta** e **não atualiza** o resultado com valor calculado (atualiza conforme implementação; a regra explicitada é não executar a conta).

### Validação de inputs vazios — V2
**Regra:** ao tentar calcular por clique, se o **primeiro ou segundo input estiver vazio**:
- **Efeito:** exibir alerta e **impedir cálculo**
- **Mensagem:** **PREENCHER** (não informada no acúmulo além da regra)

### Bloqueio de repetição de cálculo — V1
**Regra:** ao tentar calcular novamente após operação concluída (evento/conceito `operationFinished`), o cálculo **não é executado**.

### Montagem de expressão — V1
**Regra:** cálculo via expressão montada só ocorre se houver ao menos **2 termos**:
- condição: `mountCount().length > 1`

### Infinity em resultado — V1
**Regra:** se o resultado da expressão for `Infinity` ou `-Infinity`:
- **Mensagem no campo de resultado:** `"Divisão por 0"`

### Impedir notação científica — V2
**Regra:** bloquear digitação de `E`/`e` nos inputs de valor.

---

## Versionamento
- Existem **duas versões comportamentais** na base:
  - **V1:** cálculo via **montagem de expressão** (usa `eval` conforme descrito) e regras de `Infinity` e `mountCount`.
  - **V2:** cálculo por **operações definidas em botões**, com validação (inputs vazios e divisão por zero) e bloqueio de `E/e`.

> **PREENCHER** estratégia de versionamento formal (não há semver em endpoints, pois não existe API HTTP).

---

> ⚠️ Rascunho gerado automaticamente pelo Alicerce by Malha. Valide os contratos com o código/OpenAPI spec antes de mergear.