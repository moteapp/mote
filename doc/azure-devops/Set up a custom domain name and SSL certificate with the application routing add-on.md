## Prerequisites
* An AKS cluster with the [application routing add-on](Managed%20NGINX%20ingress%20with%20the%20application%20routing%20add-on.md).
* Azure Key Vault for configure SSL termination
* Azure DNS configure for hostname


## Connect to your AKS cluster
```
az aks get-credentials --resource-group <ResourceGroupName> --name <ClusterName>
```

## Enable Azure DNS integration

### Attach Azure DNS zone to the application routing add-on
1. Retrieve the resource ID for the DNS zone
```
ZONEID=$(az network dns zone show --resource-group <ResourceGroupName> --name <ZoneName> --query "id" --output tsv)
```
2. Update the add-on to enable the integration with Azure DNS
```
az aks approuting zone add --resource-group <ResourceGroupName> --name <ClusterName> --ids=${ZONEID} --attach-zones
```

## Enable Azure Key Vault integration
1. Retrieve the Azure Key Vault resource ID.
```
KEYVAULTID=$(az keyvault show --name <KeyVaultName> --query "id" --output tsv)
```
2. Then update the app routing add-on to enable the Azure Key Vault secret store CSI driver and apply the role assignment.
```
az aks approuting update --resource-group <ResourceGroupName> --name <ClusterName> --enable-kv --attach-kv ${KEYVAULTID}
```
