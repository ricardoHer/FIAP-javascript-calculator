```md
# FIAP-javascript-calculator — Runbook Operacional

## Informações Básicas
| Item | Valor |
|---|---|
| Porta padrão | PREENCHER |
| Health check | `GET /health` (PREENCHER: este serviço é front-end estático; confirmar se existe endpoint) |
| Logs | PREENCHER (ex.: `/var/log/...`, container stdout, ou arquivo no build) |
| Métricas | PREENCHER (dashboard / endpoint) |
| Alertas críticos | PREENCHER (onde configurados: Grafana/CloudWatch/PagerDuty etc.) |

> Observação importante (para 3h da manhã): o repositório é **front-end estático (HTML/CSS/JS)**. Se estiver servido por um **servidor web** (Nginx/Apache/Node estático), o “incidente” normalmente é: **página não carrega**, **JS não executa**, **CORS/arquivo ausente**, **cache/CDN quebrado**, ou **bugs de cálculo/validações**.

---

## Health Check e Monitoramento

### Verificar se o serviço está saudável
Como não há confirmação de endpoint real, aplique estes checks conforme o modo de deploy:

**Se houver servidor e endpoint de health:**
```bash
curl http://localhost:{porta}/health
```
**Resposta esperada:** `{"status":"ok"}`

**Se for front-end estático (recomendado):**
```bash
# Verifica se a página principal retorna com status 200
curl -I http://localhost:{porta}/

# Verifica se o JS principal existe e retorna 200 (ajustar caminhos conforme deploy)
curl -I http://localhost:{porta}/js/script.js
# ou (versão V2)
curl -I http://localhost:{porta}/V2_Bruno/js/scripts.js
```

### Indicadores de problema
- **Página não carrega / blank page** (status != 200 para `index.html` ou bundle JS inexistente)
- **JS não executa** (erros no console; arquivos 404; MIME type incorreto)
- **Falhas de operação na UI**
  - V2: alerta e bloqueio não funciona (divisão por zero / inputs vazios)
  - V1: comportamento inesperado com expressão (uso de `eval`, cálculo com expressão incompleta, `Infinity`)
- **Erros de cache/CDN**: usuário recebe versão desatualizada do JS/HTML (mismatch entre `index.html` e `script.js`)

---

## Procedimentos Comuns

### Reiniciar o serviço
> Aplicável apenas se houver servidor (Nginx/Apache/Node) rodando para servir estáticos.

```bash
# Exemplo (Nginx)
sudo systemctl restart nginx

# Exemplo (Apache)
sudo systemctl restart apache2

# Exemplo (Node servindo estáticos)
# PREENCHER: comando real do serviço
```

Após reiniciar:
- Refaça `curl -I` para `index.html` e para os arquivos JS esperados.
- Teste rapidamente as operações (somar/subtrair/multiplicar/dividir, incluindo divisor=0).

### Verificar logs de erro
```bash
# PREENCHER: localização real dos logs no ambiente
# Exemplos comuns:
sudo tail -n 200 /var/log/nginx/error.log
sudo tail -n 200 /var/log/nginx/access.log
journalctl -u nginx --since "1 hour ago" --no-pager
```

Também verifique erros de:
- **404/403** em `script.js`/`scripts.js`
- **Content-Type** incorreto (JS servido como `text/html`, etc.)
- **Erros de servidor estático** (permission denied, path não encontrado)

### Forçar re-processamento de mensagem
Não aplicável (não há filas/mensageria neste projeto).

> Se o incidente for cache:
- **limpar cache local/servidor/CDN** e forçar revalidação de assets.

Ações típicas:
- Invalidar cache no CDN (PREENCHER fornecedor: CloudFront/Fastly/Akamai/GCP/Azure)
- Atualizar nomes de arquivos com hash (se pipeline existir) — PREENCHER

---

## Troubleshooting

### Problema: Usuário não consegue carregar a página (branco / erro de rede)
**Causa provável:**
- `index.html` ou assets retornando **404/5xx**
- Caminhos errados em deploy (base URL)
- Permissões de arquivo no servidor
- CDN apontando para versão inconsistente

**Como diagnosticar:**
1. Verifique status HTTP:
   ```bash
   curl -I http://localhost:{porta}/
   ```
2. Verifique se os JS principais existem:
   ```bash
   curl -I http://localhost:{porta}/js/script.js
   curl -I http://localhost:{porta}/V2_Bruno/js/scripts.js
   ```
3. Se possível, abra o **DevTools** (ou use logs do navegador via instrutivo) para checar:
   - erros no console
   - quais requests falharam

**Como resolver:**
- Corrigir paths de assets no deploy (ex.: base href, diretórios, names)
- Reenfileirar/redistribuir build correto
- Invalidar cache/CDN para assets quebrados (PREENCHER)

---

### Problema: Botões não executam / operações não aparecem na UI
**Causa provável:**
- Script não carregou (arquivo ausente/404)
- Erro JavaScript em tempo de execução (quebra a execução antes do handler de click)
- Conflito entre v1 e V2 (id/seletores diferentes não existentes no DOM)

**Como diagnosticar:**
1. Confirmar que a JS está carregando (status 200):
   - `js/script.js` (v1) e/ou `V2_Bruno/js/scripts.js` (v2)
2. Verificar erros no console do navegador:
   - `ReferenceError`, `TypeError` (ex.: elemento `result`/`operations` inexistente)
3. Checar se o DOM esperado existe:
   - v2: elementos de input e `result` (PREENCHER ids/classes exatos)
   - v1: campo `operations` e `history-list` (PREENCHER ids exatos)

**Como resolver:**
- Ajustar seletores no JS para bater com o HTML realmente em produção
- Garantir que somente a versão correta (v1 ou v2) está sendo referenciada na página
- Rebuild/redeploy do artefato correto

---

### Problema: Divisão por zero não bloqueia (ou bloqueia incorretamente) — V2
**Causa provável:**
- Validação não está rodando por falha no handler de click (input vazio / event não anexado)
- Lógica de comparação com 0 falha (string `"0"` vs número `0`, espaços, parse)
- Alerta/resultado não atualiza por erro de DOM

**Como diagnosticar:**
1. Testar no browser:
   - input2 = `0`
   - input1 = qualquer número
   - clicar em `/`
2. Confirmar se aparece o alerta esperado:
   - **Texto esperado:** `Não é possível efetuar a divisão por zero`
3. Confirmar se não atualiza o resultado (ou mantém o estado anterior)

**Como resolver:**
- Corrigir parsing/validação no JS (ex.: normalizar string, converter para número)
- Garantir que o elemento de resultado (`result`) existe e está sendo atualizado corretamente
- Revisar anexação do event listener nos botões `name` (baseado no atributo `name`)

---

### Problema: V2 permite calcular com input vazio
**Causa provável:**
- Validação de campos vazios não executa ao clicar (ou usa seletor errado)
- Diferença entre `""`, `" "` e números (`NaN`)

**Como diagnosticar:**
1. Deixar um dos inputs vazio.
2. Clicar em qualquer operação.
3. Verificar se:
   - ocorre alerta
   - o cálculo é impedido

**Como resolver:**
- Ajustar validação para tratar whitespace e `NaN`
- Garantir consistência de ids/seletores do HTML

> Regra conhecida (V2): antes de calcular por clique, deve exibir alerta e impedir cálculo se primeiro **ou** segundo input estiver vazio.

---

### Problema: V1 retorna “Divisão por 0” / Infinity / histórico inconsistente
**Causa provável:**
- Montagem da expressão em v1 permite estados incompletos
- `eval` produz `Infinity/-Infinity` e UI não trata corretamente
- Recalcular após `operationFinished` não deveria executar, mas está acontecendo

**Como diagnosticar:**
1. Construir uma expressão que gere divisão por zero.
2. Verificar o campo de resultado:
   - Regra esperada: se for `Infinity/-Infinity`, exibir `Divisão por 0`
3. Tentar recalcular após finalização:
   - Regra conhecida: ao tentar calcular novamente após `operationFinished`, o cálculo não deve ser executado
4. Conferir histórico:
   - existência e atualização do `history-list` (se aplicável na produção)

**Como resolver:**
- Corrigir condições de bloqueio em `operationFinished`
- Garantir condição para execução apenas se houver pelo menos 2 termos:
  - Regra conhecida: `mountCount().length > 1`
- Ajustar tratamento de `Infinity/-Infinity` no render do resultado

---

### Problema: Usuário consegue digitar “e/E” (notação científica) nos inputs — V2
**Causa provável:**
- Listener de `keypress` não está ativo
- Interação via `keydown` ou `input` está diferente em browsers específicos

**Como diagnosticar:**
1. Focar no input do primeiro/segundo valor.
2. Tentar digitar `e` ou `E`.
3. Confirmar se é bloqueado.

**Como resolver:**
- Atualizar handler para event correto se necessário (PREENCHER técnica)
- Garantir que o código V2 que bloqueia `'E'/'e'` está aplicado

> Regra conhecida (V2): bloqueia tecla `'E'` ou `'e'` nos inputs do primeiro e segundo valor.

---

## Dependências Críticas
| Dependência | O que acontece se cair | Fallback |
|---|---|---|
| Servidor web/CDN que hospeda `index.html` e assets (JS/CSS) | Página não carrega; JS não executa; erros 404/5xx | Servir versão estática via origem alternativa / rollback (PREENCHER) |
| Cache/CDN | Usuários recebem JS antigo incompatível com HTML | Invalidar cache / forçar revalidação (PREENCHER) |
| (Se existir) build pipeline/hosting | Artefatos inconsistentes em produção | rollback para último artefato estável (PREENCHER) |
| Sem backend (neste projeto) | Cálculo continua apenas client-side; falhas indicam problemas de front-end/servidor estático | Atualizar/ajustar JS/paths |

---

## Contatos de Escalação
- **Primeiro:** PREENCHER (Responsável pelo front-end / repositório `FIAP-javascript-calculator`)
- **Segundo:** PREENCHER (SRE/DevOps responsável pelo ambiente/hosting/CDN)

---
> ⚠️ Rascunho gerado automaticamente pelo Alicerce by Malha. Preencha os valores reais de porta, dashboard e comandos antes de mergear.
```