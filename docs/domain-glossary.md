```md
# FIAP-javascript-calculator — Glossário de Domínio

> Termos e conceitos usados neste serviço e seus significados no contexto do negócio.
> Use este glossário ao ler o código, escrever tickets ou comunicar com outros times.

## Termos de Negócio

### Operação Aritmética
**Definição:** A ação do usuário para calcular, entre dois valores, um resultado usando soma, subtração, multiplicação ou divisão.  
**No código:** Funções de cálculo disparadas por `click` nos botões (v1 e v2: `script.js` / `scripts.js`). Operações mapeadas pelo atributo `name` do botão.  
**Não confundir com:** “Montagem de expressão” (v1), que é o processo de construir uma expressão antes de calcular.

---

### Dois Valores de Entrada (Operandos)
**Definição:** Os dois números informados pelo usuário (primeiro e segundo input) que serão usados no cálculo.  
**No código:** Inputs do formulário (v2: validação de vazio antes do cálculo; v1: participação na montagem/avaliação conforme implementação).  
**Não confundir com:** Componentes de UI como “campo de expressão” (v1), que pode conter mais de dois termos.

---

### Validação de Entrada
**Definição:** Regras aplicadas antes de executar um cálculo para garantir que os inputs atendam condições mínimas (ex.: não estar vazio, bloquear caracteres inválidos).  
**No código:** 
- v2: validação de vazio antes do cálculo via `click`.  
- v2: `keypress` para bloquear tecla `E`/`e` nos dois inputs (impede notação científica).  
**Não confundir com:** Tratamento de erro específico de divisão por zero (regra de negócio separada).

---

### Divisão por Zero (Regra de Negócio)
**Definição:** Impedir a execução do cálculo de divisão quando o divisor é zero e apresentar uma mensagem de erro ao usuário.  
**No código:** v2: validação no handler da operação “dividir”; quando o segundo valor é `0`, exibe `alert('Não é possível efetuar a divisão por zero')` e não executa a conta.  
**Não confundir com:** o caso v1 que detecta `Infinity/-Infinity` e exibe “Divisão por 0”.

---

### Montagem de Expressão
**Definição:** Construção incremental de uma expressão numérica a partir de teclas permitidas, antes da avaliação do resultado.  
**No código:** v1: lógica baseada em contagem de termos (`mountCount().length > 1`) e um campo de expressão (ex.: input/textarea com id `operations`).  
**Não confundir com:** cálculo por operação via botões (v2), que não depende de uma expressão montada.

---

### Termos da Expressão
**Definição:** Fragmentos numéricos/operadores que compõem a expressão montada pelo usuário no fluxo de v1.  
**No código:** v1: avaliado por `mountCount()` para permitir/disparar o cálculo (ex.: exigir mais de 1 termo).  
**Não confundir com:** operandos fixos “primeiro e segundo input” (v2).

---

### Histórico de Operações
**Definição:** Exibição sequencial das operações/expressões e/ou resultados já calculados.  
**No código:** v1: lista no elemento `history-list`. Atualizada ao final de uma operação (conforme presença de `operationFinished`).  
**Não confundir com:** “result” (apenas o valor atual) que não representa histórico.

---

### Estado de Conclusão de Operação
**Definição:** Controle que bloqueia um novo cálculo quando uma operação anterior já foi finalizada (evita reexecuções indevidas).  
**No código:** v1: regra “ao tentar calcular novamente após operationFinished, o cálculo não é executado”.  
**Não confundir com:** validação de entrada (antes do cálculo).

---

## Termos Técnicos do Domínio

### Operação
**Definição:** Identificador da ação aritmética (soma, subtração, multiplicação, divisão) a ser executada.  
**Contexto de uso:** mapeamento do tipo de cálculo a partir do atributo `name` dos botões no `click`. (v2 e/ou v1, conforme implementação).

---

### Handler de Clique (Event Handler)
**Definição:** Função executada ao ocorrer `click` em um botão da UI para iniciar a operação.  
**Contexto de uso:** v2: `click (button)` identifica a operação pelo `name`, valida inputs, calcula e atualiza o resultado.

---

### Handler de Pressionamento de Tecla (Keypress)
**Definição:** Função executada no evento `keypress` para validar/filtrar caracteres e permitir o disparo por Enter.  
**Contexto de uso:**
- v2: `keypress (inputs)` bloqueia `E`/`e` nos inputs dos dois valores.  
- v1: `keypress (campo de expressão v1)` processa teclas permitidas e dispara o cálculo ao Enter (`= ou 13`).

---

### Expression (Campo de Expressão v1)
**Definição:** Componente de UI onde a expressão é montada para posterior cálculo.  
**Contexto de uso:** v1: “campo de expressão” com id `operations` (conforme descrito no contexto acumulado).

---

### Montagem Contada (`mountCount()`)
**Definição:** Função/checagem que retorna quantidade de itens/termos montados na expressão.  
**Contexto de uso:** v1: validação `mountCount().length > 1` para permitir que a expressão seja avaliada.

---

### Atualização de Resultado na UI (OperationResultUI)
**Definição:** Forma como o resultado é refletido na interface do usuário.  
**Contexto de uso:**
- v2: elemento `result` via `innerText`.  
- v1: campo/área de resultado no componente com id `operations` (conforme descrição do comportamento).

---

### HistoryList (Lista de Histórico)
**Definição:** Estrutura de dados/elemento de UI responsável por listar operações/expressões e resultados.  
**Contexto de uso:** v1: elemento `history-list`.

---

### `Infinity` / `-Infinity` (Detecção de Resultado Numérico)
**Definição:** Valores especiais retornados por divisão inválida em JavaScript; usados no v1 para sinalizar a condição de divisão por zero.  
**Contexto de uso:** v1: se o resultado da expressão for `Infinity/-Infinity`, exibe “Divisão por 0” no campo de resultado.

---

### Flag/Estado `operationFinished`
**Definição:** Sinalização interna usada para impedir execução repetida do cálculo após conclusão.  
**Contexto de uso:** v1: “ao tentar calcular novamente após operationFinished, o cálculo não é executado”.

---

## Acrônimos e Abreviações

| Sigla | Significado | Contexto |
|---|---|---|
| DOM | Document Object Model | Eventos `click` e `keypress` e manipulação direta de elementos na página (v1 e v2). |
| UI | User Interface (Interface do Usuário) | Atualização do resultado e do histórico na tela (ex.: `result`, `history-list`). |

```