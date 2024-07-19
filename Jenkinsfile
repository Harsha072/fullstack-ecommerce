pipeline {
    agent any
    stages {
        stage('Print Environment') {
            steps {
                script {
                    sh 'printenv'
                    sh 'node -v'
                    sh 'npm -v'
                }
            }
        }
        // other stages
    }
}
