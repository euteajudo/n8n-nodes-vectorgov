import { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';

export async function getDocumentOperation(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<IDataObject> {
  const credentials = await this.getCredentials('vectorGovApi');
  const baseUrl = credentials.baseUrl as string;

  const documentId = this.getNodeParameter('documentId', itemIndex) as string;

  const response = await this.helpers.httpRequest({
    method: 'GET' as IHttpRequestMethods,
    url: `${baseUrl}/api/v1/sdk/documents/${encodeURIComponent(documentId)}`,
    json: true,
  });

  return response as IDataObject;
}
