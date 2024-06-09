## Configure ACR integration for an existing AKS cluster

### Attach an ACR to an existing AKS cluster
* Integrate an existing ACR with an existing AKS cluster 
```
# Attach using acr-name
az aks update --name myAKSCluster --resource-group myResourceGroup --attach-acr <acr-name>

# Attach using acr-resource-id
az aks update --name myAKSCluster --resource-group myResourceGroup --attach-acr <acr-resource-id>
```