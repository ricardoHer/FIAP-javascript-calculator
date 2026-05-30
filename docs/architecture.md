# FIAP-javascript-calculator — Arquitetura

## Visão Geral
O `FIAP-javascript-calculator` é um **front-end estático** (sem backend) em que a lógica de negócio (operações aritméticas e validações) é implementada diretamente em **JavaScript acoplado à UI**, reagindo a **eventos do DOM** (cliques e keypress). O racional dessa escolha é simples: maximizar a rapidez de entrega e manter o projeto pequeno, evitando camadas e dependências de framework para uma calculadora de baixa complexidade.  
A existência de **duas versões (v1 e V2_Bruno)** mostra uma evolução do comportamento: v1 prioriza montagem de expressão e cálculo via `eval`, enquanto V2 adota execução por operações explícitas (botões) com validações mais diretas (ex.: divisão por zero).

## Stack Tecnológico
| Camada | Tecnologia | Motivo |
|---|---|---|
| Interface | HTML | Estrutura da calculadora (inputs, botões e área de exibição). |
| Lógica/Interação | JavaScript (script.js / scripts.js) | Encapsula funções de soma/subtração/multiplicação/divisão e gerencia eventos de clique/teclado no DOM. |
| Estilos | CSS (style.css + reset.css) | Garantir aparência consistente entre navegadores via reset e estilização leve. |

## Padrões Adotados
- **Estratégia por Evento (Event-driven UI):** handlers de `click` e `keypress` decidem o fluxo (qual operação executar, quando bloquear tecla, quando calcular e como atualizar o resultado). Isso reduz complexidade de “orquestração” e mantém o comportamento próximo da interface.
- **Separação por Funções (Functional decomposition):** operações aritméticas e validações são implementadas como funções reutilizáveis (ex.: divisão com checagem de divisor zero), em vez de lógica espalhada apenas no handler.
- **Validação de Entrada na borda (UI-side validation):** regras como bloqueio de tecla (`e/E`) e alerta/prevenção em vazio/divisão por zero são aplicadas antes de executar o cálculo, minimizando estados inválidos.

## Decisões de Arquitetura (ADRs)

### ADR 1 — Front-end monolítico e acoplado ao DOM
- **Contexto:** Aplicação pequena e educativa (calculadora simples) sem necessidade de servir APIs ou lidar com persistência.
- **Decisão:** Manter **toda a lógica** no lado do cliente, com JavaScript diretamente manipulando a UI (ex.: `innerText` do resultado e montagem de histórico), usando handlers do DOM.
- **Consequências:**
  - ✅ Mais rápido de desenvolver e com menos arquivos/infra.
  - ✅ Menor custo de manutenção para um domínio pequeno.
  - ❌ Menos testável isoladamente (lógica depende de elementos do DOM e eventos).
  - ❌ Evoluções maiores tendem a aumentar acoplamento e dificultar refatorações.

### ADR 2 — Dois modos de cálculo: v1 por expressão (eval) vs. V2 por operação explícita
- **Contexto:** Ajuste de comportamento e segurança/controle do fluxo de cálculo.
- **Decisão:**  
  - **v1:** monta expressão e calcula via `eval`, incluindo regras como mínimo de termos (`mountCount().length > 1`) e tratamento de `Infinity/-Infinity` para exibir “Divisão por 0”.  
  - **V2_Bruno:** elimina construção/execução por expressão e calcula apenas por **operações explícitas** (botões), com validação de divisão por zero e validação de inputs vazios.
- **Consequências:**
  - ✅ V2 reduz riscos e ambiguidades de parse/avaliação dinâmica.
  - ✅ V2 torna a regra de divisão por zero determinística (checa divisor == 0 antes de calcular).
  - ❌ v1 mantém complexidade e riscos inerentes ao uso de `eval` (mesmo que o domínio seja controlado pela UI).
  - ❌ Manter duas versões implica duplicação de comportamento e possibilidade de divergência de regras.

### ADR 3 — Validação de divisão por zero antes do cálculo (V2)
- **Contexto:** Evitar resultados inválidos e garantir mensagens consistentes ao usuário.
- **Decisão:** Em V2, ao acionar divisão:
  - se o segundo input for `0`, exibir alerta **“Não é possível efetuar a divisão por zero”** e **não executar a conta**.
- **Consequências:**
  - ✅ Mensagem mais clara e fluxo controlado.
  - ✅ Evita depender de comportamento de `Infinity/-Infinity` no resultado.
  - ❌ Exige um handler específico de operação (a lógica passa a ser dependente do tipo de botão clicado).

### ADR 4 — Bloqueio de notação científica no input (V2) via keypress
- **Contexto:** Controlar o formato numérico para evitar entradas que mudem o tipo/semântica do parsing (ex.: `1e10`).
- **Decisão:** Em V2, bloquear a tecla **`E`/`e`** nos campos do primeiro e segundo valor (keypress), impedindo notação científica.
- **Consequências:**
  - ✅ Parsing mais previsível e regras de validação mais simples.
  - ❌ Usuários não conseguem usar notação científica (trade-off de usabilidade vs. previsibilidade).

### ADR 5 — Regra de “mínimo de termos” e anti-reexecução (v1)
- **Contexto:** Evitar cálculos com expressão incompleta e impedir estados em que o cálculo seja disparado indevidamente.
- **Decisão:**  
  - v1 só calcula se `mountCount().length > 1`.  
  - v1 possui regra de que, ao tentar calcular novamente após `operationFinished`, o cálculo não é executado.
- **Consequências:**
  - ✅ Reduz inconsistência do histórico/resultado.
  - ❌ A lógica de controle de estado fica implícita no fluxo do UI handler (pode ficar difícil de rastrear conforme cresce).

## Dependências Externas
| Dependência | Tipo | Propósito |
|---|---|---|
| Navegador (DOM/Events) | HTTP/DOM (ambiente do cliente) | Disponibilizar eventos `click` e `keypress` para acionar operações e validações. |
| `eval` (v1) | Linguagem JavaScript | Avaliar expressões montadas em v1 (PREENCHER: detalhes exatos de como a expressão é construída e sanitizada, se houver). |

## Pontos de Atenção
- **Uso de `eval` em v1:** mesmo com UI controlada, `eval` é uma superfície de risco e complica garantias de segurança/robustez. A versão V2 já indica uma migração para um modelo mais controlado (operações explícitas).
- **Acoplamento forte com DOM:** handlers misturam leitura de inputs, validação, execução e atualização da UI, o que reduz testabilidade e tende a aumentar custo de mudanças.
- **Divergência entre v1 e V2:** regras podem evoluir separadamente (mensagens, condições para cálculo e bloqueios de teclado). Isso pode causar inconsistência de comportamento para o mesmo “domínio” (calculadora).
- **Dados não especificados no material acumulado:**  
  - PREENCHER: como o “histórico” é estruturado e atualizado no v1 (ex.: elementos DOM, formato do item).  
  - PREENCHER: como `mountCount()` e a montagem de expressão são implementadas com precisão.  
  - PREENCHER: qual estratégia exata de parsing/conversão de inputs (ex.: `Number()`, `parseFloat()`, tratamento de vírgula/ponto).  

---  
> ⚠️ Rascunho gerado automaticamente pelo Alicerce by Malha. Valide com o time antes de mergear.