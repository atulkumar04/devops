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
    stage('Building image') {
      steps {
          bat 'docker build . -t %BUILD_NUMBER%'
          bat 'docker tag %BUILD_NUMBER% %IMAGE_REPO%:%BUILD_NUMBER%'
          bat 'docker push %IMAGE_REPO%:%BUILD_NUMBER%'
        }
      }
      
      
      
  }
}
   
