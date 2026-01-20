# Submissão para n8n Community Nodes

## Status: Pronto para Submissão

O pacote `n8n-nodes-vectorgov` foi publicado no npm e está pronto para ser listado no marketplace da comunidade n8n.

## Link do Pacote npm

**https://www.npmjs.com/package/n8n-nodes-vectorgov**

## Passos para Submissão

### 1. Adicionar ao n8n Community Nodes Registry

O n8n mantém um registro de community nodes em:
https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/community-nodes.md

Para ser listado, abra um **Pull Request** adicionando o pacote à lista:

```markdown
| n8n-nodes-vectorgov | Busca semântica em documentos jurídicos brasileiros | souzat19 |
```

### 2. Verificar Requisitos n8n

✅ **Requisitos atendidos:**

- [x] Pacote publicado no npm com acesso público
- [x] Nome segue convenção `n8n-nodes-*`
- [x] Licença MIT
- [x] README com documentação completa
- [x] Credenciais configuradas corretamente
- [x] TypeScript compilado para JavaScript
- [x] Ícone SVG incluído
- [x] package.json com campos n8n corretos

### 3. Link para o PR Template

Acesse: https://github.com/n8n-io/n8n/compare

**Título sugerido para o PR:**
```
feat(community): Add n8n-nodes-vectorgov - Brazilian legal documents semantic search
```

**Descrição sugerida:**
```markdown
## Summary

This PR adds `n8n-nodes-vectorgov` to the community nodes list.

## Package Details

- **Name**: n8n-nodes-vectorgov
- **npm**: https://www.npmjs.com/package/n8n-nodes-vectorgov
- **GitHub**: https://github.com/euteajudo/n8n-nodes-vectorgov
- **Author**: souzat19

## Description

Node for semantic search in Brazilian legal documents via VectorGov API.

### Operations:
- **Search**: Semantic search with filters
- **List Documents**: List all indexed documents
- **Get Document**: Get document details
- **Estimate Tokens**: Estimate tokens for LLM integration
- **Send Feedback**: Send user feedback (like/dislike)

### Use Cases:
- Legal chatbots for public agencies
- RAG pipelines with OpenAI/Gemini
- Document monitoring automation
- Compliance verification workflows

## Screenshots

(Screenshots can be added here)

## Testing

The node has been tested with n8n version 1.x and works correctly.
```

## Divulgação Adicional

### n8n Community Forum

Poste no fórum da comunidade: https://community.n8n.io/

**Título:**
```
[New Node] VectorGov - Semantic Search for Brazilian Legal Documents
```

**Conteúdo:**
```markdown
Hey community! 👋

I've just published a new community node for semantic search in Brazilian legal documents.

**What it does:**
- Searches through laws, decrees, and regulations using AI
- Perfect for building legal chatbots
- Integrates seamlessly with OpenAI, Google Gemini, Claude, etc.

**Install:**
Settings > Community Nodes > Install > `n8n-nodes-vectorgov`

**npm:** https://www.npmjs.com/package/n8n-nodes-vectorgov
**GitHub:** https://github.com/euteajudo/n8n-nodes-vectorgov

Would love to hear your feedback! 🇧🇷
```

### LinkedIn / Twitter

```
🚀 Just released n8n-nodes-vectorgov!

Build legal chatbots for Brazilian documents with semantic search + your favorite LLM.

Works with OpenAI, Gemini, Claude...

Install in n8n: Settings > Community Nodes > n8n-nodes-vectorgov

#n8n #automation #legaltech #AI #RAG
```

## Métricas de Sucesso

Após a submissão, monitorar:

- [ ] Downloads no npm
- [ ] Stars no GitHub
- [ ] Issues/PRs da comunidade
- [ ] Menções no fórum n8n

## Comandos Úteis

```bash
# Ver estatísticas do pacote
npm info n8n-nodes-vectorgov

# Ver downloads
npm info n8n-nodes-vectorgov downloads

# Testar instalação local
cd ~/.n8n/nodes && npm install n8n-nodes-vectorgov
```
