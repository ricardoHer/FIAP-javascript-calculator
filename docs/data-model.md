# FIAP-javascript-calculator — Modelo de Dados

> ⚠️ Este projeto é um microsserviço *front-end estático* (sem backend). Assim, “dados” aqui significam o estado mantido e exibido na UI (DOM) e a forma como ele é atualizado por eventos do navegador.

## Entidades Principais

### OperationResultUI
- **Propósito:** Representar o resultado que o usuário visualiza após executar uma operação (v2) ou após cálculo por expressão (v1).
- **Campos principais:**
  - **value** *(string)*: texto exibido no elemento de resultado (v2, `innerText` do container com id/class `result` — `PREENCHER`).
  - **error** *(boolean)*: indica se a UI está exibindo um erro (ex.: divisão por zero) — `PREENCHER` (derivado do texto/fluxo).
  - **operationType** *(string | null)*: tipo da operação disparada (ex.: `add`, `subtract`, `multiply`, `divide`) — `PREENCHER` (inferido pelo atributo `name` do botão).
  - **calculationMode** *(string)*: `v1 | v2` (derivado do arquivo/fluxo em uso).
- **Relacionamentos:**
  - **HistoryList**: pode receber/espelhar entradas de histórico após cálculo concluído (v1).
- **Observações:**
  - **Divisão por zero (v2):** se o segundo input for `0`, o cálculo não é executado e a UI exibe/alerta `Não é possível efetuar a divisão por zero` (alerta do navegador; persistência em DOM — `PREENCHER`).
  - **Infinity (v1):** se o resultado da expressão for `Infinity`/`-Infinity`, exibir `Divisão por 0` no campo de resultado.

### HistoryList
- **Propósito:** Manter e exibir o histórico de operações/resultados na interface (v1).
- **Campos principais:**
  - **items** *(array de HistoryItem)*: itens exibidos na lista.
  - **renderTarget** *(string)*: elemento DOM de destino, ex.: `history-list` (conforme descrito).
- **Relacionamentos:**
  - **OperationResultUI**: cada item pode referenciar o resultado gerado.
- **Observações:**
  - A regra “ao tentar calcular novamente após operationFinished, o cálculo não é executado” implica um estado de controle para impedir duplicações/atualizações indevidas no histórico — `PREENCHER` o nome/estrutura do estado interno.

### HistoryItem (subentidade — PREENCHER)
- **Propósito:** Representar cada linha do histórico.
- **Campos principais:**
  - **expression** *(string)*: expressão montada (v1) — `PREENCHER`.
  - **result** *(string)*: resultado exibido no UI — `PREENCHER`.
  - **operationFinished** *(boolean)*: status de execução — `PREENCHER`.
- **Relacionamentos:**
  - **HistoryList**: pertence a uma lista.
  - **OperationResultUI**: espelha/deriva do resultado do último cálculo.
- **Observações:**
  - **Regra de integridade (v1):** item deve ser criado apenas quando o cálculo é permitido (ex.: após validação do tamanho da expressão e sem bloqueio de `operationFinished`).

### ExpressionBuilderUI (v1 — PREENCHER)
- **Propósito:** Representar o campo/estado da expressão montada pelo usuário para cálculo via Enter.
- **Campos principais:**
  - **expressionText** *(string)*: conteúdo do campo de expressão (ex.: id/area “operations”) — `PREENCHER`.
  - **termCount** *(number)*: quantidade de termos na expressão; usada por `mountCount().length > 1` — `PREENCHER`.
- **Relacionamentos:**
  - **HistoryList**: alimenta histórico com expressão e resultado (v1).
  - **OperationResultUI**: alimenta o resultado.
- **Observações:**
  - **Cálculo por Enter (v1):** ao pressionar Enter (`=` ou código 13), dispara cálculo.
  - **Guardrail (v1):** só executa se `mountCount().length > 1`.
  - **Cálculo com expressão montada:** v1 utiliza `eval` (conforme resumo), com regra adicional de bloqueio de `operationFinished`.

### InputsUI (v2 — PREENCHER)
- **Propósito:** Representar os dois inputs numéricos e as validações de entrada que antecedem o cálculo.
- **Campos principais:**
  - **firstInput** *(string)*: valor do primeiro campo.
  - **secondInput** *(string)*: valor do segundo campo.
  - **isFirstEmpty** *(boolean)*: derivado se `firstInput` está vazio — `PREENCHER`.
  - **isSecondEmpty** *(boolean)*: derivado se `secondInput` está vazio — `PREENCHER`.
- **Relacionamentos:**
  - **OperationResultUI**: provê os operandos para gerar o resultado.
- **Observações:**
  - **Bloqueio de notação científica (v2):** bloqueia tecla `E`/`e` nos inputs do primeiro e segundo valor.
  - **Validação por clique (v2):** antes de calcular, se algum input estiver vazio, exibe alerta e impede cálculo (`PREENCHER` texto/alerta exato além do comportamento).
  - **Divisão por zero (v2):** impede cálculo quando `secondInput == 0` e exibe alerta específico.

### ButtonClickOperation (evento/estado transitório — PREENCHER)
- **Propósito:** Representar o tipo de operação inferido pelo atributo `name` do botão para orientar a execução das funções.
- **Campos principais:**
  - **operationType** *(string)*: inferido de `button.name` (ex.: soma/subtração/multiplicação/divisão) — `PREENCHER`.
- **Relacionamentos:**
  - **InputsUI**: consome os operandos.
  - **OperationResultUI**: produz o resultado/erro.
- **Observações:**
  - Fluxo v2: identifica operação no clique e executa função correspondente.

## Diagrama de Relacionamentos

```mermaid
[InputsUI (v2)] --> [OperationResultUI]
[ExpressionBuilderUI (v1)] --> [OperationResultUI]
[ExpressionBuilderUI (v1)] --> [HistoryList]
[HistoryList] --> [HistoryItem (PREENCHER)]
[OperationResultUI] --> [HistoryItem (PREENCHER)]
[ButtonClickOperation (PREENCHER)] --> [OperationResultUI]
```

## Fluxos de Dados Principais

### Clique em operação (v2)
1. **Origem do dado:** evento `click` em `button` no navegador; o tipo da operação é identificado pelo atributo `name` do botão.
2. **Transformação/validação:**
   - Lê `firstInput` e `secondInput`.
   - Se algum input estiver vazio: exibe alerta e interrompe.
   - Se operação for divisão e `secondInput == 0`: exibe alerta `Não é possível efetuar a divisão por zero` e interrompe.
   - Converte/normaliza entradas para número e executa a função (soma/subtração/multiplicação/divisão).
3. **Persistência/publicação:**
   - Atualiza o elemento de resultado na UI (v2: `result.innerText` — alvo `PREENCHER` pelo seletor exato).
   - (Opcional) não há persistência em storage; apenas atualização DOM.

### Keypress bloqueando `E/e` (v2)
1. **Origem do dado:** evento `keypress` nos inputs numéricos do primeiro e segundo valor.
2. **Transformação/validação:**
   - Se a tecla for `E` ou `e`, impede a inserção (cancel event).
3. **Persistência/publicação:**
   - Atualização natural do conteúdo dos inputs via DOM (sem persistir em backend).

### Montagem de expressão + Enter para cálculo (v1)
1. **Origem do dado:**
   - `keypress` no campo de expressão (v1).
   - Quando pressionado `=` ou `13` (Enter), dispara o cálculo.
2. **Transformação/validação:**
   - Processa teclas permitidas para montar expressão (montagem incremental) — `PREENCHER` regras exatas.
   - Valida quantidade de termos: só calcula se `mountCount().length > 1`.
   - Executa cálculo com expressão montada (uso de `eval`).
   - Se resultado for `Infinity` ou `-Infinity`: prepara mensagem `Divisão por 0`.
   - Regra de controle: após `operationFinished`, novo cálculo é bloqueado (não executa).
3. **Persistência/publicação:**
   - Atualiza campo de resultado na UI (entrada/textarea/campo `id 'operations'` descrito; campo real de resultado — `PREENCHER`).
   - Atualiza `HistoryList` (lista exibida em `history-list`) com expressão e/ou resultado (conforme implementação v1).

### Fluxo de erro (Divisão por zero — v1 e v2)
1. **Origem:** operação de divisão com divisor inválido (v2: divisor `0`; v1: avaliação gera `Infinity/-Infinity`).
2. **Transformação:** converte a condição para uma mensagem de erro padronizada.
3. **Persistência/publicação:**
   - v2: alerta com texto `Não é possível efetuar a divisão por zero` e não executa conta.
   - v1: exibe `Divisão por 0` no campo de resultado.

## Estratégia de Persistência
- **Banco principal:** *Nenhum* (aplicação front-end estática; persistência limitada ao DOM/estado em memória do script).
- **Cache:** não identificado.
- **Event store:** não identificado (tratamento é via eventos de UI; sem registro persistente).

## Considerações de Performance
- Não há infraestrutura de banco/cache; performance é dominada por:
  - **v1:** execução de `eval` apenas quando a expressão passa na validação `mountCount().length > 1`.
  - **v2:** validações curtas em memória antes de calcular (checagem de vazio e divisor zero).
- **Operação bloqueada (v1):** `operationFinished` evita reexecução desnecessária ao disparar novamente cálculo.

---
> ⚠️ Rascunho gerado automaticamente pelo Alicerce by Malha. Valide com o schema real do banco antes de mergear. (Neste caso, não há schema de banco; valide seletor/ids reais dos elementos `result`, `history-list`, campo de expressão e variáveis internas como `operationFinished` e `mountCount()`.)