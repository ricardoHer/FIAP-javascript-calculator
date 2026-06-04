```md
# FIAP-javascript-calculator — Runbook Operacional

## Informações Básicas
| Item | Valor |
|---|---|
| Porta padrão | PREENCHER (ex.: 80 / 8080 / 3000) |
| Health check | PREENCHER (serviço é frontend estático; se houver endpoint, documentar) |
| Logs | PREENCHER (ex.: logs do servidor web/hosting) + *logs do navegador* (DevTools Console/Network) |
| Métricas | PREENCHER (não existem métricas nativas no código descrito; se houver, informar dashboard/monitoramento do hosting) |
| Alertas críticos | PREENCHER (ex.: alertas de disponibilidade do site/no hosting) |

> ⚠️ Observação: pelo contexto, **FIAP-javascript-calculator é uma aplicação frontend estática no navegador**, sem backend e sem health check HTTP conhecido (`GET /health` não foi descrito). Em incidentes, o foco é **diagnosticar no browser** (erros JS, falhas de carregamento de assets e comportamento da UI).

## Health Check e Monitoramento

### Verificar se a aplicação está carregando corretamente (check operacional)
1. Acessar a página no navegador (incógnito, se possível).
2. Abrir **DevTools → Console** e verificar ausência de erros (ex.: `Uncaught ReferenceError`, `SyntaxError`, `TypeError`).
3. DevTools → **Network**:
   - Confirmar que carregou `index.html` e os assets:
     - `js/script.js` (ou `V2_Bruno/js/scripts.js`)
     - `css/style.css` e `css/reset.css` (se existirem)
   - Verificar **status 200** e ausência de **404/500** nos arquivos JS/CSS.

### Indicadores de problema (sinais típicos)
- Console com erros JS (ex.: handlers não registrados, variáveis não definidas, erro ao acessar `result`).
- Campos de entrada não respondem (cliques/keypress não executam) ou atualização do resultado não ocorre.
- `Network` mostra falha ao carregar `script.js`/`scripts.js` (404/blocked/CORS/Content Security Policy).
- Inconsistência entre versão **V1 (`js/script.js`)** e **V2 (`V2_Bruno/js/scripts.js`)** (ex.: layout muda, mas comportamento/DOM esperado diverge).

## Procedimentos Comuns

### 1) Validar comportamento essencial do cálculo (rápido)
No navegador:
1. Inserir números em ambos os inputs.
2. Clicar em `somar`, `subtrair`, `multiplicar` e `dividir`.
3. Conferir se o elemento de resultado é atualizado (no V2: id **`result`** via `innerText`).
4. Testar validações:
   - Primeiro input vazio → deve exibir `alert` e não calcular.
   - Segundo input vazio → deve exibir `alert` e não calcular.
   - Divisão por zero → deve exibir `alert` **“Não é possível efetuar a divisão por zero”** e não calcular.

### 2) Reiniciar o “serviço” (neste caso: recuperar sessão/cache do usuário)
Como não há restart de processo server-side no contexto, use:
- Atualizar a página (hard refresh: **Ctrl+F5**).
- Fechar/abrir o navegador ou tentar **aba anônima**.
- Limpar cache do site (se o hosting estiver servindo assets antigos).

> Se o incidente for de infraestrutura (CDN/hosting), siga o procedimento do provedor/hosting para reiniciar/redeploy do artefato.

### 3) Verificar logs de erro
#### No browser (principal)
```text
DevTools → Console → copie/registre:
- primeira ocorrência do erro
- stack trace (linha/arquivo)
```

#### No servidor/hosting (se aplicável)
- Acompanhar logs do **servidor web**/CDN:
  - requests para `*.js` e `*.css`
  - erros de cache/ETag/Last-Modified
  - falhas de entrega (4xx/5xx)

> Local exato dos logs: **PREENCHER**.

### 4) Diagnosticar diferença V1 vs V2 (ponto comum em incidentes)
- Identificar qual arquivo JS está sendo carregado:
  - V1: `js/script.js`
  - V2: `V2_Bruno/js/scripts.js`
- Confirmar se a estrutura HTML é compatível:
  - No V2, espera-se elemento com **id `result`**.
- Se o HTML da V2 não estiver usando os handlers do JS correspondente, os cliques podem não funcionar.

## Troubleshooting

### Problema: Botões não fazem nada (sem alert e sem atualizar resultado)
**Causa provável:** script não carregou (erro em `scripts.js/script.js`), handlers não foram registrados, ou DOM não contém elementos esperados (ex.: `result` inexistente no HTML da versão carregada).  
**Como diagnosticar:**
1. DevTools → Console: verificar erros.
2. DevTools → Network:
   - arquivo JS carregou com 200?
   - houve 404/blocked?
3. Conferir se o id/estrutura usada no JS existe no HTML em uso (principalmente no V2: `result`).
4. Confirmar qual versão está ativa (V1 vs V2) comparando o caminho do JS carregado.  
**Como resolver:**
- Corrigir/ajustar o deploy garantindo que **o HTML correspondente** está pareado com o **script correto**.
- Revalidar assets no hosting/CDN (garantir que `js/script.js` ou `V2_Bruno/js/scripts.js` está acessível).
- Se houver erro no código, fazer correção e redeploy.

---

### Problema: Clique em “dividir” não bloqueia divisão por zero (ou bloqueia indevidamente)
**Causa provável:** validação do divisor não está sendo aplicada (ex.: leitura do input diferente, conversão numérica falha) ou diferença entre V1/V2.  
**Como diagnosticar:**
1. Testar divisão por zero digitando `0` claramente no segundo input.
2. Observar se aparece `alert` **“Não é possível efetuar a divisão por zero”**.
3. Se não aparecer, checar Console por erro ao executar a função de divisão.
4. Conferir como o JS converte/parseia os valores dos inputs (se houver falha de parse, pode mascarar `0`).
5. Garantir que está usando a versão correta do handler (V2 costuma rotearlo por `e.target.name`).  
**Como resolver:**
- Garantir que a função `divide` (com validação de divisor 0) está efetivamente sendo chamada.
- Se o HTML/JS estiver misturado (V1 com HTML V2 ou vice-versa), alinhar versões.

---

### Problema: Alertas de “input vazio” não disparam
**Causa provável:** validação no handler de clique não está executando (handlers ausentes) ou inputs não estão sendo lidos/selecionados corretamente.  
**Como diagnosticar:**
1. Verificar no Console se handlers estão presentes/sem erros.
2. Ao clicar, inspecionar:
   - se os botões possuem corretamente o atributo `name` (no V2 é usado para identificar a operação).
3. Confirmar seletores/ids dos inputs esperados pelo JS estão presentes.  
**Como resolver:**
- Corrigir atributos `name` dos botões (especialmente no V2).
- Corrigir ids/classes/seletores dos inputs no HTML para bater com o que o JS procura.
- Redeploy após ajuste.

---

### Problema: Keypress permite ‘E’/‘e’ nos inputs (V2 deveria bloquear)
**Causa provável:** listener de `keypress` não registrado ou usando evento diferente (`keydown` vs `keypress`) dependendo do navegador; handler não está sendo executado.  
**Como diagnosticar:**
1. Testar digitação do caractere `E`/`e` em ambos os inputs (V2).
2. Verificar Console para erros.
3. Garantir que o JS carregado é o da V2 (`V2_Bruno/js/scripts.js`) e que o evento esperado existe no browser alvo.  
**Como resolver:**
- Ajustar o listener no código (se necessário) para o evento correto e reaplicar bloqueio.
- Redeploy com correção.

---

### Problema: Resultado não aparece / aparece apenas em alguns navegadores
**Causa provável:** elemento de saída (`result`) não existe no DOM ou atualização via `innerText` não está chegando ao elemento correto; diferenças de layout/HTML entre V1 e V2.  
**Como diagnosticar:**
1. Verificar no DevTools → Elements se existe `id="result"` na página.
2. Conferir no Console se há erro ao tentar atualizar.
3. Comparar comportamento V1 vs V2: em V2, deve atualizar `result` via `innerText`.  
**Como resolver:**
- Garantir que o HTML da versão em uso contém o elemento `result` (id correto).
- Garantir pareamento HTML ↔ JS da mesma versão.

---

### Problema: Assets não carregam (CSS/JS 404, CSP bloqueando, CDN com falha)
**Causa provável:** erro de deploy, caminho incorreto dos arquivos, caching/CDN servindo versão antiga ou restrições de segurança.  
**Como diagnosticar:**
1. DevTools → Network:
   - verificar status de `*.js` e `*.css`
2. Se houver CSP:
   - checar se o CSP bloqueia `script-src`/`style-src`.  
**Como resolver:**
- Corrigir paths no build/deploy e redeploy.
- Invalidar cache/CDN (se aplicável).
- Revisar headers de segurança (CSP) para permitir origem do JS/CSS.

## Dependências Críticas
| Dependência | O que acontece se cair | Fallback |
|---|---|---|
| Hosting/CDN que entrega `index.html`, `js/script.js` e/ou `V2_Bruno/js/scripts.js` | Página pode não carregar ou operar (JS não executa) | Tentar outra origem/ambiente (se houver). Usar fallback de deploy anterior se existir |
| Rede do usuário / bloqueios corporativos | assets não baixam → UI não funciona | Testar em rede alternativa/5G; orientação ao usuário |
| Navegador/compatibilidade de eventos (keypress/click) | algumas validações/handlers podem falhar | Validar em navegadores suportados; ajustar para eventos mais consistentes (se necessário) |

## Contatos de Escalação
- **Primeiro:** PREENCHER (ex.: responsável pelo repositório / dev on-call)
- **Segundo:** PREENCHER (ex.: SRE/infra do hosting/CDN)
```