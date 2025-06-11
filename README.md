# Deploy Node.js App to AKS with ArgoCD
This project demonstrates how to build a simple Node.js application, containerize it using Docker, push the image to Azure Container Registry (ACR), and deploy it to an Azure Kubernetes Service (AKS) cluster using ArgoCD for continuous deployment. ArgoCD manages the Kubernetes manifests stored in a Git repository, ensuring automated updates to the AKS cluster when changes are pushed. This README provides step-by-step instructions to set up, build, and deploy the project.

## Project Overview
- Prerequisites
- Project Structure
- Setup Instructions
   - Clone the Repository
   - Set Up Azure Resources
   - Configure Azure Container Registry (ACR)
   -  Build and Push Docker Image
   -  Set Up AKS Cluster
   -  Install and Configure ArgoCD
   -  Deploy to AKS via ArgoCD

- Kubernetes and ArgoCD Configuration

## Project Overview
The project automates the deployment of a Node.js application to AKS using a GitOps approach with ArgoCD. The workflow includes:
- Building a Docker image of a simple Express app.
- Pushing the image to ACR  and docker hub.
- Storing Kubernetes manifests in a Git repository.
- Using ArgoCD to sync the manifests with the AKS cluster for continuous deployment.
  
## Prerequisites
- Node.js: Version 18.x or later (nodejs.org).
- Docker: Installed and running (docker.com).
- Azure CLI: Version 2.30 or later (Azure CLI documentation).
- Kubectl: Kubernetes command-line tool (Kubernetes documentation).
- Git: For cloning and managing repositories (git-scm.com).
- ArgoCD CLI: For managing ArgoCD (ArgoCD documentation).
- Azure Subscription: Active subscription for AKS and ACR.
- GitHub Account: For hosting the application and manifest repositories.

  ## Setup Instructions
  Clone the Repository
  ```
  git clone https://github.com/your-username/node-aks-argocd.git
  cd node-aks-argocd
  ```
  ## Set Up Azure Resources
  ```
  az group create --name myResourceGroup --location eastus
  az acr create --resource-group myResourceGroup --name myAcrRegistry --sku Basic
  az acr create --resource-group myResourceGroup --name myAcrRegistry --sku Basic
  ```
 ##  Build and push:

 ```
docker build -t my-node-app:latest .
docker tag my-node-app:latest myAcrRegistry.azurecr.io/my-node-app:latest
docker push myAcrRegistry.azurecr.io/my-node-app:latest

```
## Set Up AKS
```
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 2
az aks update --resource-group myResourceGroup --name myAKSCluster --attach-acr myAcrRegistry
```
## Install and Configure ArgoCD
```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
argocd app create nodejs-app \
  --repo https://github.com/your-username/node-aks-manifests.git \
  --path k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default \
  --sync-policy automated
```
![argocd deployment](https://github.com/rukevweubio/GITHUB-DEPLOYMENT-AKS-CLUSTER-ARGOCD-DOCKERIZE-NODE-JS-APP/blob/main/PICTURE/Screenshot%20(1114).png)
## Expose ArgoCD:
```
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```
## Deploy with ArgoCD
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodejs-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nodejs-app
  template:
    metadata:
      labels:
        app: nodejs-app
    spec:
      containers:
      - name: nodejs-app
        image: myAcrRegistry.azurecr.io/my-node-app:latest
        ports:
        - containerPort: 3000

apiVersion: v1
kind: Service
metadata:
  name: nodejs-app-service
spec:
  selector:
    app: nodejs-app
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```
## argocd  deployment
![argocd deployment](https://github.com/rukevweubio/GITHUB-DEPLOYMENT-AKS-CLUSTER-ARGOCD-DOCKERIZE-NODE-JS-APP/blob/main/PICTURE/Screenshot%20(1113).png)

![argocd deployment](https://github.com/rukevweubio/GITHUB-DEPLOYMENT-AKS-CLUSTER-ARGOCD-DOCKERIZE-NODE-JS-APP/blob/main/PICTURE/Screenshot%20(1112).png)









