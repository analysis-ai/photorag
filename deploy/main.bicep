@description('Name for the Azure Container Registry')
param acrName string

param azureAiEndpoint string
param azureOpenAiApiDeploymentName string
param azureOpenAiApiEmbeddingDeploymentName string
param azureOpenAiApiEndpoint string
param azureOpenAiApiInstanceName string
@secure()
param azureOpenAiApiKey string
param azureOpenAiApiVersion string
param azureStorageConnString string
param azureStorageAccountName string
@secure()
param azureStorageAccountKey string
@secure()
param azureVisionApiKey string
@secure()
param photomuseApiKey string

@description('Name for the Web App')
param webAppName string

@description('Location for resources')
param location string = resourceGroup().location

@description('Database URL')
param dbUrl string

@description('Website URL')
param siteUrl string

@description('Email Connection String')
param emailConnString string

resource acr 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' = {
  name: acrName
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    adminUserEnabled: true
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${webAppName}-plan'
  location: location
  kind: 'app,linux'
  properties: {
    reserved: true
  }
  sku: {
    name: 'B3'
    tier: 'Basic'
  }
}

resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    reserved: true
    siteConfig: {
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${acr.properties.loginServer}/'
        }
        {
          name: 'DOCKER_CUSTOM_IMAGE_NAME'
          value: '${acr.properties.loginServer}/${webAppName}:latest'
        }
        {
          name: 'CONTAINER_IMAGE_NAME'
          value: '${acr.properties.loginServer}/${webAppName}:latest'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: acr.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: acr.listCredentials().passwords[0].value
        }
        {
          name: 'DB_URL'
          value: dbUrl
        }
        {
          name: 'AZURE_EMAIL_CONN_STRING'
          value: emailConnString
        }
        {
          name: 'NEXT_PUBLIC_SITE_URL'
          value: siteUrl
        }
        {
          name: 'AZURE_OPENAI_API_DEPLOYMENT_NAME'
          value: azureOpenAiApiDeploymentName
        }
        {
          name: 'AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME'
          value: azureOpenAiApiEmbeddingDeploymentName
        }
        {
          name: 'AZURE_OPENAI_API_INSTANCE_NAME'
          value: azureOpenAiApiInstanceName
        }
        {
          name: 'AZURE_OPENAI_API_VERSION'
          value: azureOpenAiApiVersion
        }
        {
          name: 'AZURE_AI_ENDPOINT'
          value: azureAiEndpoint
        }
        {
          name: 'AZURE_OPENAI_API_ENDPOINT'
          value: azureOpenAiApiEndpoint
        }
        {
          name: 'AZURE_OPENAI_API_KEY'
          value: azureOpenAiApiKey
        }
        {
          name: 'AZURE_STORAGE_CONNECTION_STRING'
          value: azureStorageConnString
        }
        {
          name: 'AZURE_STORAGE_ACCOUNT_NAME'
          value: azureStorageAccountName
        }
        {
          name: 'AZURE_STORAGE_ACCOUNT_KEY'
          value: azureStorageAccountKey
        }
        {
          name: 'AZURE_VISION_API_KEY'
          value: azureVisionApiKey
        }
        {
          name: 'PHOTOMUSE_API_KEY'
          value: photomuseApiKey
        }
      ]
    }
  }
}

output webAppUrl string = webApp.properties.defaultHostName
