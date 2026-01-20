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

### 2. Integração com OpenAI

Busca contexto no VectorGov e gera resposta com GPT-4.

```
[Webhook] → [VectorGov: Buscar] → [OpenAI: Chat] → [Respond to Webhook]
```

Configuração do OpenAI:
- Use o campo `system_prompt` retornado pelo VectorGov (ative "Incluir System Prompt")
- Passe os `hits` como contexto no user message

### 3. Chatbot no Telegram

```
[Telegram Trigger] → [VectorGov: Buscar] → [OpenAI: Chat] → [Telegram: Send Message]
```

### 4. Monitoramento de Documentos

Verifica novos documentos diariamente e notifica no Slack.

```
[Schedule (diário)] → [VectorGov: Listar Documentos] → [IF novo documento] → [Slack: Send Message]
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
