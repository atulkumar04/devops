pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {
        
    stage('Git') {
      steps {
        git clone https://github.com/atulkumar04/devops.git
      }
    }
     
    stage('Build') {
      steps {
         'npm install'
         
      }
    }  

