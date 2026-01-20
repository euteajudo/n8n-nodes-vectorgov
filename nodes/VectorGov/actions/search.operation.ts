import { IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';

interface SearchFilters {
  documentType?: string;
  year?: number;
  documentId?: string;
}

interface AdvancedOptions {
  includeSystemPrompt?: boolean;
  promptStyle?: string;
}

export async function searchOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<object> {
  const credentials = await this.getCredentials('vectorGovApi');
  const baseUrl = credentials.baseUrl as string;

  // Parâmetros básicos
  const query = this.getNodeParameter('query', itemIndex) as string;
  const topK = this.getNodeParameter('topK', itemIndex) as number;
  const searchMode = this.getNodeParameter('searchMode', itemIndex) as string;

  // Filtros
  const filters = this.getNodeParameter('filters', itemIndex, {}) as SearchFilters;

  // Opções avançadas
  const advancedOptions = this.getNodeParameter('advancedOptions', itemIndex, {}) as AdvancedOptions;

  // Construir body da requisição
  const body: Record<string, unknown> = {
    query,
    top_k: topK,
    mode: searchMode,
  };

  // Adicionar filtros se existirem
  if (filters.documentType) {
    body.document_type = filters.documentType;
  }
  if (filters.year && filters.year > 0) {
    body.year = filters.year;
  }
  if (filters.documentId) {
    body.document_id = filters.documentId;
  }

  // Adicionar opções avançadas
  if (advancedOptions.includeSystemPrompt) {
    body.include_system_prompt = true;
    if (advancedOptions.promptStyle) {
      body.prompt_style = advancedOptions.promptStyle;
    }
  }

  const response = await this.helpers.httpRequest({
    method: 'POST' as IHttpRequestMethods,
    url: `${baseUrl}/api/v1/sdk/search`,
    body,
    json: true,
  });

  return response as object;
}
