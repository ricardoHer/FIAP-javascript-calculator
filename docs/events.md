# FIAP-javascript-calculator — Catálogo de Eventos e Comunicação

## Tipo de Comunicação
> Comunicação **exclusivamente no navegador (DOM)**, orientada a **eventos de UI** (cliques e keypress/teclado).  
> **Não há** integração com message broker (MQ), pub/sub de domain events, filas, nem comunicação tempo real (WebSocket/gRPC).

## Eventos Publicados (Domain Events)
> Este serviço não publica domain events.

### PREENCHER
- **Quando:** PREENCHER
- **Payload principal:** PREENCHER
- **Consumidores conhecidos:** PREENCHER

## Eventos Consumidos (Domain Events)
> Este serviço não consome domain events.

### PREENCHER
- **Origem:** PREENCHER
- **O que faz:** PREENCHER

## Packets de Comunicação (Tempo Real)
> Este serviço não utiliza comunicação tempo real (WebSocket/SignalR/gRPC streaming).

## Eventos de Comunicação (UI — DOM)

### click (button)
- **Direção:** Usuário (UI) → Navegador/DOM → `FIAP-javascript-calculator`
- **Propósito:** Disparar operações (somar/subtrair/multiplicar/dividir) identificando o tipo de operação pelo atributo **`name`** do botão; executar a função correspondente e atualizar a UI com o resultado.
- **Quando:** Sempre que o usuário clica em um botão de operação.
- **Efeitos observados (por versão):**
  - **V2_Bruno / v2 (`V2_Bruno/js/scripts.js`):**
    - Valida se o primeiro e/ou segundo input estão vazios; se vazio, **exibe alerta** e **impede cálculo**.
    - Para divisão, valida divisor **0**; se divisor for 0, **exibe alerta** `"Não é possível efetuar a divisão por zero"` e **não efetua** a conta.
    - Atualiza o elemento de resultado (ex.: `result` com `innerText`).
  - **V1 (`js/script.js`):**
    - Pode atualizar resultado/histórico com base na expressão montada e regras de cálculo (ex.: tratamento de `Infinity/-Infinity` como `"Divisão por 0"` e não executar cálculo após operação finalizada).

### keypress (inputs: bloqueio de “e”/“E”) — V2
- **Direção:** Usuário (teclado) → Navegador/DOM → `FIAP-javascript-calculator`
- **Propósito:** Bloquear o caractere **`e`** ou **`E`** nos inputs numéricos para evitar notação científica.
- **Quando:** Durante a digitação nos inputs do **primeiro** e **segundo** valor (V2).
- **Efeito observado:** se a tecla for `e`/`E`, a entrada é bloqueada (prevenção no handler do keypress).

### keypress (campo de expressão v1)
- **Direção:** Usuário (teclado) → Navegador/DOM → `FIAP-javascript-calculator`
- **Propósito:** Permitir montagem de expressão numérica e disparar cálculo ao pressionar **Enter**.
- **Quando:** Durante a digitação no campo de expressão (V1).
- **Efeitos observados (por regra):**
  - Processa teclas permitidas para montagem da expressão (v1).
  - Ao pressionar Enter (`'='` ou código `13`), dispara o cálculo.

## Diagrama de Fluxo

```
[Usuário] --click(button) / keypress(inputs) / keypress(expressão v1)--> [FIAP-javascript-calculator] --Atualiza DOM (result/history/alerts)--> [UI no navegador]
```

---  
> ⚠️ Rascunho gerado automaticamente pelo Alicerce by Malha. Valide os nomes com o código antes de mergear.