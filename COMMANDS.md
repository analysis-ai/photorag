To deploy the bicep file:

```bash
az deployment group create \
  --resource-group photorag \
  --template-file deploy/main.bicep \
  --parameters acrName=photoragacr webAppName=photoragweb
```

Push the image to the ACR:

```bash
az acr build --resource-group photorag --registry photoragacr --image photoragweb .
```

To register the repo, application, etc:

```bash
githubOrganizationName='analysis-ai'
githubRepositoryName='photorag'

applicationRegistrationDetails=$(az ad app create --display-name 'photorag')
applicationRegistrationObjectId=$(echo $applicationRegistrationDetails | jq -r '.id')
applicationRegistrationAppId=$(echo $applicationRegistrationDetails | jq -r '.appId')

az ad app federated-credential create \
 --id $applicationRegistrationObjectId \
   --parameters "{\"name\":\"photorag\",\"issuer\":\"https://token.actions.githubusercontent.com\",\"subject\":\"repo:${githubOrganizationName}/${githubRepositoryName}:ref:refs/heads/main\",\"audiences\":[\"api://AzureADTokenExchange\"]}"

resourceGroupResourceId=$(az group create --name photorag --location westus --query id --output tsv)

az ad sp create --id $applicationRegistrationObjectId
az role assignment create \
 --assignee $applicationRegistrationAppId \
 --role Contributor \
 --scope $resourceGroupResourceId
```

Prepare GitHub secrets
Run the following code to show you the values you need to create as GitHub secrets:

```bash
echo "AZURE_CLIENT_ID: $applicationRegistrationAppId"
echo "AZURE_TENANT_ID: $(az account show --query tenantId --output tsv)"
echo "AZURE_SUBSCRIPTION_ID: $(az account show --query id --output tsv)"
```
