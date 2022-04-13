pipeline {
  agent any
    
  
  
  environment {
    NODE_JS = tool name: 'NodeJs', type: 'nodejs'
    IMAGE_REPO = "atul0401/devopstask"
     }
    
  stages {
        
    stage('Git') {
      steps {
        git  'https://github.com/atulkumar04/devops.git'
      }
    }
     
    stage('Build') {
      steps {
        bat 'npm install'
         
      }
    }  
    stage('Building and pushing image') {
      steps {
          bat 'docker build . -t %BUILD_NUMBER%'
          bat 'set BUILD_NUMBER=%BUILD_NUMBER%'
          bat 'echo %BUILD_NUMBER%'
          withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_LOGIN', passwordVariable: 'DH_PASSWORD', usernameVariable: 'DH_USERNAME')]) {
          bat 'docker login -u %DH_USERNAME% -p %DH_PASSWORD%'
           }
          bat 'docker tag %BUILD_NUMBER% %IMAGE_REPO%:%BUILD_NUMBER%'
          bat 'docker push %IMAGE_REPO%:%BUILD_NUMBER%'
        }
      }
      
    stage('Deploy image to minikube kubernetes cluster'){
        
        steps{
            
            withCredentials([file(credentialsId: 'KUBERNETES_CLUSTER_SECRET', variable: 'KUBERNETES_CLUSTER_SECRET')]) {
             bat  'powershell.exe Get-Content -path deployment.yaml | %{$_ -replace "atul0401/devopstask","atul0401/devopstask:%BUILD_NUMBER%"} |Set-Content -Path deployment.yaml'
             bat 'kubectl apply -f deployment.yaml --kubeconfig %KUBERNETES_CLUSTER_SECRET%'
             //bat 'kubectl set image deployments/nodejsapp-pod nodejsapp-pod=atul0401/devopstask:%BUILD_NUMBER% --kubeconfig %KUBERNETES_CLUSTER_SECRET%'
}
            
            
            
        }
    }
      
      
      
  }
}
