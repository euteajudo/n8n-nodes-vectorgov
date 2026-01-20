import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { searchOperation } from './actions/search.operation';
import { listDocumentsOperation } from './actions/listDocuments.operation';
import { getDocumentOperation } from './actions/getDocument.operation';
import { estimateTokensOperation } from './actions/estimateTokens.operation';
import { sendFeedbackOperation } from './actions/sendFeedback.operation';

export class VectorGov implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'VectorGov',
    name: 'vectorGov',
    icon: 'file:vectorgov.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Busca semântica em documentos jurídicos brasileiros',
    defaults: {
      name: 'VectorGov',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'vectorGovApi',
        required: true,
      },
    ],
    properties: [
      // ===== OPERAÇÃO =====
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Buscar',
            value: 'search',
            description: 'Busca semântica nos documentos jurídicos',
            action: 'Buscar documentos',
          },
          {
            name: 'Listar Documentos',
            value: 'listDocuments',
            description: 'Lista todos os documentos indexados',
            action: 'Listar documentos',
          },
          {
            name: 'Obter Documento',
            value: 'getDocument',
            description: 'Obtém detalhes de um documento específico',
            action: 'Obter documento',
          },
          {
            name: 'Estimar Tokens',
            value: 'estimateTokens',
            description: 'Estima quantidade de tokens de um contexto',
            action: 'Estimar tokens',
          },
          {
            name: 'Enviar Feedback',
            value: 'sendFeedback',
            description: 'Envia avaliação (like/dislike) de uma busca',
            action: 'Enviar feedback',
          },
        ],
        default: 'search',
      },

      // ===== SEARCH =====
      {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['search'],
          },
        },
        description: 'Pergunta ou termo de busca',
        placeholder: 'Ex: O que é ETP?',
      },
      {
        displayName: 'Quantidade de Resultados',
        name: 'topK',
        type: 'number',
        default: 5,
        displayOptions: {
          show: {
            operation: ['search'],
          },
        },
        description: 'Número máximo de resultados (1-20)',
        typeOptions: {
          minValue: 1,
          maxValue: 20,
        },
      },
      {
        displayName: 'Modo de Busca',
        name: 'searchMode',
        type: 'options',
        default: 'default',
        displayOptions: {
          show: {
            operation: ['search'],
          },
        },
        options: [
          {
            name: 'Padrão',
            value: 'default',
            description: 'Balanceado entre velocidade e precisão',
          },
          {
            name: 'Rápido',
            value: 'fast',
            description: 'Mais rápido, sem reranking',
          },
          {
            name: 'Preciso',
            value: 'precise',
            description: 'Mais lento, com HyDE e reranking',
          },
        ],
      },
      {
        displayName: 'Filtros',
        name: 'filters',
        type: 'collection',
        placeholder: 'Adicionar Filtro',
        default: {},
        displayOptions: {
          show: {
            operation: ['search'],
          },
        },
        options: [
          {
            displayName: 'Tipo de Documento',
            name: 'documentType',
            type: 'options',
            default: '',
            options: [
              { name: 'Todos', value: '' },
              { name: 'Lei', value: 'LEI' },
              { name: 'Decreto', value: 'DECRETO' },
              { name: 'Instrução Normativa', value: 'IN' },
              { name: 'Portaria', value: 'PORTARIA' },
            ],
          },
          {
            displayName: 'Ano',
            name: 'year',
            type: 'number',
            default: 0,
            description: 'Filtrar por ano (0 = todos)',
          },
          {
            displayName: 'ID do Documento',
            name: 'documentId',
            type: 'string',
            default: '',
            description: 'Buscar em documento específico (ex: LEI-14133-2021)',
          },
        ],
      },
      {
        displayName: 'Opções Avançadas',
        name: 'advancedOptions',
        type: 'collection',
        placeholder: 'Adicionar Opção',
        default: {},
        displayOptions: {
          show: {
            operation: ['search'],
          },
        },
        options: [
          {
            displayName: 'Incluir System Prompt',
            name: 'includeSystemPrompt',
            type: 'boolean',
            default: false,
            description: 'Incluir system prompt para uso com LLMs externos',
          },
          {
            displayName: 'Estilo do Prompt',
            name: 'promptStyle',
            type: 'options',
            default: 'default',
            options: [
              { name: 'Padrão', value: 'default' },
              { name: 'Conciso', value: 'concise' },
              { name: 'Detalhado', value: 'detailed' },
              { name: 'Chatbot', value: 'chatbot' },
            ],
            description: 'Estilo do system prompt retornado',
          },
        ],
      },

      // ===== LIST DOCUMENTS =====
      {
        displayName: 'Limite',
        name: 'limit',
        type: 'number',
        default: 50,
        displayOptions: {
          show: {
            operation: ['listDocuments'],
          },
        },
        description: 'Número máximo de documentos a retornar',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
      },

      // ===== GET DOCUMENT =====
      {
        displayName: 'ID do Documento',
        name: 'documentId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['getDocument'],
          },
        },
        description: 'ID do documento (ex: LEI-14133-2021)',
        placeholder: 'LEI-14133-2021',
      },

      // ===== ESTIMATE TOKENS =====
      {
        displayName: 'Contexto',
        name: 'context',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['estimateTokens'],
          },
        },
        typeOptions: {
          rows: 5,
        },
        description: 'Texto do contexto para estimar tokens',
      },
      {
        displayName: 'Query',
        name: 'tokenQuery',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['estimateTokens'],
          },
        },
        description: 'Pergunta do usuário (opcional)',
      },
      {
        displayName: 'System Prompt',
        name: 'tokenSystemPrompt',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['estimateTokens'],
          },
        },
        typeOptions: {
          rows: 3,
        },
        description: 'System prompt (opcional)',
      },

      // ===== SEND FEEDBACK =====
      {
        displayName: 'Query ID',
        name: 'queryId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['sendFeedback'],
          },
        },
        description: 'ID da query retornado na busca (campo query_id)',
      },
      {
        displayName: 'Avaliação',
        name: 'rating',
        type: 'options',
        default: 'like',
        displayOptions: {
          show: {
            operation: ['sendFeedback'],
          },
        },
        options: [
          { name: 'Like', value: 'like' },
          { name: 'Dislike', value: 'dislike' },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let result: IDataObject;

        switch (operation) {
          case 'search':
            result = await searchOperation.call(this, i);
            break;
          case 'listDocuments':
            result = await listDocumentsOperation.call(this, i);
            break;
          case 'getDocument':
            result = await getDocumentOperation.call(this, i);
            break;
          case 'estimateTokens':
            result = await estimateTokensOperation.call(this, i);
            break;
          case 'sendFeedback':
            result = await sendFeedbackOperation.call(this, i);
            break;
          default:
            throw new Error(`Operação desconhecida: ${operation}`);
        }

        returnData.push({ json: result });
      } catch (error) {
        if (this.continueOnFail()) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          returnData.push({
            json: { error: errorMessage },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
