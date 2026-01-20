# n8n-nodes-vectorgov

Node n8n para busca semântica em documentos jurídicos brasileiros via [VectorGov](https://vectorgov.io).

![VectorGov Node](https://img.shields.io/badge/n8n-community--node-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/npm/v/n8n-nodes-vectorgov)

## Funcionalidades

O node VectorGov permite integrar busca semântica em documentos jurídicos brasileiros aos seus workflows n8n:

- **Buscar**: Busca semântica com filtros por tipo de documento, ano e mais
- **Listar Documentos**: Lista todos os documentos indexados na base
- **Obter Documento**: Obtém detalhes de um documento específico
- **Estimar Tokens**: Estima quantidade de tokens para uso com LLMs
- **Enviar Feedback**: Envia avaliação (like/dislike) para melhorar os resultados

## Instalação

### Via n8n Community Nodes

1. Vá em **Settings** > **Community Nodes**
2. Clique em **Install**
3. Digite `n8n-nodes-vectorgov`
4. Aceite os riscos e clique em **Install**

### Via npm (self-hosted)

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-vectorgov
```

## Configuração

### Obter API Key

1. Acesse [https://vectorgov.io/playground](https://vectorgov.io/playground)
2. Faça login ou crie uma conta
3. Gere uma nova API Key
4. Copie a chave (formato: `vg_xxx...`)

### Configurar Credenciais no n8n

1. No n8n, vá em **Credentials** > **New**
2. Procure por "VectorGov API"
3. Cole sua API Key
4. Salve

## Operações

### Buscar

Realiza busca semântica nos documentos jurídicos.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| Query | string | Sim | Pergunta ou termo de busca |
| Quantidade de Resultados | number | Não | Máximo de resultados (1-20, padrão: 5) |
| Modo de Busca | select | Não | Padrão, Rápido ou Preciso |
| Filtros | collection | Não | Tipo de documento, ano, ID |
| Opções Avançadas | collection | Não | System prompt para LLMs |

**Exemplo de saída:**

```json
{
  "success": true,
  "total": 5,
  "query_id": "abc123...",
  "hits": [
    {
      "chunk_id": "LEI-14133-2021#ART-033",
      "text": "Art. 33. O julgamento das propostas...",
      "score": 0.95,
      "document_id": "LEI-14133-2021",
      "article_number": "33"
    }
  ]
}
```

### Listar Documentos

Lista todos os documentos indexados.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| Limite | number | Não | Máximo de documentos (padrão: 50) |

### Obter Documento

Obtém detalhes de um documento específico.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| ID do Documento | string | Sim | Ex: LEI-14133-2021 |

### Estimar Tokens

Estima quantidade de tokens de um contexto para uso com LLMs.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| Contexto | string | Sim | Texto para estimar |
| Query | string | Não | Pergunta do usuário |
| System Prompt | string | Não | System prompt |

**Exemplo de saída:**

```json
{
  "success": true,
  "context_tokens": 1500,
  "query_tokens": 10,
  "system_tokens": 200,
  "total_tokens": 1710
}
```

### Enviar Feedback

Envia avaliação de uma busca para melhorar resultados futuros.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| Query ID | string | Sim | ID retornado na busca |
| Avaliação | select | Sim | Like ou Dislike |

## Exemplos de Workflows

### 1. Busca via Webhook

Recebe uma pergunta via HTTP e retorna resultados da busca.

```
[Webhook] → [VectorGov: Buscar] → [Respond to Webhook]
```

<details>
<summary>📋 Clique para copiar o workflow JSON</summary>

```json
{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "busca-juridica",
        "responseMode": "responseNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "operation": "search",
        "query": "={{ $json.body.query }}",
        "topK": 5,
        "searchMode": "default"
      },
      "name": "VectorGov",
      "type": "n8n-nodes-vectorgov.vectorGov",
      "position": [450, 300],
      "credentials": {
        "vectorGovApi": {
          "id": "SEU_CREDENTIAL_ID",
          "name": "VectorGov API"
        }
      }
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      },
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [650, 300]
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "VectorGov", "type": "main", "index": 0 }]] },
    "VectorGov": { "main": [[{ "node": "Respond", "type": "main", "index": 0 }]] }
  }
}
```

</details>

### 2. Integração com OpenAI (RAG Completo)

Busca contexto no VectorGov e gera resposta com GPT-4.

```
[Webhook] → [VectorGov: Buscar] → [Code: Formatar] → [OpenAI: Chat] → [Respond to Webhook]
```

<details>
<summary>📋 Clique para copiar o workflow JSON</summary>

```json
{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "chat-juridico",
        "responseMode": "responseNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [200, 300]
    },
    {
      "parameters": {
        "operation": "search",
        "query": "={{ $json.body.query }}",
        "topK": 5,
        "searchMode": "precise",
        "advancedOptions": {
          "includeSystemPrompt": true,
          "promptStyle": "detailed"
        }
      },
      "name": "VectorGov",
      "type": "n8n-nodes-vectorgov.vectorGov",
      "position": [400, 300],
      "credentials": {
        "vectorGovApi": {
          "id": "SEU_CREDENTIAL_ID",
          "name": "VectorGov API"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const hits = $input.first().json.hits || [];\nconst context = hits.map(h => `[${h.chunk_id}] ${h.text}`).join('\\n\\n');\nconst systemPrompt = $input.first().json.system_prompt || 'Você é um assistente jurídico especializado em licitações.';\n\nreturn {\n  systemPrompt,\n  context,\n  query: $('Webhook').first().json.body.query,\n  queryId: $input.first().json.query_id\n};"
      },
      "name": "Formatar Contexto",
      "type": "n8n-nodes-base.code",
      "position": [600, 300]
    },
    {
      "parameters": {
        "model": "gpt-4o-mini",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "={{ $json.systemPrompt }}"
            },
            {
              "role": "user",
              "content": "Contexto:\n{{ $json.context }}\n\nPergunta: {{ $json.query }}"
            }
          ]
        }
      },
      "name": "OpenAI",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "position": [800, 300],
      "credentials": {
        "openAiApi": {
          "id": "SEU_OPENAI_CREDENTIAL_ID",
          "name": "OpenAI API"
        }
      }
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { answer: $json.message.content, query_id: $('Formatar Contexto').first().json.queryId } }}"
      },
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1000, 300]
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "VectorGov", "type": "main", "index": 0 }]] },
    "VectorGov": { "main": [[{ "node": "Formatar Contexto", "type": "main", "index": 0 }]] },
    "Formatar Contexto": { "main": [[{ "node": "OpenAI", "type": "main", "index": 0 }]] },
    "OpenAI": { "main": [[{ "node": "Respond", "type": "main", "index": 0 }]] }
  }
}
```

</details>

### 3. Chatbot no Telegram

```
[Telegram Trigger] → [VectorGov: Buscar] → [OpenAI: Chat] → [Telegram: Send Message]
```

### 4. Monitoramento de Documentos com Notificação

Verifica novos documentos diariamente e notifica no Slack.

```
[Schedule (diário)] → [VectorGov: Listar Documentos] → [IF novo documento] → [Slack: Send Message]
```

<details>
<summary>📋 Clique para copiar o workflow JSON</summary>

```json
{
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{ "field": "hours", "hoursInterval": 24 }]
        }
      },
      "name": "Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [200, 300]
    },
    {
      "parameters": {
        "operation": "listDocuments",
        "limit": 100
      },
      "name": "VectorGov",
      "type": "n8n-nodes-vectorgov.vectorGov",
      "position": [400, 300],
      "credentials": {
        "vectorGovApi": {
          "id": "SEU_CREDENTIAL_ID",
          "name": "VectorGov API"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const docs = $input.first().json.documents || [];\nconst ontem = new Date(Date.now() - 24*60*60*1000);\nconst novos = docs.filter(d => new Date(d.created_at) > ontem);\n\nif (novos.length === 0) {\n  return [];\n}\n\nreturn novos.map(d => ({ json: d }));"
      },
      "name": "Filtrar Novos",
      "type": "n8n-nodes-base.code",
      "position": [600, 300]
    },
    {
      "parameters": {
        "channel": "#juridico",
        "text": "📄 Novo documento indexado: *{{ $json.document_id }}*\nTipo: {{ $json.tipo_documento }}\nAno: {{ $json.ano }}"
      },
      "name": "Slack",
      "type": "n8n-nodes-base.slack",
      "position": [800, 300],
      "credentials": {
        "slackApi": {
          "id": "SEU_SLACK_CREDENTIAL_ID",
          "name": "Slack API"
        }
      }
    }
  ],
  "connections": {
    "Schedule": { "main": [[{ "node": "VectorGov", "type": "main", "index": 0 }]] },
    "VectorGov": { "main": [[{ "node": "Filtrar Novos", "type": "main", "index": 0 }]] },
    "Filtrar Novos": { "main": [[{ "node": "Slack", "type": "main", "index": 0 }]] }
  }
}
```

</details>

### 5. Feedback Automático com Análise de Sentimento

Coleta feedback de usuários e envia para o VectorGov automaticamente.

```
[Webhook] → [OpenAI: Análise Sentimento] → [VectorGov: Send Feedback]
```

## Documentos Disponíveis

A base do VectorGov inclui documentos jurídicos brasileiros relacionados a licitações e contratos:

- **Lei 14.133/2021** - Nova Lei de Licitações
- **Lei 13.303/2016** - Lei das Estatais
- **Decreto 10.947/2021** - Regulamenta a Lei 14.133
- **Instruções Normativas** - IN 58, 65, 81/2022
- **Portarias** - Diversas portarias SEGES

## Limites e Rate Limiting

| Plano | Requisições/minuto |
|-------|-------------------|
| Free | 60 |
| Basic | 100 |
| Pro | 500 |

Verifique seu limite em [https://vectorgov.io/playground](https://vectorgov.io/playground).

## Troubleshooting

### Erro 401 - Unauthorized

**Causa**: API Key inválida ou não configurada.

**Solução**:
1. Verifique se a API Key está correta em **Credentials**
2. Confirme que a chave começa com `vg_`
3. Gere uma nova chave em [vectorgov.io/playground](https://vectorgov.io/playground)

### Erro 429 - Rate Limit Exceeded

**Causa**: Limite de requisições por minuto excedido.

**Solução**:
1. Aguarde 60 segundos antes de tentar novamente
2. Reduza a frequência de requisições no workflow
3. Considere upgrade do plano em [vectorgov.io](https://vectorgov.io)

### Node não aparece no n8n

**Causa**: Instalação incompleta ou cache.

**Solução**:
1. Reinicie o n8n
2. Para Docker: `docker restart n8n`
3. Para instalação local: `n8n start --tunnel`
4. Verifique logs: `docker logs n8n`

### Resultados vazios na busca

**Causa**: Query muito específica ou filtros restritivos.

**Solução**:
1. Tente uma query mais genérica
2. Remova filtros de ano/tipo de documento
3. Verifique se o documento existe com "Listar Documentos"

### Timeout em buscas

**Causa**: Modo "Preciso" pode demorar mais.

**Solução**:
1. Use modo "Rápido" para respostas mais rápidas
2. Reduza o número de resultados (top_k)
3. Aumente o timeout do n8n se necessário

## Changelog

### v0.1.0 (2025-01-20)
- 🎉 Lançamento inicial
- ✅ Operação Search com filtros e modos de busca
- ✅ Operação List Documents
- ✅ Operação Get Document
- ✅ Operação Estimate Tokens
- ✅ Operação Send Feedback
- ✅ Suporte a system prompts para integração com LLMs

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## Suporte

- **Documentação**: [https://docs.vectorgov.io](https://docs.vectorgov.io)
- **Issues**: [GitHub Issues](https://github.com/euteajudo/n8n-nodes-vectorgov/issues)
- **Email**: contato@vectorgov.io

## Licença

MIT - veja [LICENSE](LICENSE) para detalhes.

## Links

- [VectorGov](https://vectorgov.io)
- [SDK Python](https://pypi.org/project/vectorgov/)
- [SDK TypeScript](https://www.npmjs.com/package/vectorgov)
- [n8n](https://n8n.io)
