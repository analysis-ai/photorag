@description('Name for the Azure Container Registry')
param acrName string

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
      ]
    }
  }
}

output webAppUrl string = webApp.properties.defaultHostName
