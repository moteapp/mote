## Enable on an existing cluster
```
az aks approuting enable --resource-group <ResourceGroupName> --name <ClusterName>
``` 

## Verify the managed Ingress was created
You can verify the managed Ingress was created using the kubectl get ingress command.
```
kubectl get ingress -n app-routing-system
```

## Remove the application routing add-on
To remove the associated namespace, use the kubectl delete namespace command.
```
kubectl delete namespace app-routing-system
```
To remove the application routing add-on from your cluster
```
az aks approuting disable --name myAKSCluster --resource-group myResourceGroup
```