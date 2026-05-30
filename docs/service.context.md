# FIAP-javascript-calculator — Contexto de Negócio

## Propósito
O **FIAP-javascript-calculator** é um serviço front-end estático que oferece uma calculadora simples ao usuário para realizar operações aritméticas básicas: **somar, subtrair, multiplicar e dividir**. O foco de negócio é permitir que o usuário obtenha rapidamente um resultado numérico a partir de **dois valores de entrada**, com feedback imediato na interface.

Para garantir uma experiência previsível, o serviço aplica **regras de validação e tratamento de erros** (com destaque para divisão por zero) e mantém consistência no fluxo de interação: somente executa o cálculo quando os dados estão prontos e exibe o resultado (ou uma mensagem de erro) no local apropriado da página.

## Conceitos-chave
- **Operação Aritmética:** ação de soma, subtração, multiplicação ou divisão executada sobre dois valores informados pelo usuário.
- **Validação de Entrada:** checagens antes do cálculo para evitar valores vazios e impedir casos inválidos (ex.: divisão por zero).
- **Tratamento de Erro (Divisão por Zero):** regra que bloqueia a operação quando o divisor é 0 e informa ao usuário.
- **Histórico de Operações (v1):** lista de expressões/resultados exibida na UI para consulta após cálculos.

## Regras de Negócio Críticas
- **Divisão por zero é bloqueada:** se o **segundo valor** for `0`, o serviço deve **exibir o alerta** `Não é possível efetuar a divisão por zero` e **não efetuar a conta** (comportamento da V2).
- **Entradas obrigatórias antes de calcular (V2):** ao clicar em uma operação, deve **exibir alerta** e **impedir o cálculo** se o **primeiro** ou o **segundo input estiver vazio**.
- **Resultado inválido em expressão (v1):** se o resultado calculado via expressão resultar em `Infinity` ou `-Infinity`, deve exibir `Divisão por 0` no campo de resultado.
- **Montagem mínima de expressão (v1):** o cálculo só deve ocorrer quando houver **pelo menos 2 termos** (condição equivalente ao `mountCount() > 1`).
- **Não recalcular automaticamente após finalização (v1):** após a operação ser concluída (regra de “operationFinished”), novos cliques não devem executar o cálculo novamente no fluxo definido.
- **Controle de teclas para evitar notação científica (V2):** bloquear a tecla **`E`/`e`** nos inputs para impedir que o usuário digite notação científica e gere comportamento inesperado.
- **Enter dispara cálculo no campo de expressão (v1):** quando o usuário pressiona **Enter** ( `=` ou código 13 ), o serviço deve disparar o cálculo conforme as regras do modo v1.

## Integrações Principais
### Publica (eventos que emite)
- **Nenhuma integração/evento externo identificado.** O serviço opera exclusivamente na interação do usuário com a interface (DOM/teclado/clique).

### Consome (eventos que processa)
- **click (button)** de `navegador/DOM` — identifica a operação pelo atributo do botão e executa a lógica correspondente com validações (prioritariamente V2).
- **keypress (inputs)** de `navegador/DOM` — bloqueia a tecla `E/e` para impedir notação científica (V2).
- **keypress (campo de expressão v1)** de `navegador/DOM` — processa teclas permitidas para montar expressão e, ao pressionar Enter, dispara o cálculo (v1).

### Chamadas HTTP
- **Nenhuma chamada HTTP identificada.** O serviço não depende de APIs externas.

## O que este serviço NÃO faz
- **Não realiza pagamentos, autenticação, persistência de dados ou integrações externas.**
- **Não calcula números fora do escopo definido pelas entradas da UI**, nem valida todos os formatos numéricos de forma abrangente (principalmente por restrições como bloqueio de `E/e` na V2).
- **Não executa chamadas HTTP/serviços de terceiros** para obter resultados.
- **Não substitui validações de backend** (por não existir backend neste serviço front-end estático).

## Decisões de Arquitetura Relevantes
- **Front-end monolítico/estático:** a lógica de cálculo e a manipulação da UI são tratadas diretamente no código do cliente, sem camadas de backend ou arquitetura em serviços.
- **Existência de duas versões comportamentais (v1 e V2):**  
  - **v1** trabalha com **montagem de expressão** e execução com regras de consistência (termos mínimos, controle de estados e tratamento de `Infinity`).  
  - **V2** trabalha com **operações via botões** e aplica validação explícita de inputs e bloqueio de divisão por zero, com feedback por alertas.
- **Foco em previsibilidade na experiência do usuário:** regras de validação e bloqueios (vazios, divisão por zero, `E/e`) foram priorizados para reduzir resultados inesperados.

## Owner
- Time: PREENCHER  
- Contato: PREENCHER  

---  
> ⚠️ Rascunho gerado automaticamente pelo Alicerce by Malha. Revise e enriqueça com contexto tácito antes de mergear.