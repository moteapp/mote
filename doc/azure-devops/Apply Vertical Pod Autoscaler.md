## Deploy VPA on a cluster
1. Enable VPA on an existing cluster, use the --enable-vpa with the [https://learn.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-update] command.
```
az aks update --name myAKSCluster --resource-group myResourceGroup --enable-vpa
```
2. Verify that the Vertical Pod Autoscaler pods
```
kubectl get pods --name kube-system
```

## Create VerticalPodAutoscaler
```
kubectl describe vpa/hamster-vpa
```