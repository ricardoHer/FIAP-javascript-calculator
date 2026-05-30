```md
# FIAP-javascript-calculator — Guia de Onboarding

## O que você precisa saber primeiro
Este repositório é um front-end **estático (HTML/CSS/JavaScript)** com uma calculadora simples. Todo o comportamento acontece no browser: ao clicar nos botões e/ou pressionar teclas nos inputs, o `script.js` / `scripts.js` lê valores, valida e atualiza a UI com o resultado (e, na versão v1, também mantém histórico e monta expressão).

Existem **duas implementações no mesmo repo**:
- **v1**: lógica mais “genérica”, com **montagem de expressão** e cálculo (inclui regras tipo: “não calcula se tiver menos de 2 termos”, e trata `Infinity/-Infinity` como “Divisão por 0”). Também existe **histórico** e um fluxo que bloqueia cálculo após “operationFinished”.
- **V2_Bruno**: lógica mais “direta”, baseada em **operações por botão** (somar/subtrair/multiplicar/dividir) e **validações de input**. Inclui bloqueio de tecla **e/E** nos inputs (pra evitar notação científica) e valida divisão por **zero**.

A pegadinha principal: como não há camadas (tipo back-end, services, frameworks), o “domínio” está espalhado junto do código de UI. Então, quando você mudar regra de negócio, você provavelmente vai mexer em DOM + validação + cálculo ao mesmo tempo.

> ⚠️ Rascunho gerado automaticamente pelo Alicerce by Malha. Adicione os passos reais de setup antes de mergear.

## Como rodar localmente

### Pré-requisitos
- Um navegador moderno (Chrome/Firefox/Edge) — basta abrir o `index.html`.
- (Opcional) VS Code, para editar/inspecionar rapidamente os arquivos.

### Passos
```bash
# 1) Clone o repositório
git clone <PREENCHER_URL_DO_REPOSITORIO>
cd FIAP-javascript-calculator

# 2) Abra diretamente no navegador (recomendado para front-end estático)
# - v1: abra ./index.html
# - V2: abra ./V2_Bruno/index.html
```

### Configurações necessárias
| Variável | Valor local | Para que serve |
|---|---|---|
| PREENCHER | PREENCHER | PREENCHER |

## Arquitetura em 5 minutos
A arquitetura é **monolítica no front-end**:
- O HTML define os elementos (inputs, botões, áreas de resultado/histórico).
- O JavaScript busca esses elementos no DOM (ex.: `getElementById`, `querySelector`).
- O fluxo é disparado por **event listeners**:
  - `click` nos botões: identifica a operação pelo atributo `name` do botão e executa a função correspondente.
  - `keypress` nos inputs: bloqueia tecla `e/E` (para impedir notação científica) e (no v1) permite montar expressão.
- As funções de cálculo (soma/subtração/multiplicação/divisão) existem, mas são chamadas diretamente pelo listener e retornam/propagam para a UI (via `innerText`, `alert`, etc.).

Não espere “camadas” (controller/service/repository). Aqui a regra costuma estar assim:
**(evento) → validação → cálculo → atualização de DOM/alert**.

## Onde está cada coisa
| O que procuro | Onde encontro |
|---|---|
| Entrada principal (UI v1) | `index.html` |
| Lógica v1 (montagem de expressão, histórico, validações) | `js/script.js` |
| Entrada principal (UI V2) | `V2_Bruno/index.html` |
| Lógica V2 (operações por botão + validação de inputs + divisão por zero) | `V2_Bruno/js/scripts.js` |
| Estilos | `css/style.css` e `css/reset.css` |
| Estilos/arquivos da V2 (se aplicável) | `V2_Bruno/` (assets estáticos) |

## Fluxos principais para entender primeiro
1. **V2: Operação por botão (somar/subtrair/multiplicar/dividir)** — começa no `click` do botão → valida inputs (vazio) e trata divisão por zero → executa a função de operação → atualiza o campo de resultado.
2. **V2: Bloqueio de notação científica (e/E)** — começa em `keypress` nos dois inputs numéricos → impede tecla `e`/`E` → permite somente o restante.
3. **v1: Montagem de expressão + cálculo por Enter** — começa no `keypress` do campo de expressão → processa teclas permitidas para montar a expressão → ao detectar Enter (`=` ou `13`), dispara o cálculo (com regra de “mínimo de termos”).
4. **v1: Tratamento de “Divisão por 0” via Infinity** — durante o cálculo da expressão, se o resultado virar `Infinity/-Infinity`, exibe “Divisão por 0” na UI.

## Armadilhas comuns
- **Divisão por zero com comportamento diferente entre v1 e V2**
  - V2: se divisor (`segundo valor`) for `0`, mostra `alert('Não é possível efetuar a divisão por zero')` e **não executa**.
  - v1: identifica resultado `Infinity/-Infinity` e mostra `Divisão por 0` (sem necessariamente “alertar”).
  - Se você misturar regras entre versões, o teste/aceitação vai falhar.
- **Bloqueio de tecla `e/E` (notação científica)**
  - Em V2, isso existe explicitamente. Se você alterar validação de input sem considerar isso, pode permitir entradas do tipo `1e3` e quebrar a lógica esperada.
- **v1: guard-rails para quando não deve calcular**
  - Existe regra do tipo: não calcular se a expressão tiver menos de 2 termos (`mountCount().length > 1`).
  - Também existe regra de “não executa cálculo novamente após `operationFinished`”.
  - Se você implementar uma mudança na UI/UX, pode acidentalmente disparar cálculo fora da hora.
- **Montagem de expressão + `eval` (v1)**
  - O v1 menciona uso de `eval` para cálculo a partir da expressão montada.
  - Isso torna o fluxo mais frágil: qualquer alteração no parser/montagem pode gerar expressão inválida/inesperada.

## Quem perguntar
- **Dúvidas de negócio:** PREENCHER (ex.: professor/PO responsável pelo requisito da calculadora)
- **Dúvidas técnicas:** PREENCHER (ex.: Bruno / mentor do repositório ou responsável pelo `V2_Bruno/js/scripts.js`)

---
> ✅ Próximo passo sugerido pra você: abra `V2_Bruno/index.html` e rode mentalmente o fluxo “click → validação → operação → atualização”. Depois compare com o v1 (`index.html` + `js/script.js`) focando só em “montagem de expressão → Enter → cálculo → histórico/resultado”.
```