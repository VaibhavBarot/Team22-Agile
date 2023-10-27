
pipeline {
  agent any
    
  tools {nodejs "NodeJS"}
    
  stages {
        
    stage('Git') {
      steps {
        git 'https://github.com/VaibhavBarot/Team22-Agile.git'
      }
    }
     
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    
    stage('Test') {
      steps {
        sh 'npm i -g forever'
        sh 'forever start app.js'
        sh 'npm test'
        sh 'npm uninstall -g forever'
      }
    }
    
  }
}