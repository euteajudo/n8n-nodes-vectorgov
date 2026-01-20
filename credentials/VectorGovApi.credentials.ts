import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class VectorGovApi implements ICredentialType {
  name = 'vectorGovApi';
  displayName = 'VectorGov API';
  documentationUrl = 'https://docs.vectorgov.io/sdk/authentication';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Sua API Key do VectorGov. Obtenha em https://vectorgov.io/playground',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://vectorgov.io',
      description: 'URL base da API. Apenas altere se usar instância self-hosted.',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-API-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/v1/sdk/documents',
      method: 'GET',
    },
  };
}
